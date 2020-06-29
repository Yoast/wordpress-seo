<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\WP\SEO\Values\SEMrush
 */

namespace Yoast\WP\SEO\Values\SEMrush;

use League\OAuth2\Client\Token\AccessTokenInterface;
use Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Empty_Token_Property_Exception;

/**
 * Class SEMrush_Token
 */
class SEMrush_Token {

	/**
	 * @var string
	 */
	public $access_token;

	/**
	 * @var string
	 */
	public $refresh_token;

	/**
	 * @var int
	 */
	public $expires;

	/**
	 * @var bool
	 */
	public $has_expired;

	/**
	 * @var int
	 */
	public $created_at;

	/**
	 * SEMrush_Token constructor.
	 *
	 * @param string $access_token  The access token.
	 * @param string $refresh_token The refresh token.
	 * @param int    $expires       The date and time at which the token will expire.
	 * @param bool   $has_expired   Whether or not the token has expired.
	 * @param int    $created_at    The timestamp of when the token was created.
	 *
	 * @throws SEMrush_Empty_Token_Property_Exception Exception thrown if a token property is empty.
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
	 *
	 * @throws SEMrush_Empty_Token_Property_Exception Exception thrown if a token property is empty.
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
			'access_token'  => $this->access_token,
			'refresh_token' => $this->refresh_token,
			'expires'       => $this->expires,
			'has_expired'   => $this->has_expired(),
			'created_at'    => $this->created_at,
		];
	}
}
