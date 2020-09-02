<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Exceptions\OAuth
 */

namespace Yoast\WP\SEO\Exceptions\OAuth;

/**
 * Class Failed_Token_Storage_Exception
 *
 * @package Yoast\WP\SEO\Exceptions\OAuth
 */
class Failed_Token_Storage_Exception extends \Exception {

	/**
	 * Failed_Token_Storage_Exception constructor.
	 */
	public function __construct() {
		parent::__construct( 'Token storing failed. Please try again.', 500 );
	}
}
