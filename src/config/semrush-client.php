<?php namespace Yoast\WP\SEO\Config;

use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\GenericProvider;
use Yoast\WP\SEO\Exceptions\OAuth\OAuth_Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Empty_Token_Property_Exception;
use Yoast\WP\SEO\Values\SEMrush\SEMrush_Token;

/**
 * Class SEMrush_Client
 * @package Yoast\WP\SEO\Config
 */
class SEMrush_Client {

	/**
	 * @var GenericProvider
	 */
	protected $provider;

	/**
	 * @var SEMrush_Token_Manager
	 */
	protected $token_manager;

	/**
	 * SEMrush_Client constructor.
	 *
	 * @throws SEMrush_Empty_Token_Property_Exception
	 */
	public function __construct() {
		$this->provider = new GenericProvider( [
			'clientId'                => 'yoast',
			'clientSecret'            => '',
			'redirectUri'             => 'https://oauth.semrush.com/oauth2/yoast/success',
			'urlAuthorize'            => 'https://oauth.semrush.com/oauth2/authorize',
			'urlAccessToken'          => 'https://oauth.semrush.com/oauth2/access_token',
			'urlResourceOwnerDetails' => 'https://oauth.semrush.com/oauth2/resource',
		] );

		$this->token_manager = new SEMrush_Token_Manager();

		// Prime token manager.
		$this->token_manager->get_from_storage();
	}

	/**
	 * Requests the access token and refresh token based on the passed code.
	 *
	 * @param string $code The code to send.
	 *
	 * @return SEMrush_Token The requested tokens.
	 *
	 * @throws OAuth_Authentication_Failed_Exception
	 */
	public function request_tokens( $code ) {
		try {
			$response = $this->provider
				->getAccessToken( 'authorization_code', [
					'code' => $code,
				] );

			$this->token_manager->from_response( $response );

			return $this->token_manager->get_token();
		} catch ( \Exception $exception ) {
			throw new OAuth_Authentication_Failed_Exception( $exception );
		}
	}

	/**
	 * Performs an authenticated GET request to the desired URL.
	 *
	 * @param string $url  The URL to send the request to.
	 * @param mixed  $body The data to send along in the request's body. Optional.
	 *
	 * @return mixed The parsed API response.
	 * @throws IdentityProviderException
	 * @throws OAuth_Authentication_Failed_Exception
	 */
	public function get( $url, $body = null ) {
		return $this->do_request( $url, $body );
	}

	/**
	 * Performs an authenticated POST request to the desired URL.
	 *
	 * @param string $url  The URL to send the request to.
	 * @param mixed  $body The data to send along in the request's body
	 *
	 * @return mixed The parsed API response.
	 * @throws IdentityProviderException
	 * @throws OAuth_Authentication_Failed_Exception
	 */
	public function post( $url, $body ) {
		return $this->do_request( $url, $body, 'POST' );
	}

	/**
	 * Determines whether or not there are valid tokens available.
	 *
	 * @return bool Whether or not there are valid tokens.
	 */
	public function has_valid_tokens() {
		$tokens = $this->token_manager->get_token();

		return ! empty( $tokens ) && $tokens->has_expired() === false;
	}

	/**
	 * Performs the specified request.
	 *
	 * @param string     $url  The URL to send the request to.
	 * @param mixed|null $body The data to send along in the request's body
	 * @param string     $type The type of request.
	 *
	 * @return mixed The parsed API response.
	 * @throws IdentityProviderException
	 * @throws OAuth_Authentication_Failed_Exception
	 */
	protected function do_request( $url, $body, $type = 'GET' ) {
		$request = $this->provider->getAuthenticatedRequest(
			$type,
			$url,
			$this->get_tokens()->get_access_token(),
			[ 'body' => $body ]
		);

		return $this->provider->getParsedResponse( $request );
	}

	/**
	 * Gets the stored tokens and refreshes them if they've expired.
	 *
	 * @return SEMrush_Token The stored tokens.
	 * @throws OAuth_Authentication_Failed_Exception
	 */
	protected function get_tokens() {
		$tokens = $this->token_manager->get_token();

		if ( $tokens->has_expired() ) {
			$tokens = $this->refresh_tokens( $tokens );
		}

		return $tokens;
	}

	/**
	 * Refreshes the outdated tokens.
	 *
	 * @param SEMrush_Token $tokens The outdated tokens.
	 *
	 * @return SEMrush_Token The refreshed tokens.
	 * @throws OAuth_Authentication_Failed_Exception
	 */
	protected function refresh_tokens( SEMrush_Token $tokens ) {
		try {
			$new_tokens = $this->provider->getAccessToken( 'refresh_token', [
				'refresh_token' => $tokens->get_refresh_token(),
			] );

			$this->token_manager->from_response( $new_tokens );

			return $this->token_manager->get_token();
		} catch ( \Exception $exception ) {
			throw new OAuth_Authentication_Failed_Exception( $exception );
		}
	}

}
