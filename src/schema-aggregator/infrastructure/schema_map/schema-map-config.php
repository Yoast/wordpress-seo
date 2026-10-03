<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map;

/**
 * Configuration for the Schema Map.
 */
class Schema_Map_Config {

	private const ALLOWED_FREQUENCIES = [
		'always',
		'hourly',
		'daily',
		'weekly',
		'monthly',
		'yearly',
		'never',
	];

	/**
	 * Get changefreq value from configuration
	 *
	 * @return string Valid changefreq value (always|hourly|daily|weekly|monthly|yearly|never).
	 */
	public function get_changefreq(): string {
		$changefreq = \apply_filters( 'wpseo_schema_aggregator_schemamap_changefreq', 'daily' );

		if ( ! \in_array( $changefreq, self::ALLOWED_FREQUENCIES, true ) ) {
			return 'daily';
		}

		return $changefreq;
	}

	/**
	 * Get priority value from configuration
	 *
	 * @return string Priority value as string (float between 0.0 and 1.0).
	 */
	public function get_priority(): string {
		$priority = \apply_filters( 'wpseo_schema_aggregator_schemamap_priority', '0.8' );

		$priority_float = \is_numeric( $priority ) ? (float) $priority : 0.8;

		if ( $priority_float < 0.0 || $priority_float > 1.0 ) {
			return '0.8';
		}

		return \number_format( $priority_float, 1, '.', '' );
	}
}
