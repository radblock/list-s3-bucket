var aws = require('aws-sdk')

var S3_BUCKET_TO_WATCH = 'gifs.radblock.xyz'
var S3_BUCKET_FOR_LIST = 'list.radblock.xyz'

exports.handler = function (event, context, callback) {
  'use strict'

  var s3 = new aws.S3()

  s3.listObjects({Bucket: S3_BUCKET_TO_WATCH}, function (err, data) {
    if (err) {
      callback(err)
    } else {
      var files = data.Contents
      var files_list = files.map(function (file) {
        return 'http://' + S3_BUCKET_TO_WATCH + '/' + file.Key
      })
      s3.putObject({
        Bucket: S3_BUCKET_FOR_LIST,
        Key: 'list.json',
        Body: JSON.stringify(files_list),
        ContentType: 'application/json'
      }, function (err, data) {
        if (err) {
          callback(err)
        } else {
          callback(null, data)
        }
      })
    }
  })
}

