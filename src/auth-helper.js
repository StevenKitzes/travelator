import {
    getCurrentUser,
    fetchAuthSession,
    fetchUserAttributes
} from 'aws-amplify/auth';

// Amplify v6 split the old CognitoUser object into separate calls.
// This rebuilds a user object matching the shape the rest of the app expects
// (from Amplify v1), so components can keep reading:
//   user.username
//   user.attributes.email
//   user.signInUserSession.accessToken.jwtToken
//   user.signInUserSession.accessToken.payload.exp
export async function buildCurrentUser() {
    const [currentUser, session, attributes] = await Promise.all([
        getCurrentUser(),
        fetchAuthSession(),
        fetchUserAttributes()
    ]);

    const accessToken = session.tokens && session.tokens.accessToken;

    return {
        username: currentUser.username,
        attributes,
        signInUserSession: {
            accessToken: {
                jwtToken: accessToken ? accessToken.toString() : null,
                payload: accessToken ? accessToken.payload : {}
            }
        }
    };
}
