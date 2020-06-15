<?php namespace Yoast\WP\SEO\Exceptions\OAuth;

/**
 * Class OAuth_Expired_Token_Exception
 * @package Yoast\WP\SEO\Exceptions\OAuth
 */
class OAuth_Expired_Token_Exception extends \Exception {

	/**
	 * OAuth_Expired_Token_Exception constructor.
	 */
	public function __construct() {
		parent::__construct( 'Invalid token: Token expired', 403 );
	}
}
