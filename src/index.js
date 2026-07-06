import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './components/App';

import { Amplify } from 'aws-amplify';
import config from './config';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: config.cognito.USER_POOL_ID,
            userPoolClientId: config.cognito.APP_CLIENT_ID
        }
    }
});

const root = createRoot(document.getElementById('root'));
root.render(<App />);
