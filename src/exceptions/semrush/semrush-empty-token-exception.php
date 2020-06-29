<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\WP\SEO\Exceptions\SEMrush
 */

namespace Yoast\WP\SEO\Exceptions\SEMrush;

/**
 * Class SEMrush_Empty_Token_Exception
 */
class SEMrush_Empty_Token_Exception extends \Exception {

	/**
	 * SEMrush_Empty_Token_Exception constructor.
	 */
	public function __construct() {
		parent::__construct( 'Token usage failed. Token is empty.', 400 );
	}
}
