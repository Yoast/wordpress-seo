<?php

namespace Yoast\WP\SEO\Conditionals;

use WPSEO_Ryte_Option;

/**
 * Conditional that is only met when Ryte is enabled.
 */
class Ryte_Conditional implements Conditional {

	/**
	 * The development conditional.
	 *
	 * @var Development_Conditional
	 */
	protected $development_conditional;

	/**
	 * Ryte_Conditional constructor.
	 *
	 * @param Development_Conditional $development_conditional The development conditional.
	 */
	public function __construct( Development_Conditional $development_conditional ) {
		$this->development_conditional = $development_conditional;
	}

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		if ( wp_get_environment_type() !== 'production' ) {
			return false;
		}

		$ryte_option = new WPSEO_Ryte_Option();
		if ( ! $ryte_option->is_enabled() ) {
			return false;
		}

		if ( \get_option( 'blog_public' ) === '0' ) {
			return false;
		}

		// Unmet for non-Yoast developers.
		return ! \wp_debug_mode() || $this->development_conditional->is_met();
	}
}
