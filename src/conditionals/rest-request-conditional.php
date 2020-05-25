<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when in a REST request.
 */
class REST_Request_Conditional implements Conditional {

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		return ( defined( 'REST_REQUEST' ) && REST_REQUEST );
	}
}
