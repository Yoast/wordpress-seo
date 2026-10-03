<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when the WordPress Abilities API is available (WordPress 6.9+).
 */
class Abilities_API_Conditional implements Conditional {

	/**
	 * The minimum WordPress version that includes the Abilities API.
	 */
	private const REQUIRED_VERSION = '6.9';

	/**
	 * Returns `true` when WordPress meets the minimum version requirement for the Abilities API.
	 *
	 * @return bool `true` when the Abilities API is available.
	 */
	public function is_met() {
		return \version_compare( \wp_get_wp_version(), self::REQUIRED_VERSION, '>=' );
	}
}
