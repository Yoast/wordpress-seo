<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Exception;

/**
 * Configuration for the Schema Aggregator.
 */
class Config {

	/**
	 * Default items per page
	 *
	 * @var int
	 */
	private const DEFAULT_PER_PAGE = 1000;
	/**
	 * Default items per page for post types that come with lots of schema pieces.
	 *
	 * @var int
	 */
	private const DEFAULT_PER_PAGE_BIG_SCHEMA = 100;

	private const BIG_SCHEMA_POST_TYPES = [
		'product',
	];

	/**
	 * Maximum items per page
	 *
	 * @var int
	 */
	private const MAX_PER_PAGE = 1000;
	/**
	 * Default cache TTL in seconds
	 *
	 * @var int
	 */
	private const DEFAULT_CACHE_TTL = ( 60 * 60 );

	/**
	 * Get default items per page
	 *
	 * @param string $post_type The post type to determine the max page size for.
	 *
	 * @return int
	 */
	public function get_per_page( string $post_type ): int {
		/**
		 * Filter: 'wpseo_schema_aggregator_big_schema_post_types' Determines the list of post types we want to have a smaller per page count.
		 *
		 * @param bool $default_schema_post_types Determines the default list of big schema post types.
		 */
		$big_schema_post_types = \apply_filters( 'wpseo_schema_aggregator_big_schema_post_types', self::BIG_SCHEMA_POST_TYPES );
		if ( ! \is_array( $big_schema_post_types ) ) {
			$big_schema_post_types = self::BIG_SCHEMA_POST_TYPES;
		}

		$per_page = \in_array( $post_type, $big_schema_post_types, true ) ? $this->get_big_per_post_type() : $this->get_default_per_post_type();

		if ( $per_page > self::MAX_PER_PAGE ) {
			$per_page = self::MAX_PER_PAGE;
		}

		return $per_page;
	}

	/**
	 * Get maximum items per page
	 *
	 * @return int
	 */
	public function get_max_per_page(): int {
		return self::MAX_PER_PAGE;
	}

	/**
	 * Get expiration time based on data size.
	 *
	 * @param array<string> $data Data to cache.
	 *
	 * @return int Expiration in seconds.
	 */
	public function get_expiration( array $data ): int {
		$cache_ttl = self::DEFAULT_CACHE_TTL;
		try {
			$serialized = \serialize( $data ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize -- Needed for size calculation.

			if ( $serialized === false ) {
				return self::DEFAULT_CACHE_TTL;
			}

			$size = \strlen( $serialized );

			// Large payloads: cache longer.
			if ( $size > 1048576 ) {
				$cache_ttl = ( 6 * \HOUR_IN_SECONDS );
			}

			// Small payloads: cache shorter.
			if ( $size < 102400 ) {
				$cache_ttl = ( 30 * \MINUTE_IN_SECONDS );
			}

			$cache_ttl = \apply_filters( 'wpseo_schema_aggregator_cache_ttl', $cache_ttl );

			if ( ! \is_int( $cache_ttl ) || $cache_ttl <= 0 ) {
				return self::DEFAULT_CACHE_TTL;
			}

			return $cache_ttl;

		} catch ( Exception $e ) {
			return self::DEFAULT_CACHE_TTL;
		}
	}

	/**
	 * Check if caching is enabled.
	 *
	 * @return bool True if caching is enabled, false otherwise.
	 */
	public function cache_enabled(): bool {
		$enabled = \apply_filters( 'wpseo_schema_aggregator_cache_enabled', true );

		if ( \is_bool( $enabled ) ) {
			return $enabled;
		}
		else {
			return true;
		}
	}

	/**
	 * Gets the per post type for post types with lots of schema nodes.
	 *
	 * @return int
	 */
	public function get_big_per_post_type(): int {
		/**
		 * Filter: 'wpseo_schema_aggregator_per_page_big' Determines the page count for post types with lots of schema nodes.
		 *
		 * @param bool $default_count The default amount of posts per page.
		 */
		$per_page = (int) \apply_filters( 'wpseo_schema_aggregator_per_page_big', self::DEFAULT_PER_PAGE_BIG_SCHEMA );

		if ( $per_page > 0 ) {
			return $per_page;
		}

		return self::DEFAULT_PER_PAGE_BIG_SCHEMA;
	}

	/**
	 * Gets the per page for smaller post types.
	 *
	 * @return int
	 */
	public function get_default_per_post_type(): int {
		/**
		 * Filter: 'wpseo_schema_aggregator_per_page' Determines the page count for post types.
		 *
		 * @param bool $default_count The default amount of posts per page.
		 */
		$per_page = (int) \apply_filters( 'wpseo_schema_aggregator_per_page', self::DEFAULT_PER_PAGE );

		if ( $per_page > 0 ) {
			return $per_page;
		}

		return self::DEFAULT_PER_PAGE;
	}
}
