<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when WooCommerce is active and version is 10.5 or higher.
 */
class WooCommerce_Version_Conditional implements Conditional {

	/**
	 * The minimum WooCommerce version required.
	 */
	private const REQUIRED_VERSION = '10.5';

	/**
	 * Returns `true` when WooCommerce is installed, activated, and meets the minimum version.
	 *
	 * @return bool `true` when WooCommerce meets the version requirement.
	 */
	public function is_met() {
		if ( ! \defined( 'WC_VERSION' ) ) {
			return false;
		}

		return \version_compare( \WC_VERSION, self::REQUIRED_VERSION, '>=' );
	}
}
