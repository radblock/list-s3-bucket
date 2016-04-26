# list-s3-bucket

lambda function to make a list of all the files in one s3 bucket, and put that list into another s3 bucket.

the function expects to find a file called `deps.json`. It should look something like this:

```json
{
  "gif_bucket": "gifs.radblock.xyz",
  "list_bucket": "list.radblock.xyz"
}
```

(ours is generated by the code that creates our s3 buckets).
