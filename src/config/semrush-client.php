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
		} catch ( \Exception $e ) {
			throw new OAuth_Authentication_Failed_Exception( $e );
		}
	}

	/**
	 * Performs an authenticated GET request to the desired URL.
	 *
	 * @param string $url The URL to send the request to.
	 *
	 * @return mixed The parsed API response.
	 * @throws IdentityProviderException
	 * @throws OAuth_Authentication_Failed_Exception
	 */
	public function get( $url ) {
		$request = $this->provider->getAuthenticatedRequest(
			'GET',
			$url,
			$this->get_tokens()->get_access_token()
		);

		return $this->provider->getParsedResponse( $request );
	}

	/**
	 * Performs an authenticated POST request to the desired URL.
	 *
	 * @param string $url  The URL to send the request to.
	 * @param mixed  $data The data to send along.
	 *
	 * @return mixed The parsed API response.
	 * @throws IdentityProviderException
	 * @throws OAuth_Authentication_Failed_Exception
	 */
	public function post( $url, $data ) {
		$request = $this->provider->getAuthenticatedRequest(
			'POST',
			$url,
			$this->get_tokens()->get_access_token(),
			[ 'body' => $data ]
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
		} catch ( \Exception $e ) {
			throw new OAuth_Authentication_Failed_Exception( $e );
		}
	}

}
