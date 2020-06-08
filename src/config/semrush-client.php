<?php namespace Yoast\WP\SEO\Config;

use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\GenericProvider;
use Yoast\WP\SEO\Exceptions\OAuth\OAuth_Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\OAuth_Expired_Token_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Empty_Token_Property_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Failed_Token_Storage_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Routes\SEMrush_Route;
use Yoast\WP\SEO\Values\SEMrush\SEMrush_Token;

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

		$this->token_manager = new SEMrush_Token_Manager( new Options_Helper() );

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
		} catch ( IdentityProviderException $e ) {
			throw new OAuth_Authentication_Failed_Exception( $e );
		} catch ( OAuth_Expired_Token_Exception $e ) {
			throw new OAuth_Authentication_Failed_Exception( $e );
		} catch ( SEMrush_Empty_Token_Property_Exception $e ) {
			throw new OAuth_Authentication_Failed_Exception( $e );
		} catch ( SEMrush_Failed_Token_Storage_Exception $e ) {
			throw new OAuth_Authentication_Failed_Exception( $e );
		}
	}

	public function get( $url ) {
		$request = $this->provider->getAuthenticatedRequest(
			'GET',
			$url,
			$this->token_manager->get_token()->get_access_token()
		);
	}

	public function post( $url, $data ) {
		$request = $this->provider->getAuthenticatedRequest(
			'POST',
			$url,
			$this->token_manager->get_token()->get_access_token(),
			[ 'body' => $data ]
		);
	}

	protected function refresh_tokens() {
		$current_token = $this->token_manager->get_token();

		if ( $current_token->has_expired() ) {
			$new_tokens = $this->provider->getAccessToken( 'refresh_token', [
				'refresh_token' => $current_token->getRefreshToken(),
			] );

			$this->token_manager->from_response( $new_tokens );
		}
	}
}
