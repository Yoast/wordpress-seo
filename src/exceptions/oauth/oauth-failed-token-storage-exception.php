<?php namespace Yoast\WP\SEO\Exceptions\OAuth;

/**
 * Class OAuth_Failed_Token_Storage_Exception
 * @package Yoast\WP\SEO\Exceptions\OAuth
 */
class OAuth_Failed_Token_Storage_Exception extends \Exception {

	/**
	 * OAuth_Failed_Token_Storage_Exception constructor.
	 */
	public function __construct() {
		parent::__construct( 'Token storing failed. Please try again.', 500 );
	}
}
