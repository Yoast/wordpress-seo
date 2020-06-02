<?php namespace Yoast\WP\SEO\Config;

use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\GenericProvider;
use League\OAuth2\Client\Token\AccessTokenInterface;
use Yoast\WP\SEO\Exceptions\OAuth\OAuth_Authentication_Failed_Exception;
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
	 * @throws OAuth_Authentication_Failed_Exception
	 */
	public function get_access_tokens( $code ) {
		try {
			return $this->provider->getAccessToken( 'authorization_code', [
				'code' => $code,
			] );
		} catch ( IdentityProviderException $e ) {
			throw new OAuth_Authentication_Failed_Exception( $code, $e );
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
