const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    DeleteCommand
} = require('@aws-sdk/lib-dynamodb');
const jsonwebtoken = require('jsonwebtoken');

const awsConfig = require('./aws-config.json');

// Prefer an IAM role / instance profile in deployed environments. Static
// credentials are only used when present in aws-config.json.
const dynamoClientConfig = { region: awsConfig.region };
if (awsConfig.endpoint) {
    dynamoClientConfig.endpoint = awsConfig.endpoint;
}
if (awsConfig.accessKeyId && awsConfig.secretAccessKey) {
    dynamoClientConfig.credentials = {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey
    };
}
const dynamoDocClient = DynamoDBDocumentClient.from(new DynamoDBClient(dynamoClientConfig));

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));

app.get('/ping/', (req, res) => {
    res.send('pong!');
});

app.post('/save-itinerary/', async (req, res) => {
    const authError = userAuthError(req);
    if(authError) {
        res.send({error: authError});
        return;
    }

    if(!req.body.itinProps) {
        res.send({error: 'Itinerary not detected.'});
        return;
    }

    const itinProps = req.body.itinProps;
    const username = req.body.username;
    const itineraryName = itinProps.itineraryName;

    const dynamoPutParams = {
        TableName: awsConfig.table,
        Item: {
            username: username,
            itineraryName: itineraryName,
            itinerary: JSON.stringify(itinProps.itinerary)
        }
    };

    try {
        await dynamoDocClient.send(new PutCommand(dynamoPutParams));
        res.send({message: "Your itinerary is safe and sound among the clouds!"});
    } catch (err) {
        res.send({error: "Database Error: " + JSON.stringify(err, null, 2)});
    }
});
app.post('/load-itinerary/', async (req, res) => {
    const authError = userAuthError(req);
    if(authError) {
        res.send({error: authError});
        return;
    }

    if(!req.body.username) {
        res.send({error: 'Cannot identify user.'});
        return;
    }

    const username = req.body.username;

    const dynamoGetParams = {
        TableName: awsConfig.table,
        KeyConditionExpression: '#username = :username',
        ExpressionAttributeNames: {
            '#username': 'username'
        },
        ExpressionAttributeValues: {
            ':username': username
        }
    };

    try {
        const data = await dynamoDocClient.send(new QueryCommand(dynamoGetParams));
        res.send(JSON.stringify(data));
    } catch (err) {
        console.log('Database Error:',JSON.stringify(err, null, 2));
        res.send({error: "Database Error :("});
    }
});
app.post('/delete-itinerary/', async (req, res) => {
    const authError = userAuthError(req);
    if(authError) {
        res.send({error: authError});
        return;
    }

    if(!req.body.username) {
        res.send({error: 'Cannot identify user.'});
        return;
    }
    if(!req.body.itineraryName) {
        res.send({error: 'Cannot identify selected itinerary.'});
        return;
    }

    const username = req.body.username;
    const itineraryName = req.body.itineraryName;

    const dynamoDeleteParams = {
        TableName: awsConfig.table,
        Key: {
            'username': username,
            'itineraryName': itineraryName
        }
    };

    try {
        const data = await dynamoDocClient.send(new DeleteCommand(dynamoDeleteParams));
        res.send(JSON.stringify(data));
    } catch (err) {
        console.log('Database Error:',JSON.stringify(err, null, 2));
        res.send({error: "Database Error :("});
    }
});

const certOpts = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.travelator.stevenkitz.es/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.travelator.stevenkitz.es/fullchain.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/api.travelator.stevenkitz.es/chain.pem')
}

const httpsServer = https.createServer(certOpts, app);

httpsServer.listen(awsConfig.port, ()=>{
    console.log('Application listening on port ' + awsConfig.port);
});

function userAuthError(req) {
    if(!req.body.token) {
        return 'Problem authenticating user: no user token provided';
    }
    const token = req.body.token;
    // receive jwt token from incoming client side request
    const tokenDecoded = jsonwebtoken.decode(token, {complete: true});
    const tokenKeyId = tokenDecoded.header.kid;

    // link to retrieve public key info from cognito
    // `https://cognito-idp.${awsConfig.region}.amazonaws.com/${awsConfig['user-pool-id']}/.well-known/jwks.json`;
    const keys = awsConfig["cognito-pub-keys"].keys;

    // select key with matching keyid
    for(let i = 0; i < keys.length; i++) {
        if(keys[i].kid === tokenKeyId) {
            // found matching keyid; convert jwk to a public key object
            const publicKey = crypto.createPublicKey({ key: keys[i], format: 'jwk' });

            // verify token against public key
            let verificationResult;
            try {
                verificationResult = jsonwebtoken.verify(token,publicKey,{algorithms:['RS256']});
            } catch (err) {
                return 'Problem authenticating user: ' + err;
            }
            // if expired
            const date = Math.floor(Date.now()/1000);
            if(verificationResult.exp < date) {
                return 'User session was expired.  You will need to sign out and back in again.';
            }
            return null;
        }
    }
    return 'Authentication public key mismatch.';
}
