# Content Analysis API
This is a small sample/PoC project to demonstrate how to use the `yoastseo` package in a Node.js environment.

## Getting started

You can run this project locally by executing the following commands.

First, install the dependencies.

```bash
yarn
```

Then, start the server, with one of the following commands:

```bash
yarn start            # Picks a random port.
PORT=3000 yarn start  # Specify a port (used in documentation).
```

The server will automatically reload when you make changes to the code.

## Usage

This section describes the available endpoints and how to use them.
See the [API documentation](./analyze.http) for additional examples.

### /analyze/{type}
Send a `GET` request to http://localhost:3000/analyze (or whatever port your app is running on). Pass along a JSON body:
```json
{
  "text": "<p>The text you want to analyze.</p>",
  "keyword": "The keyphrase you want to rank for."
}
```
As a response, you will receive a JSON object with the results of the content analysis.

You can add any of the properties described by the [`Paper`'s `attributes` parameter](../../packages/yoastseo/src/values/Paper.js) ([see this JSDoc block](https://github.com/Yoast/wordpress-seo/blob/434b6d0eb79659dffe44676da96c1640094137a1/packages/yoastseo/src/values/Paper.js#L26-L40)).

Possible values for `{type}` are:
- (none) - Run all analyses.
- `seo` - Run the SEO analysis.
- `readability` - Run the readability analysis.
- `inclusive-language` - Runs the inclusive language analysis.
- `related-keyword` - Runs the related keyword analysis.
- `meta-description` - Runs the SEO analysis for the meta description.
- `title` - Runs the SEO analysis for the SEO title.
- `keyword` - Runs the SEO analysis for the focus keyphrase.
- `keyword-use` - Runs the SEO analysis for the keyphrase use in the text.

### /research/{research}

This endpoint fires an individual research on a given `Paper`.

Possible values for `{research}` are:
- `estimated-reading-time`
- `flesch-reading-ease`
- `word-count`
- `sentence-count`
- `paragraph-count`

### /app
Send a `GET` request to http://localhost:3000/app (or whatever port your app is running on).

This will fail with an error. This is to demonstrate that the App class is not (yet) available in the Node.js environment.

_TODO:_
- [ ] Expand: Allow setting a post type (`term`, `product`, etc.), and run the analysis for that specific post type (e.g. for terms, use the `TaxonomyAssessor`).
- [ ] New endpoint: Create an endpoint that tokenizes the given HTML text (see below).
- [ ] New endpoint: Create an endpoint that outputs the configuration data per language.
- [ ] Application: Create a WP-CLI command that fetches a post from WordPress and analyzes it through a (locally running) Yoast SEO (see below).
- [ ] Application: Create a browser extension that allows users to analyze the content of a page they are currently viewing. This could be a simple extension that sends the content of an element to the API and displays the results in a popup.
- [ ] Hosting: Deploy the API to a server and make it available for public use.

### New endpoint: /tokenize

This endpoint parses the given HTML text and returns the sentences and tokens (words or punctuation) in the text, including position information.
This could be relevant for users who are not so much interested in our content analysis, but do like our preprocessing.

### Potential application: WP-CLI command

Fetch a post (in WordPress) and prepares it for processing through Yoast SEO.
The output is a serialized `Paper` object (in JSON format) that can be used in the `analyze` routes above.
