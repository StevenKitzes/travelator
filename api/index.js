const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');

const aws = require('aws-sdk');
const jsonwebtoken = require('jsonwebtoken');
const jtp = require('jwk-to-pem');

const config = require('../src/config');
const awsConfig = require('./aws-config.json');

aws.config.update(awsConfig);
const dynamoDocClient = new aws.DynamoDB.DocumentClient();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));

app.get('/ping/', (req, res) => {
    res.send('pong!');	
});

app.post('/test-user-auth/', (req, res) => {
    const authError = userAuthError(req);
    if(authError) {
        res.send({error: authError});
        return;
    }
    res.send({message: 'User authentication test successful.'});
});

app.post('/save-itinerary/', (req, res) => {
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
        TableName: config.dynamo.TABLE,
        Item: {
            username: username,
            itineraryName: itineraryName,
            itinerary: JSON.stringify(itinProps.itinerary)
        }
    };

    dynamoDocClient.put(dynamoPutParams, (err, data) => {
        if (err) {
            res.send({error: "Database Error: " + JSON.stringify(err, null, 2)});
        } else {
            res.send({message: "Your itinerary is safe and sound among the clouds!"});
        }
    });
});
app.post('/load-itinerary/', (req, res) => {
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
        TableName: config.dynamo.TABLE,
        KeyConditionExpression: '#username = :username',
        ExpressionAttributeNames: {
            '#username': 'username'
        },
        ExpressionAttributeValues: {
            ':username': username
        }
    };

    dynamoDocClient.query(dynamoGetParams, (err, data) => {
        if (err) {
            console.log('Database Error:',JSON.stringify(err, null, 2));
            res.send({error: "Database Error :("});
        } else {
            res.send(JSON.stringify(data));
        }
    });
});
app.post('/delete-itinerary/', (req, res) => {
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
        TableName: config.dynamo.TABLE,
        Key: {
            'username': username,
            'itineraryName': itineraryName
        }
    };

    dynamoDocClient.delete(dynamoDeleteParams, (err, data) => {
        if (err) {
            console.log('Database Error:',JSON.stringify(err, null, 2));
            res.send({error: "Database Error :("});
        } else {
            res.send(JSON.stringify(data));
        }
    });
});

const certOpts = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.travelator.pro/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.travelator.pro/fullchain.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/api.travelator.pro/chain.pem')
}

const httpsServer = https.createServer(certOpts, app);

httpsServer.listen(8080, ()=>{
    console.log('Application listening on port 8080');
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
    // `https://cognito-idp.${config.cognito.REGION}.amazonaws.com/${config.cognito.USER_POOL_ID}/.well-known/jwks.json`;
    keys = config["cognito-pub-keys"].keys;

    // select key with matching keyid
    for(let i = 0; i < keys.length; i++) {
        if(keys[i].kid === tokenKeyId) {
            // found matching keyid; convert jwk to pem
            const pem = jtp(keys[i]);
            
            // verify token against pem
            let verificationResult;
            try {
                verificationResult = jsonwebtoken.verify(token,pem,{algorithms:['RS256']});
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
