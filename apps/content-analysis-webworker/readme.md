# Content analysis web worker

This is a barebones example web worker to run the Yoast SEO content analysis in a separate thread.

## Getting started

You can run this project locally by executing the following commands.

```shell
yarn        # Install the dependencies.
yarn build  # Build the project.
yarn start  # Start the development server.
```

The server will automatically reload when you make changes to the code inside this app.
Any changes outside the app (e.g. in the `yoastseo` package) will require a call to `yarn` to reload the dependencies.
