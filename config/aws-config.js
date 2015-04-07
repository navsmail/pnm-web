var AWS = require('aws-sdk');

var credentials = new AWS.SharedIniFileCredentials({profile: 'pnm-alpha'});
AWS.config.credentials = credentials;
AWS.config.region = 'us-east-1';

// List specific API versions
// AWS.config.apiVersions = {
//   dynamodb: '2011-12-05',
//   ec2: '2013-02-01',
//   redshift: 'latest'
// }

// Try to use latest available APIs before this date
// AWS.config.apiVersion = '2012-05-04';

module.exports = AWS;
