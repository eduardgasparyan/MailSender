import {createItem, getItem, queryItems,} from "../../modules/dynamoDB";
import logger from '/home/hp/aws-application-example/logger';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
const getSuccessResponse = require('/src/utils/getSuccessResponse');
const DYNAMODB_USERS_TABLE = process.env.DYNAMODB_USERS_TABLE;

export const handler  = async (event) => {
    console.log(event);
    const bodyParsed = JSON.parse(event.body);
        let response;
        let candidate = {};
        try {
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
            candidate = await queryItems(params);
            if (candidate.Count !== 0) {
        console.log('Candidate Already Exists');
        return { statusCode: 600};
        }
        const pass = await bcrypt.hash(bodyParsed.password, 10);
            const newUser = {
            username: bodyParsed.username,
            password: pass,
            email: bodyParsed.email,
            id: uuidv4(),
        };
            console.log(newUser);
            params = {
            TableName: DYNAMODB_USERS_TABLE,
            Item: {
                ...newUser,
            }
        }
            const result ={};
            result.Items = await createItem(params);
            console.log(result);
            response = getSuccessResponse(result, 201);
            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
            return { statusCode:400 };
        }
};
