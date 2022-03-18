const AWS = require("aws-sdk")

AWS.config.update({region: 'us-west-2'})
const credentials = new AWS.SharedIniFileCredentials({profile: 'AWS-Energy-GlobalMidstream-Developer'});
AWS.config.credentials = credentials;