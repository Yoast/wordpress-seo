<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Enhancement\Enhancement_Config_Interface;

/**
 * The Person config.
 */
class Person_Config implements Enhancement_Config_Interface {

	/**
	 * Get configuration value
	 *
	 * @param string          $key         Configuration key.
	 * @param string|int|bool $the_default Default value.
	 *
	 * @return string|int|bool Configuration value.
	 */
	public function get_config_value( string $key, $the_default ) {
		return \apply_filters( "wpseo_person_enhance_config_{$key}", $the_default );
	}

	/**
	 * Check if enhancement is enabled
	 *
	 * @param string $enhancement Enhancement name (e.g., 'article_body', 'keywords').
	 *
	 * @return bool True if enabled.
	 */
	public function is_enhancement_enabled( string $enhancement ): bool {
		$defaults = [
			'person_job_title'   => true,
		];

		$default = ( $defaults[ $enhancement ] ?? false );

		return (bool) \apply_filters( "wpseo_person_enhance_{$enhancement}", $default );
	}
}
