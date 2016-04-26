var aws = require('aws-sdk')

// this deps.json file includes the names of the two s3 buckets
// it's generated when our infrastructure (the s3 buckets themselves) are generated
var deps = require('./deps.json')

var S3_BUCKET_TO_WATCH = deps.gif_bucket
var S3_BUCKET_FOR_LIST = deps.list_bucket

// this code gets run by Amazon Lambda.
// lambda wants a function called `exports.handler`, so we'll make one.
exports.handler = function (event, context, callback) {
  'use strict'

  // connect to s3
  var s3 = new aws.S3()

  // get a list of the objects in the gifs bucket
  s3.listObjects({Bucket: S3_BUCKET_TO_WATCH}, function (err, data) {
    if (err) {
      callback(err)
    } else {
      
      // make a list of the file names
      var files = data.Contents
      var files_list = files.map(function (file) {
        return 'http://' + S3_BUCKET_TO_WATCH + '/' + file.Key
      })
      console.log('files list', files_list)
      
      // and upload that list to the list bucket
      s3.putObject({
        Bucket: S3_BUCKET_FOR_LIST,
        ACL: 'public-read',
        Key: 'list.json',
        Body: JSON.stringify(files_list),
        ContentType: 'application/json'
      }, function (err, data) {
        
        // the work is done already, but let's log the results
        if (err) {
          console.log('error', err)
          callback(err)
        } else {
          console.log('return data', data)
          callback(null, data)
        }
      })
    }
  })
}

