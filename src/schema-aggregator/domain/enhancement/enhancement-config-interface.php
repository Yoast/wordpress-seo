<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain\Enhancement;

interface Enhancement_Config_Interface {

	/**
	 * Get configuration value
	 *
	 * @param string          $key         Configuration key.
	 * @param string|int|bool $the_default Default value.
	 *
	 * @return string|int|bool Configuration value.
	 */
	public function get_config_value( string $key, $the_default );

	/**
	 * Check if enhancement is enabled
	 *
	 * @param string $enhancement Enhancement name (e.g., 'article_body', 'keywords').
	 *
	 * @return bool True if enabled.
	 */
	public function is_enhancement_enabled( string $enhancement ): bool;
}
