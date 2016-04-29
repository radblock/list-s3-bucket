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
        return { "image": 'http://' + S3_BUCKET_TO_WATCH + '/' + file.Key }
      })
      
      var output = {
        "title" : "How long can we tolerate this?",
        "artist" : "Leah Modigliani",
        "description" : "10 images from artist Leah Modigliani's How long can we tolerate this? An incomplete record from 1933-1999 (2016), an installation comprised of press photographs of evictions taken during the years of the Glass-Steagall Act. The installation is also a timeline, a historical archive and a representation of working and middle-class material displacement.\n\nIn the context of an increasingly divisive 2016 federal election, this work speaks to the role of the press in shaping political consensus about what constitutes a shared ethical responsibility towards others.\n\nThe Glass-Steagall act was signed into law shortly after Franklin D. Roosevelt took office in 1933. To accompany the installation, Modigliani appropriated and revised his inaugural address, updating it to speak to the present:  Only a Foolish Opportunist Can Deny the Dark Realities of the Moment: A Presidential Address (2016).\n\nThe relevance of many of FDR’s words eighty-three years later, in conjunction with the past and present evictions of working class people remind us that while democracy is a powerful aspiration, it’s also a broken promise, and a work in progress.",
        "link" : "http://addendum.kadist.org",
        "thumbnail" : "http://40.media.tumblr.com/d0a89770ba30c5c42961a1c77f2a5dd8/tumblr_o2fy50sXY51r3pm3to1_1280.jpg",
        "date" : 1456249277717,
        works: files_list
      }
      
      console.log('files list', files_list)
      console.log('output that looks like add-art\'s thingies', output)
      
      // and upload that list to the list bucket
      s3.putObject({
        Bucket: S3_BUCKET_FOR_LIST,
        ACL: 'public-read',
        Key: 'list.json',
        Body: JSON.stringify(output),
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

