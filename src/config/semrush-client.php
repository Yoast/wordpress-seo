<?php

namespace Yoast\WP\SEO\Config;

use Yoast\WP\SEO\Exceptions\OAuth\Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\Tokens\Empty_Property_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\Tokens\Failed_Storage_Exception;
use YoastSEO_Vendor\GuzzleHttp\Client;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\GenericProvider;
use Yoast\WP\SEO\Exceptions\SEMrush\Tokens\Empty_Token_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Values\SEMrush\SEMrush_Token;
use Yoast\WP\SEO\Wrappers\WP_Remote_Handler;

/**
 * Class SEMrush_Client
 */
class SEMrush_Client {

	/**
	 * The option's key.
	 */
	const TOKEN_OPTION = 'semrush_tokens';

	/**
	 * The provider.
	 *
	 * @var GenericProvider
	 */
	protected $provider;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The token.
	 *
	 * @var SEMrush_Token|null
	 */
	protected $token;

	/**
	 * SEMrush_Client constructor.
	 *
	 * @param Options_Helper    $options_helper    The Options_Helper instance.
	 * @param WP_Remote_Handler $wp_remote_handler The request handler.
	 *
	 * @throws Empty_Property_Exception Exception thrown if a token property is empty.
	 */
	public function __construct(
		Options_Helper $options_helper,
		WP_Remote_Handler $wp_remote_handler
	) {
		$this->provider = new GenericProvider(
			[
				'clientId'                => 'yoast',
				'clientSecret'            => 'YdqNsWwnP4vE54WO1ugThKEjGMxMAHJt',
				'redirectUri'             => 'https://oauth.semrush.com/oauth2/yoast/success',
				'urlAuthorize'            => 'https://oauth.semrush.com/oauth2/authorize',
				'urlAccessToken'          => 'https://oauth.semrush.com/oauth2/access_token',
				'urlResourceOwnerDetails' => 'https://oauth.semrush.com/oauth2/resource',
			],
			[
				'httpClient' => new Client( [ 'handler' => $wp_remote_handler ] ),
			]
		);

		$this->options_helper = $options_helper;
		$this->token          = $this->get_token_from_storage();
	}

	/**
	 * Requests the access token and refresh token based on the passed code.
	 *
	 * @param string $code The code to send.
	 *
	 * @return SEMrush_Token The requested tokens.
	 *
	 * @throws Authentication_Failed_Exception Exception thrown if authentication has failed.
	 */
	public function request_tokens( $code ) {
		try {
			$response = $this->provider
				->getAccessToken(
					'authorization_code',
					[
						'code' => $code,
					]
				);

			$token = SEMrush_Token::from_response( $response );

			return $this->store_token( $token );
		} catch ( \Exception $exception ) {
			throw new Authentication_Failed_Exception( $exception );
		}
	}

	/**
	 * Performs an authenticated GET request to the desired URL.
	 *
	 * @param string $url     The URL to send the request to.
	 * @param array  $options The options to pass along to the request.
	 *
	 * @return mixed The parsed API response.
	 *
	 * @throws IdentityProviderException Exception thrown if there's something wrong with the identifying data.
	 * @throws Authentication_Failed_Exception Exception thrown if authentication has failed.
	 * @throws Empty_Token_Exception Exception thrown if the token is empty.
	 */
	public function get( $url, $options = [] ) {
		return $this->do_request( 'GET', $url, $options );
	}

	/**
	 * Performs an authenticated POST request to the desired URL.
	 *
	 * @param string $url     The URL to send the request to.
	 * @param mixed  $body    The data to send along in the request's body.
	 * @param array  $options The options to pass along to the request.
	 *
	 * @return mixed The parsed API response.
	 *
	 * @throws IdentityProviderException Exception thrown if there's something wrong with the identifying data.
	 * @throws Authentication_Failed_Exception Exception thrown if authentication has failed.
	 * @throws Empty_Token_Exception Exception thrown if the token is empty.
	 */
	public function post( $url, $body, $options = [] ) {
		$options['body'] = $body;

		return $this->do_request( 'POST', $url, $options );
	}

