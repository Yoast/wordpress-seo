<?php namespace Yoast\WP\SEO\Config;

use League\OAuth2\Client\Token\AccessTokenInterface;
use Yoast\WP\SEO\Exceptions\OAuth\OAuth_Expired_Token_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\OAuth_Failed_Token_Storage_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class SEMrush_Token_Manager
 * @package Yoast\WP\SEO\Config
 */
class SEMrush_Token_Manager {

	/**
	 * @var AccessTokenInterface
	 */
	private $response;

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * SEMrush_Token_Manager constructor.
	 *
	 * @param AccessTokenInterface $response
	 * @param Options_Helper       $options_helper
	 *
	 * @throws OAuth_Expired_Token_Exception
	 */
	public function __construct( AccessTokenInterface $response, Options_Helper $options_helper ) {
		// If, for some reason, the token is already considered expired, throw an exception.
		if ( $response->hasExpired() === true ) {
			throw new OAuth_Expired_Token_Exception();
		}

		$this->response       = $response;
		$this->options_helper = $options_helper;
	}

	/**
	 * Gets the access token.
	 *
	 * @return string The access token.
	 */
	public function get_access_token() {
		return $this->response->getToken();
	}

	/**
	 * Gets the refresh token.
	 *
	 * @return string The refresh token.
	 */
	public function get_refresh_token() {
		return $this->response->getRefreshToken();
	}

	/**
	 * Gets the amount of time in which the token will expire.
	 *
	 * @return int The expiration time.
	 */
	public function get_expires() {
		return $this->response->getExpires();
	}

	/**
	 * Determines whether or not the access token has expired.
	 *
	 * @return bool Whether or not the token has expired.
	 */
	public function has_expired() {
		return $this->response->hasExpired();
	}

	/**
	 * Gets the original response.
	 *
	 * @return AccessTokenInterface The original response.
	 */
	public function get_original_response() {
		return $this->response;
	}

	/**
	 * Saves the tokens to storage.
	 *
	 * @return bool Whether or not the tokens were successfully saved.
	 * @throws OAuth_Failed_Token_Storage_Exception
	 */
	public function store() {
		$saved = $this->options_helper->set( 'yst_semrush_tokens', [
			'access_token'  => $this->get_access_token(),
			'refresh_token' => $this->get_refresh_token(),
			'expires'       => $this->get_expires(),
			'has_expired'   => $this->has_expired(),
		] );

		// Something went wrong in the saving process.
		if ( $saved === null || $saved === false ) {
			throw new OAuth_Failed_Token_Storage_Exception();
		}

		return $saved;
	}

	/**
	 * Retrieves the tokens from storage.
	 *
	 * @return array The tokens array. Returns an empty array if none exist.
	 */
	public function get_from_storage() {
		$tokens = $this->options_helper->get( 'yst_semrush_tokens' );

		if ( $tokens === null ) {
			return [];
		}

		return $tokens;
	}
}
