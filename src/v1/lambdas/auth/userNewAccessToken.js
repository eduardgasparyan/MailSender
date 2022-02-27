const jwt = require('jsonwebtoken');
const accessSecretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;
const getSuccessResponse = require('/src/utils/getSuccessResponse');

const generateAccessToken = async accessTokenData => {
    return jwt.sign({ accessTokenData }, accessSecretKey, { expiresIn: '30m' });
};

export const handler  = async (event) => {
    console.log(refreshSecretKey);
    console.log(event);
    let refreshToken = event.headers.Authorization.split(' ')[1];
    const id = event.pathParameters.id;
    console.log(refreshToken, id);
    const decoded = await jwt.verify(refreshToken, refreshSecretKey);
    console.log(decoded);
    try {
        if (id === decoded.refreshTokenData.userId) {
            const date = new Date();
            const accessExpirationTime = new Date();
            date.setMinutes(date.getMinutes());
            accessExpirationTime.setMinutes(accessExpirationTime.getMinutes() + 30);
            const accessTokenData = {
                userId: id,
                expiresIn: accessExpirationTime,
            };
            console.log(accessTokenData);
            const result = {Token: await generateAccessToken(accessTokenData)};
            const response = getSuccessResponse(result, 201);
            console.log(response);
            return response;
        } else {
            return {statusCode: 403};
        }
    } catch(error) {
            return {statusCode: 400}, console.log(error);
        }
};