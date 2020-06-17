<?php namespace Yoast\WP\SEO\Values\SEMrush;

use League\OAuth2\Client\Token\AccessTokenInterface;
use Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Empty_Token_Property_Exception;

/**
 * Class SEMrush_Token
 * @package Yoast\WP\SEO\Values\SEMrush
 */
class SEMrush_Token {

	/**
	 * @var string
	 */
	private $access_token;

	/**
	 * @var string
	 */
	private $refresh_token;

	/**
	 * @var int
	 */
	private $expires;

	/**
	 * @var bool
	 */
	private $has_expired;

	/**
	 * @var int
	 */
	private $created_at;

	/**
	 * SEMrush_Token constructor.
	 *
	 * @param string $access_token  The access token.
	 * @param string $refresh_token The refresh token.
	 * @param int    $expires       The date and time at which the token will expire.
	 * @param bool   $has_expired   Whether or not the token has expired.
	 * @param int    $created_at    The timestamp of when the token was created.
	 *
	 * @throws SEMrush_Empty_Token_Property_Exception
	 */
	public function __construct( $access_token, $refresh_token, $expires, $has_expired, $created_at ) {

		if ( empty( $access_token ) ) {
			throw new SEMrush_Empty_Token_Property_Exception( 'access_token' );
		}

		$this->access_token = $access_token;

		if ( empty( $access_token ) ) {
			throw new SEMrush_Empty_Token_Property_Exception( 'refresh_token' );
		}

		$this->refresh_token = $refresh_token;

		if ( empty( $expires ) ) {
			throw new SEMrush_Empty_Token_Property_Exception( 'expires' );
		}

		$this->expires = $expires;

		if ( is_null( $has_expired ) ) {
			throw new SEMrush_Empty_Token_Property_Exception( 'has_expired' );
		}

		$this->has_expired = $has_expired;
		$this->created_at  = $created_at;
	}

	/**
	 * Creates a new instance based on the passed response.
	 *
	 * @param AccessTokenInterface $response The response object to create a new instance from.
	 *
	 * @return SEMrush_Token The token object.
	 * @throws SEMrush_Empty_Token_Property_Exception
	 */
	public static function from_response( AccessTokenInterface $response ) {
		return new self(
			$response->getToken(),
			$response->getRefreshToken(),
			$response->getExpires(),
			$response->hasExpired(),
			time()
		);
	}

	/**
	 * Gets the access token.
	 *
	 * @return string The access token.
	 */
	public function get_access_token() {
		return $this->access_token;
	}

	/**
	 * Gets the refresh token.
	 *
	 * @return string The refresh token.
	 */
	public function get_refresh_token() {
		return $this->refresh_token;
	}

	/**
	 * Gets the expires.
	 *
	 * @return int The expiraton in seconds.
	 */
	public function get_expires() {
		return $this->expires;
	}

	/**
	 * Gets the created at timestamp.
	 *
	 * @return int The created at timestamp.
	 */
	public function get_created_at() {
		return $this->created_at;
	}

	/**
	 * Determines whether or not the token has expired.
	 *
	 * @return bool Whether or not the token has expired.
	 */
	public function has_expired() {
		return ( time() >= $this->expires ) || $this->has_expired === true;
	}

	/**
	 * Converts the object to an array.
	 *
	 * @return array The converted object.
	 */
	public function to_array() {
		return [
			'access_token'  => $this->get_access_token(),
			'refresh_token' => $this->get_refresh_token(),
			'expires'       => $this->get_expires(),
			'has_expired'   => $this->has_expired(),
			'created_at'    => $this->get_created_at(),
		];
	}
}
