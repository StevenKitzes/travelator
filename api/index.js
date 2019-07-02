const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');

const jsonwebtoken = require('jsonwebtoken');
const jtp = require('jwk-to-pem');

const config = require('../config');

app.use(bodyParser.json());
app.use(cors());

app.post('/', (req, res) => {
    // receive jwt token from user request
    const token = req.body.token;
    const tokenDecoded = jsonwebtoken.decode(token, {complete: true});
    const tokenKeyId = tokenDecoded.header.kid;
    console.log('decoded token:',tokenDecoded);
    console.log('decoded key id:',tokenKeyId);

    // create link to retrieve public key info from cognito
    const pubKeyURL = `https://cognito-idp.${config.cognito.REGION}.amazonaws.com/${config.cognito.USER_POOL_ID}/.well-known/jwks.json`;
    // execute request
    https.get(pubKeyURL, (httpRes) => {
        // gather and concatenate data chunks
        const data = [];
        httpRes.on('data', (chunk) => {
            data.push(chunk);
        });
        httpRes.on('end', () => {
            // turn response into JSON
            const buffer = Buffer.concat(data);
            const bufferJSON = JSON.parse(buffer.toString());
            const keys = bufferJSON.keys;

            // select key with matching keyid
            keys.forEach((key) => {
                if(key.kid === tokenKeyId) {
                    // found matching keyid; convert jwk to pem
                    const pem = jtp(key);
                    // verify token against pem
                    jsonwebtoken.verify(token,pem,{algorithms:['RS256']},(err, result) => {
                        if(err) {
                            console.log('ERROR: verifying jwt:',err);
                            res.send(err);
                            return;
                        }
                        // if expired
                        const date = Math.floor(Date.now()/1000);
                        if(result.exp < date) {
                            console.log('jwt expired!');
                            console.log('expiration:',result.exp);
                            console.log('current date:',date);
                            res.send('Session expired!');
                            return;
                        }
                        console.log('user verified');
                        res.send('user verified');
                        return;
                    })
                }
            });
        })
    });
});

app.listen(8080, ()=>{
    console.log('Application listening on port 8080');
});