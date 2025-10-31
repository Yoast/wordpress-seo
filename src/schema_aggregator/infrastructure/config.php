<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

/**
 * Configuration for the Schema Aggregator.
 */
class Config {

	/**
	 * Default items per page
	 *
	 * @var int
	 */
	private const DEFAULT_PER_PAGE = 100;

	/**
	 * Maximum items per page
	 *
	 * @var int
	 */
	private const MAX_PER_PAGE = 100;

	/**
	 * Get default items per page
	 *
	 * @return int
	 */
	public function get_per_page(): int {
		return (int) \apply_filters( 'wpseo_schema_aggregator_aggregator_per_page', self::DEFAULT_PER_PAGE );
	}

	/**
	 * Get maximum items per page
	 *
	 * @return int
	 */
	public function get_max_per_page(): int {
		return self::MAX_PER_PAGE;
	}
}
