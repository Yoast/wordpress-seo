# OAuth Server

This README provides the information needed to understand the workings of the OAuth server created for the Yoast SEO
plugin. The OAuth server uses the [league\oauth2-server](https://github.com/thephpleague/oauth2-server) package which
runs on PHP 7.2 or above. For a full reference on how OAuth 2.0 works, we refer to
[RFC 6749](https://www.rfc-editor.org/rfc/rfc6749).

Note that this implementation of the OAuth 2.0 server only supports the
[Authorization code flow](https://www.rfc-editor.org/rfc/rfc6749#section-4.1). Additionally, only PUBLIC clients should
be added to the registered clients as the source code for this plugin is open source. In order to support public
clients, the PKCE extension for OAuth 2.0 ([RFC 7636](https://tools.ietf.org/html/rfc7636)) was also implemented.

## Setup for the proof of concept

In order to setup the proof of concept application, follow these steps:

1. Setup the Yoast SEO development environment and switch to the `feature\oauth-server` branch.
2. Run `composer install`.
3. Follow the project setup for the [Yoast example OAuth client](https://github.com/KiOui/yoast-example-oauth-client).
4. You can now head over to `localhost:8080` and try to authorize your local installation. A test endpoint was added
to the Yoast SEO plugin to test the access tokens you retrieved.

## Inner workings of the integration

This integration provides a couple of functions:

- Repositories to store Authorization codes, Access tokens and Refresh tokens.
- Implementations for the needed interfaces of Access Tokens, Auth tokens, Refresh Tokens, Clients, Scopes and Users.
- Two presenters to display the authorization page.
- A couple of REST routes to supply the needed endpoints for authorization codes, access tokens and refresh tokens.
Additionally, a REST route is provided for testing whether the requested access token actually works.

### Repositories
Five repositories are defined within the `src/oauth/repositories` folder. Three of these repositories actually save data
to the database. These repositories are:

- `Access_Token_Repository`: The repository that is used to store Access Tokens in the database.
- `Refresh_Token_Repository`: The repository that is used to store Refresh Tokens in the database.
- `Auth_Code_Repository`: The repository that is used to store Authorization Codes in the database.

The other two repositories have the following function:

- `Client_Repository`: This repository stores all valid clients within an `array`. For now, only the test client is
registered in the repository. More clients could be added later on. Note that the choice was made to not save the
clients to the database as we do not want the available clients to be altered by anyone other than Yoast.
- `Scope_Repository`: This repository stores all valid scopes within an `array`. For now, only a test scope is added.
More scopes can be added later on (such as `read`, `write`, `read-posts`, etc.).

All the repositories are used by the `league\oauth2-server` library and implement the required interfaces.

### Models and Values
For all mentioned repositories above, a model (or value) class is implemented as well. The repositories that save data
to the database have a model class representing its data as an object. For the repositories that do not save data to the
database, a value class is implemented.

These models and values are required by the `league\oauth2-server` library and implement the required interfaces.
Additionally, all models also extend the `Model` class to make them compatible with `wordpress-seo`.

### Presenters
Two presenters were created for displaying the authorization page. One is used when the URL that is redirected towards
is formatted incorrectly (this displays an error). The other is used to display a form requesting the user's permission
when authorizing a registered client.

### REST Routes
The following REST routes were created:

- `oauth/authorize`: This endpoint is used to redirect the user to and request an Authorization code. Please note that
this endpoint is not strictly following the REST specification as it returns a 301 redirect. It might be better to
refactor this endpoint to a different admin page.
- `oauth/access-token`: This endpoint is used for both getting an access token and refresh token from an authorization
code and for getting an access token and refresh token from a refresh token.
- `test-endpoint`: This is a test endpoint, making a way to test whether the provided access token works correctly.

#### Securing REST Routes with OAuth 2.0 scopes
Notice that the test endpoint uses the following `permission_callback`:

```php
  'permission_callback'   => [ $this->oauth_helper, 'validate_access_token' ],
```

The `validate_access_token` function will validate whether the request has a valid access token with the required
scopes. Note that required scopes can be added by adding an extra parameter to the `register_rest_route` function:

```php
  'oauth_required_scopes' => [ 'test-scope' ],
```

### The integration itself

The OAuth integration has a couple of main features:

- It adds an admin page for authorization requests.
- It schedules a CRON job to remove old OAuth tokens from the database.
- It creates a public and private key that are saved to the database. Note that these keys are first encrypted and then
saved to the database. See the added `Encryption_Helper` in `src/helpers` for more information about the encryption.
- When the plugin deactivates, all OAuth tokens and the public and private key are removed from the database.

Also note that the integration itself only activates when the `openssl` extension is enabled.
