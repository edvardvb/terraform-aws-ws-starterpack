const ASSET_BUCKET_NAME=''
const VERSION='1'

var AWS = require('aws-sdk');
var fs = require('fs');

var s3 = new AWS.S3();
    var params = {
        Bucket : ASSET_BUCKET_NAME,
        Key : `${VERSION}/main.js`,
        Body : fs.readFileSync('build/main.js'),
        CacheControl: 'public,max-age=31536000,immutable',
        ContentType: "application/json"
    }

s3.putObject(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);
});
