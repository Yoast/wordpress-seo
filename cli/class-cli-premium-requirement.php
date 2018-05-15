<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\CLI
 */

/**
 * Enforce premium version requirement on commands covering premium features.
 */
final class WPSEO_CLI_Premium_Requirement {

	/**
	 * Enforces license requirements for commands representing premium
	 * functionality.
	 *
	 * @return void
	 */
	public static function enforce() {
		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			return;
		}

		// No premium commands allowed.
		WP_CLI::error(
			'This command can only be run with an active Yoast SEO Premium license.'
		);
	}
}
