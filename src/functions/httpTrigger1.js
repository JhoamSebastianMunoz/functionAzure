const { app } = require('@azure/functions');
const Handlebars = require('handlebars');
const { EmailClient } = require("@azure/communication-email");
const fs = require('fs');
const path = require('path');

const connectionString = "endpoint=https://emails-adso2801206.unitedstates.communication.azure.com/;accesskey=8FoXn3tHwANGQqUQNyYi09lZWJ4yNvKLoVNj6WQV92eifnsFNH1IJQQJ99AKACULyCps5mg0AAAAAZCSbQ9N";
const client = new EmailClient(connectionString);

app.http('httpTrigger1', {
    methods: ['POST'],

    handler: async (request, context) => {
        const requestData = await request.json();
        const subject = requestData.subject;
        const templateName = requestData.templateName;
        const dataTemplate = requestData.dataTemplate;
        const to = requestData.to;
        const templatePath = path.join(__dirname, templateName);
        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(source);
        const html = template({ name: dataTemplate.name });

        const emailMessage = {
            senderAddress: "DoNotReply@7ccef176-1198-47a4-927a-a7f4bf34479f.azurecomm.net",
            content: {
            subject: subject,
            html: html,
            },
            recipients: {
            to: [{ address: to }],
            },
        };
        const poller = await client.beginSend(emailMessage);
        const result = await poller.pollUntilDone();
        return { body: `email sent successfully` };
    }
});
