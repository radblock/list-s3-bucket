var aws = require('aws-sdk')
var deps = require('./deps.json')

var S3_BUCKET_TO_WATCH = deps.gif_bucket
var S3_BUCKET_FOR_LIST = deps.list_bucket

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
      console.log('files list', files_list)
      s3.putObject({
        Bucket: S3_BUCKET_FOR_LIST,
        ACL: 'public-read',
        Key: 'list.json',
        Body: JSON.stringify(files_list),
        ContentType: 'application/json'
      }, function (err, data) {
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

