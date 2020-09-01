<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when WPML is active.
 */
class WPML_Conditional implements Conditional {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		return \defined( 'WPML_PLUGIN_FILE' );
	}
}
