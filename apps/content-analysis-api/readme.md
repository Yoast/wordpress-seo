# Content Analysis API
This is a small sample/PoC project to demonstrate how to use yoastseo in a Node.js environment.
Using yoastseo should not require any additional build steps.

## Getting started
```bash
yarn install

# Either
yarn start # Picks a random port.
# Or
PORT=3000 yarn start # Specify a port.
```

## Usage
### /analyze
Send a `GET` request to http://localhost:3000/analyze (or whatever port your app is running on). Pass along a JSON body:
```json
{
  "text": "<p>The text you want to analyze.</p>",
  "keyword": "The keyphrase you want to rank for.",
}
```
You can add any of the properties described by the [`Paper`'s `attributes` parameter](../../packages/yoastseo/src/values/Paper.js) ([see this JSDoc block](https://github.com/Yoast/wordpress-seo/blob/434b6d0eb79659dffe44676da96c1640094137a1/packages/yoastseo/src/values/Paper.js#L26-L40)).

This endpoint will run a set list of assessors on the text and return the results in JSON format.

### /app
Send a `GET` request to http://localhost:3000/app (or whatever port your app is running on).

This will fail with an error. This is to demonstrate that the App class is not (yet) available in the Node.js environment.
