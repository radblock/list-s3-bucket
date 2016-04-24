# list-s3-bucket

lambda function to make a list of all the files in one s3 bucket, and put that list into another s3 bucket.

## lambda component

edit main.js, changing `S3_BUCKET_TO_WATCH` and `S3_BUCKET_FOR_LIST`  to the names of your s3 buckets.

edit package.json and run `npm start` to make the lambda function.

## see also

* https://github.com/claudiajs/claudia

