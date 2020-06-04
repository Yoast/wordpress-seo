<?php namespace Yoast\WP\SEO\Config;

use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\GenericProvider;
use League\OAuth2\Client\Token\AccessTokenInterface;
use Yoast\WP\SEO\Exceptions\OAuth\OAuth_Authentication_Failed_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Routes\SEMrush_Route;

/**
 * Class SEMrush_Client
 * @package Yoast\WP\SEO\Config
 */
class SEMrush_Client {

	/**
	 * @var GenericProvider
	 */
	private $provider;

	/**
	 * @var SEMrush_Token_Manager
	 */
	private $token_manager;

	public function __construct() {
		$this->provider = new GenericProvider( [
			'clientId'                => '',
			'clientSecret'            => '',
			'redirectUri'             => SEMrush_Route::FULL_AUTHENTICATION_ROUTE,
			'urlAuthorize'            => 'https://oauth.semrush.com/oauth2/authorize',
			'urlAccessToken'          => 'https://oauth.semrush.com/oauth2/access_token',
			'urlResourceOwnerDetails' => 'https://oauth.semrush.com/oauth2/resource',
		] );
	}

	/**
	 * Gets the access token based on the passed code.
	 *
	 * @param string $code The code to send.
	 *
	 * @return bool
	 * @throws OAuth_Authentication_Failed_Exception
	 * @throws \Yoast\WP\SEO\Exceptions\OAuth\OAuth_Expired_Token_Exception
	 * @throws \Yoast\WP\SEO\Exceptions\OAuth\OAuth_Failed_Token_Storage_Exception
	 */
	public function get_access_tokens( $code ) {
		try {
			$response = $this->provider->getAccessToken( 'authorization_code', [
				'code' => $code,
			] );

			// Store tokens
			$this->token_manager = new SEMrush_Token_Manager( $response, new Options_Helper() );

			if ( $this->token_manager->store() === true ) {

			}
		} catch ( IdentityProviderException $e ) {
			throw new OAuth_Authentication_Failed_Exception( $e );
		} catch ( OAuth_Expired_Token_Exception $e ) {
			throw new OAuth_Authentication_Failed_Exception( $e );
		}
	}

	public function get( $url ) {
//		$request = $this->provider->getAuthenticatedRequest(
//			'GET',
//			$url,
//			$accessToken
//		);
	}
	// wrap $provider->getAuthenticatedRequest
}
