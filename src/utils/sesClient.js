const { SESClient} = require("@aws-sdk/client-ses");
const REGION = "ap-south-1";
const sesClient = new SESClient({region:REGION, 
    credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAcessKey: process.env.AWS_SES_SECRET_KEY
    }
});
module.exports={sesClient};