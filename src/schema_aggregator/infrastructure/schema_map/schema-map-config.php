<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map;

class Schema_Map_Config {

	/**
	 * Get changefreq value from configuration
	 *
	 * @return string Valid changefreq value (always|hourly|daily|weekly|monthly|yearly|never).
	 */
	public function getChangefreq(): string {
		$changefreq = \apply_filters( 'yoast_nlweb_schemamap_changefreq', 'daily' );

		// Validate against allowed values
		$allowed = [ 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never' ];
		if ( ! \in_array( $changefreq, $allowed, true ) ) {
			\error_log( "Yoast NLWeb SitemapRenderer: Invalid changefreq '{$changefreq}', using default 'daily'" );
			return 'daily';
		}

		return $changefreq;
	}

	/**
	 * Get priority value from configuration
	 *
	 * @return string Priority value as string (float between 0.0 and 1.0).
	 */
	public function getPriority(): string {
		$priority = \apply_filters( 'yoast_nlweb_schemamap_priority', '0.8' );

		// Convert to float for validation
		$priority_float = \is_numeric( $priority ) ? (float) $priority : 0.8;

		// Validate range
		if ( $priority_float < 0.0 || $priority_float > 1.0 ) {
			\error_log( "Yoast NLWeb SitemapRenderer: Invalid priority '{$priority}', using default '0.8'" );
			return '0.8';
		}

		// Return as string with one decimal place
		return \number_format( $priority_float, 1, '.', '' );
	}
}
