const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');

const jsonwebtoken = require('jsonwebtoken');
const jtp = require('jwk-to-pem');

const config = require('../src/config');

app.use(bodyParser.json());
app.use(cors());

app.post('/test-user-auth/', (req, res) => {
    const authResult = validateUserAuth(req.body.token);

    if(authResult.authenticated === true) {
        res.send({message: 'User authenticated!'});
    }
    else {
        res.send({message: authResult.reason});
    }
});

app.listen(8080, ()=>{
    console.log('Application listening on port 8080');
});

function validateUserAuth(token) {
    const authResult = {
        authenticated: false,
        reason: ''
    }
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
                authResult.authenticated = false;
                authResult.reason = err;
                return authResult;
            }
            // if expired
            const date = Math.floor(Date.now()/1000);
            if(verificationResult.exp < date) {
                authResult.authenticated = false;
                authResult.reason = 'Session expired!';
                return authResult;
            }
            authResult.authenticated = true;
            return authResult;
        }
    }
    authResult.authenticated = false;
    authResult.reason = 'Authentication public key mismatch';
}