import jwt from "jsonwebtoken";
const accessSecretKey = process.env.ACCESS_TOKEN_SECRET;
const getPolicyDocument = require('/utils/getPolicyDocument');

export const handler =  async (event) => {
    let response;
    console.log(event);
        let accessToken = event.authorizationToken.split(' ')[1];
    console.log(accessToken);
        if (!accessToken) {
            response = getPolicyDocument(false,{});
            return response;
        }
        try {
            const user = await jwt.verify(accessToken, accessSecretKey);
            console.log(user);
            if (user) {
                response = getPolicyDocument(true,{
                    principalId: 'user.accessTokenData.userId', user: 'user.accessTokenData',
                });
                console.log(response);
                return response;
            } else {
                response = getPolicyDocument(false,{});
                return response;
            }
        } catch (err) {
            console.log(err);
            response = getPolicyDocument(false,{});
            return response;
        }
    };