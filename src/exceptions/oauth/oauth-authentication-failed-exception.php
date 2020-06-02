<?php namespace Yoast\WP\SEO\Exceptions\OAuth;

use League\OAuth2\Client\Provider\Exception\IdentityProviderException;

/**
 * Class SEMrush_Authentication_Failed_Exception
 * @package Yoast\WP\SEO\Exceptions\OAuth
 */
class OAuth_Authentication_Failed_Exception extends \Exception {

	/**
	 * OAuth_Authentication_Failed_Exception constructor.
	 *
	 * @param                           $code
	 * @param IdentityProviderException $original_exception The original exception.
	 */
	public function __construct( $code, IdentityProviderException $original_exception ) {
		parent::__construct( sprintf( 'Authentication failed with code %s', $code ), 500, $original_exception );
	}

	/**
	 * Returns a formatted response object.
	 *
	 * @return object The response object.
	 */
	public function get_response() {
		return (object) [
			'tokens' => [],
			'error'  => $this->getMessage(),
			'code'   => $this->getCode(),
		];
	}
}