	/**
	 * Determines whether or not there are valid tokens available.
	 *
	 * @return bool Whether or not there are valid tokens.
	 */
	public function has_valid_tokens() {
		return ! empty( $this->token ) && $this->token->has_expired() === false;
	}

	/**
	 * Gets the stored tokens and refreshes them if they've expired.
	 *
	 * @return SEMrush_Token The stored tokens.
	 *
	 * @throws Empty_Token_Exception Exception thrown if the token is empty.
	 */
	public function get_tokens() {
		if ( empty( $this->token ) ) {
			throw new Empty_Token_Exception();
		}

		if ( $this->token->has_expired() ) {
			$this->token = $this->refresh_tokens( $this->token );
		}

		return $this->token;
	}

	/**
	 * Retrieves the token from storage.
	 *
	 * @return SEMrush_Token|null The token object. Returns null if none exists.
	 *
	 * @throws Empty_Property_Exception Exception thrown if a token property is empty.
	 */
	public function get_token_from_storage() {
		$tokens = $this->options_helper->get( self::TOKEN_OPTION );

		if ( empty( $tokens ) ) {
			return null;
		}

		return new SEMrush_Token(
			$tokens['access_token'],
			$tokens['refresh_token'],
			$tokens['expires'],
			$tokens['has_expired'],
			$tokens['created_at']
		);
	}

	/**
	 * Stores the passed token.
	 *
	 * @param SEMrush_Token $token The token to store.
	 *
	 * @return SEMrush_Token The stored token.
	 *
	 * @throws Failed_Storage_Exception Exception thrown if storing of the token fails.
	 */
	public function store_token( SEMrush_Token $token ) {
		$saved = $this->options_helper->set( self::TOKEN_OPTION, $token->to_array() );

		if ( $saved === false ) {
			throw new Failed_Storage_Exception();
		}

		return $token;
	}

	/**
	 * Performs the specified request.
	 *
	 * @param string $method  The HTTP method to use.
	 * @param string $url     The URL to send the request to.
	 * @param array  $options The options to pass along to the request.
	 *
	 * @return mixed The parsed API response.
	 *
	 * @throws IdentityProviderException Exception thrown if there's something wrong with the identifying data.
	 * @throws Authentication_Failed_Exception Exception thrown if authentication has failed.
	 * @throws Empty_Token_Exception Exception thrown if the token is empty.
	 */
	protected function do_request( $method, $url, array $options ) {
		$defaults = [
			'headers' => $this->provider->getHeaders(),
			'params'  => [
				'access_token' => $this->get_tokens()->access_token,
			],
		];

		$options = array_merge_recursive( $defaults, $options );

		if ( array_key_exists( 'params', $options ) ) {
			$url .= '?' . http_build_query( $options['params'] );
			unset( $options['params'] );
		}

		$request = $this->provider
			->getAuthenticatedRequest( $method, $url, null, $options );

		return $this->provider->getParsedResponse( $request );
	}

	/**
	 * Refreshes the outdated tokens.
	 *
	 * @param SEMrush_Token $tokens The outdated tokens.
	 *
	 * @return SEMrush_Token The refreshed tokens.
	 *
	 * @throws Authentication_Failed_Exception Exception thrown if authentication has failed.
	 */
	protected function refresh_tokens( SEMrush_Token $tokens ) {
		try {
			$new_tokens = $this->provider->getAccessToken(
				'refresh_token',
				[
					'refresh_token' => $tokens->refresh_token,
				]
			);

			$token = SEMrush_Token::from_response( $new_tokens );

			return $this->store_token( $token );
		} catch ( \Exception $exception ) {
			throw new Authentication_Failed_Exception( $exception );
		}
	}
}
