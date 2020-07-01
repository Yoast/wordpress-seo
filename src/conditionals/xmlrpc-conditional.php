<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

/**
 * Class XMLRPC_Conditional
 *
 * @package Yoast\WP\SEO\Conditionals
 */
class XMLRPC_Conditional implements Conditional {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		return ( \defined( 'XMLRPC_REQUEST' ) && XMLRPC_REQUEST );
	}
}

