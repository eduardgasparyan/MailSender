import {createItem, queryItems} from "../../modules/dynamoDB";
import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';

const getSuccessResponse = require('/src/utils/getSuccessResponse');

const accessSecretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;
const DYNAMODB_USERS_TABLE = process.env.DYNAMODB_USERS_TABLE;
const DYNAMODB_TOKENS_TABLE = process.env.DYNAMODB_TOKENS_TABLE;


const generateAccessToken = async accessTokenData => {
    return jwt.sign({ accessTokenData }, accessSecretKey, { expiresIn: '30m' });
};

const generateRefreshToken = async refreshTokenData => {
    return jwt.sign({ refreshTokenData }, refreshSecretKey, { expiresIn: '30d' });
};


export const handler =  async (event) => {
    let response;
    console.log(event);
    const bodyParsed = JSON.parse(event.body);
    console.log(bodyParsed);
    let params = {
        TableName: DYNAMODB_USERS_TABLE,
        IndexName: 'username-gsi',
        KeyConditions: {
            username: {
                ComparisonOperator: 'EQ',
                AttributeValueList: [`${bodyParsed.username}`],
            },
        },
    }
    console.log(params);
    const user = await queryItems(params);
    console.log(user);
    const Items = user.Items[0];
    console.log(Items);
    const date = new Date();
    const accessExpirationTime = new Date();
    const refreshExpirationTime = new Date();
    date.setMinutes(date.getMinutes());
    refreshExpirationTime.setMinutes(
        refreshExpirationTime.getMinutes() + 30 * 24 * 60,
    );
    accessExpirationTime.setMinutes(accessExpirationTime.getMinutes() + 30);
    const accessTokenData = {
        userId: Items.id,
        expiresIn: accessExpirationTime,
    };
    console.log(Items.id);
    const refreshTokenData = {
        userId: Items.id,
        expiresIn: refreshExpirationTime,
    };
    const hashedPassword = Items.password;
    console.log(bodyParsed.password, hashedPassword);
    if (await bcrypt.compare(bodyParsed.password, hashedPassword)) {
        const tokens = {
            refreshToken: await generateRefreshToken(refreshTokenData),
            accessToken: await generateAccessToken(accessTokenData),
        };
        const token = {
            userId: Items.id,
            tokenId: uuidv4(),
            refreshToken: tokens.refreshToken,
        };
        console.log(token);
        params = {
            TableName: DYNAMODB_TOKENS_TABLE,
            Item: {...token},
        };
        const result =  await createItem(params);
        result.accessToken = tokens.accessToken;
        result.refreshToken = tokens.refreshToken;
        result.Item = Items.id;
        console.log(tokens);
        response = getSuccessResponse(result, 201);
        return response;
    } else {
        console.log('Invalid username or password');
        return {statusCode: 400};
    }
};