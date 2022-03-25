import aws from 'aws-sdk'
const ses = new aws.SES;
import getSuccessResponse from '../../utils/getSuccessResponse';
import mimemessage from 'mimemessage'


export const handler = async (event) => {
    console.log(event);
    let bodyParsed;
    try {
        bodyParsed = event.body;
    } catch (e) {
        console.log(e);
        return { statusCode: 400 }
    }
    let {emailAddress, description, uploadedFiles, uploadedFilename} = bodyParsed;
    uploadedFiles = uploadedFiles.split(',')[1];
    console.log(emailAddress, uploadedFiles, description, uploadedFilename);
    if (!emailAddress || !description || !uploadedFiles) return { statusCode: 400 }
    const mailContent = mimemessage.factory({contentType: 'multipart/mixed', body: []});
    mailContent.header('From', `gisbert.dtrucking@gmail.com`);
    mailContent.header('To', `${emailAddress}`);
    mailContent.header('Subject', `Sent from File Sender`);
    const alternateEntity = mimemessage.factory({
        contentType: 'multipart/alternate',
        body: [description]
    });
    const attachmentEntity = mimemessage.factory({
        contentType: 'text/plain',
        body: uploadedFiles
    });
    attachmentEntity.header('Content-Disposition', `attachment ;filename="${uploadedFilename}"`);
    attachmentEntity.header('Content-Transfer-Encoding', `base64`);
    mailContent.body.push(alternateEntity, attachmentEntity);
    console.log(mailContent);
    try {
        const sendRawResult = await ses.sendRawEmail({
            RawMessage: {Data: mailContent.toString()}
        }).promise();
        console.log(sendRawResult);
        const result = { Items: sendRawResult};
        return getSuccessResponse(result, 200);
    } catch (e) {
        console.log(e);
        return {statusCode: 400}
    }
}


// import {SESClient, SendRawEmailCommand, SendEmailCommand} from "@aws-sdk/client-ses";
// import fs from 'fs'
// import mailcomposer from "mailcomposer";
// import logger from "../../../logger";
// const REGION = "eu-north-1";
// const sesClient = new SESClient({ region: REGION });

// const bodyParsed = JSON.parse(event.body);
// const {emailAddress, description, uploadedFiles} = bodyParsed;
// console.log(emailAddress, uploadedFiles, description)
// if (!emailAddress || !description || !uploadedFiles) return { statusCode: 400 }
// const mail = mailcomposer({
//     from: "gisbert.dtrucking@gmail.com",
//     to: "gisbert.dtrucking@gmail.com",
//     subject: "Sample SES message with attachment",
//     text: "Hey folks, this is a test message from SES with an attachment."
// });
// let params = {
//     Destinations: ['gisbert.dtrucking@gmail.com'],
//     Source: 'gisbert.dtrucking@gmail.com',
//     FromArn: 'arn:aws:ses:eu-north-1:025209864985:identity/gisbert.dtrucking@gmail.com',
//     RawMessage: mail.createReadStream(),
// }
// console.log(params);
// const result = { Items: await sesClient.send(new SendRawEmailCommand(params))};
