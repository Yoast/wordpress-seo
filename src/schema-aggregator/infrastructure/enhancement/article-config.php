<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Enhancement\Enhancement_Config_Interface;

/**
 * The article config.
 */
class Article_Config implements Enhancement_Config_Interface {

	public const DEFAULT_MAX_ARTICLE_BODY_LENGTH = 500;

	/**
	 * Get configuration value
	 *
	 * @param string          $key         Configuration key.
	 * @param string|int|bool $the_default Default value.
	 *
	 * @return string|int|bool Configuration value.
	 */
	public function get_config_value( string $key, $the_default ) {
		return \apply_filters( "wpseo_article_enhance_config_{$key}", $the_default );
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
			'article_body' => true,
			'use_excerpt'  => true,
			'keywords'     => true,
		];

		$default = ( $defaults[ $enhancement ] ?? false );

		return (bool) \apply_filters( "wpseo_article_enhance_{$enhancement}", $default );
	}

	/**
	 * Determine if articleBody should be included
	 *
	 * Decision logic:
	 * - If has excerpt AND article_body_when_excerpt_exists: include
	 * - If no excerpt AND article_body_fallback: include
	 * - Otherwise: skip
	 *
	 * @param bool $has_excerpt Whether post has valid excerpt.
	 *
	 * @return bool True if articleBody should be included.
	 */
	public function should_include_article_body( bool $has_excerpt ): bool {
		if ( $has_excerpt ) {
			return (bool) \apply_filters( 'wpseo_article_enhance_body_when_excerpt_exists', false );
		}

		return (bool) \apply_filters( 'wpseo_article_enhance_article_body_fallback', true );
	}
}
