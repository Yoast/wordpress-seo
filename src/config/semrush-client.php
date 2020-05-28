<?php namespace Yoast\WP\SEO\Config;

use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\GenericProvider;
use League\OAuth2\Client\Token\AccessTokenInterface;
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
	 * @param $code
	 *
	 * @return \Exception|IdentityProviderException|AccessTokenInterface
	 */
	public function get_access_tokens( $code ) {
		try {
			return $this->provider->getAccessToken( 'authorization_code', [
				'code' => $code,
			] );
		} catch ( IdentityProviderException $e ) {
			return $e;
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
