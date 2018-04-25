<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\CLI
 */
final class WPSEO_CLI_Premium_Requirement {

	/**
	 * Enforce license requirements for commands representing premium
	 * functionality.
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
