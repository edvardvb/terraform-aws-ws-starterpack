const HOST_BUCKET_NAME=''
const ASSET_BUCKET_URL=''
const VERSION='1'

const environment = process.argv[2];


var AWS = require('aws-sdk');
var fs = require('fs');


const url = '';
const sha =VERSION;
const date = new Date().toISOString();

console.log(`ENV_NAME: '${environment}'`)
console.log(`GIT_SHA: '${sha}'`)
console.log(`API_URL: '${url}'`)
console.log(`CREATED_AT: '${date}'`)

const index = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Immutable webapp</title>
    <meta name="description" content="Immutable webapp.">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  </head>
  <body>
       <!-- environment variables -->
       <script>
       env = {
           ENV_NAME: '${environment}',
           GIT_SHA: '${sha}',
           API_URL: '${url}',
           CREATED_AT: '${date}'
       }
       </script>

       <!-- application binding -->
       <app-root></app-root>
       <!-- fully-qualified static assets -->
       <script src="${ASSET_BUCKET_URL}/assets/${sha}/main.js" type="text/javascript"></script>


   </body>
</html>`

var s3 = new AWS.S3();
    var params = {
        Bucket : HOST_BUCKET_NAME,
        Key : 'index.html',
        Body : index,
        CacheControl: 'no-store',
        ContentType: "text/html"
    }

s3.putObject(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);
});
