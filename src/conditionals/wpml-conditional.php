<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\Free\Conditionals;

/**
 * Class WPML_Conditional
 *
 * @package Yoast\WP\Free\Conditionals
 */
class WPML_Conditional implements Conditional {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		return defined( 'WPML_PLUGIN_FILE' );
	}
}
