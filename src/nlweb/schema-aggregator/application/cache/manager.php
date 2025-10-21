<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Nlweb\Schema_Aggregator\Application\Cache;

use Yoast\NLWeb\SchemaAggregator\Config\Provider;
use Yoast\WP\SEO\Nlweb\Schema_Aggregator\Infrastructure\Config;

/**
 * Cache manager
 *
 * Manages cache storage/retrieval/invalidation using WordPress Transients API.
 */
class Manager {
	/**
	 * Cache key prefix
	 *
	 * @var string
	 */
	private const CACHE_PREFIX = 'yoast_nlweb_schema';

	/**
	 * Cache version for invalidation
	 *
	 * @var int
	 */
	private const CACHE_VERSION = 1;

	/**
	 * Configuration provider
	 *
	 * @var Config
	 */
	private $config;

	/**
	 * Constructor
	 *
	 * @param Config $config Configuration provider.
	 */
	public function __construct( Config $config ) {
		$this->config = $config;
	}

	/**
	 * Get cached data for a page
	 *
	 * @param int $page     Page number.
	 * @param int $per_page Items per page.
	 *
	 * @return array|null Cached data or null.
	 */
	public function get( int $page, int $per_page ): ?array {
		try {
			// Validate input
			if ( $page < 1 ) {
				error_log( "Yoast NLWeb Cache: Invalid page number: {$page}" );

				return null;
			}

			if ( $per_page < 1 ) {
				error_log( "Yoast NLWeb Cache: Invalid per_page number: {$per_page}" );

				return null;
			}

			$key = $this->get_cache_key( $page, $per_page );

			// get_transient can fail in various ways
			$data = get_transient( $key );

			if ( $data === false ) {
				return null;
			}

			// Validate cached data structure
			if ( ! is_array( $data ) ) {
				error_log( "Yoast NLWeb Cache: Cached data for page {$page} is not an array, invalidating" );
				delete_transient( $key );

				return null;
			}

			return $data;

		} catch ( \Exception $e ) {
			error_log( "Yoast NLWeb Cache: Error getting cache for page {$page}: " . $e->getMessage() );

			return null;
		}
	}

	/**
	 * Set cache data for a page
	 *
	 * @param int   $page     Page number.
	 * @param int   $per_page Items per page.
	 * @param array $data     Data to cache.
	 *
	 * @return bool Success.
	 */
	public function set( int $page, int $per_page, array $data ): bool {
		try {
			// Validate inputs
			if ( $page < 1 || $per_page < 1 || ! is_array( $data )  ) {
				return false;
			}

			$key        = $this->get_cache_key( $page, $per_page );
			$expiration = $this->get_expiration( $data );

			$result = set_transient( $key, $data, $expiration );

			if ( ! $result ) {
				error_log( "Yoast NLWeb Cache: Failed to set transient for page {$page}" );
			}

			return $result;

		} catch ( \Exception $e ) {
			error_log( "Yoast NLWeb Cache: Error setting cache for page {$page}: " . $e->getMessage() );

			return false;
		}
	}

	/**
	 * Invalidate cache for specific page/per_page combination or all pages
	 *
	 * Note: When invalidating a specific page without per_page, this clears
	 * ALL per_page variations for that page using a wildcard pattern.
	 *
	 * @param int|null $page     Page number or null for all.
	 * @param int|null $per_page Items per page or null to clear all per_page variations.
	 *
	 * @return bool Success.
	 */
	public function invalidate( ?int $page = null, ?int $per_page = null ): bool {
		if ( $page !== null && $per_page !== null ) {
			// Clear specific page/per_page combination
			return delete_transient( $this->get_cache_key( $page, $per_page ) );
		}

		if ( $page !== null && $per_page === null ) {
			// Clear all per_page variations for this page
			global $wpdb;

			if ( ! isset( $wpdb ) || ! is_object( $wpdb ) ) {
				error_log( 'Yoast NLWeb Cache: $wpdb is not available for invalidate' );

				return false;
			}

			$pattern         = '_transient_' . self::CACHE_PREFIX . '_page_' . $page . '_per_%';
			$timeout_pattern = '_transient_timeout_' . self::CACHE_PREFIX . '_page_' . $page . '_per_%';

			$deleted = $wpdb->query(
				$wpdb->prepare(
					"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
					$pattern,
					$timeout_pattern
				)
			);

			return $deleted !== false;
		}

		// Clear everything
		return $this->invalidate_all();
	}

	/**
	 * Invalidate all cache pages
	 *
	 * TODO: Implement incremental cache updates (v2 feature) instead of full regeneration
	 *
	 * @return bool Success.
	 */
	public function invalidate_all(): bool {
		try {
			global $wpdb;

			// Validate wpdb is available
			if ( ! isset( $wpdb ) || ! is_object( $wpdb ) ) {
				error_log( 'Yoast NLWeb Cache: $wpdb is not available for invalidate_all' );

				return false;
			}

			// Delete all transients matching our pattern
			// Pattern matches: yoast_nlweb_schema_page_{n}_per_{m}_v{version}
			$pattern         = '_transient_' . self::CACHE_PREFIX . '_page_%';
			$timeout_pattern = '_transient_timeout_' . self::CACHE_PREFIX . '_page_%';

			$deleted = $wpdb->query(
				$wpdb->prepare(
					"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
					$pattern,
					$timeout_pattern
				)
			);

			if ( $deleted === false ) {
				error_log( 'Yoast NLWeb Cache: Database query failed in invalidate_all' );
				if ( ! empty( $wpdb->last_error ) ) {
					error_log( 'Yoast NLWeb Cache: Database error: ' . $wpdb->last_error );
				}

				return false;
			}

			return true;

		} catch ( \Exception $e ) {
			error_log( 'Yoast NLWeb Cache: Error in invalidate_all: ' . $e->getMessage() );

			return false;
		}
	}

	/**
	 * Generate cache key for page
	 *
	 * @param int $page     Page number.
	 * @param int $per_page Items per page.
	 *
	 * @return string Cache key.
	 */
	private function get_cache_key( int $page, int $per_page ): string {
		return sprintf(
			'%s_page_%d_per_%d_v%d',
			self::CACHE_PREFIX,
			$page,
			$per_page,
			self::CACHE_VERSION
		);
	}

	/**
	 * Get expiration time based on data size
	 *
	 * @param array $data Data to cache.
	 *
	 * @return int Expiration in seconds.
	 */
	private function get_expiration( array $data ): int {
		try {
			// Attempt to serialize to calculate size
			// This can fail with circular references or exceed memory
			$serialized = serialize( $data );

			if ( $serialized === false ) {
				error_log( 'Yoast NLWeb Cache: Failed to serialize data for expiration calculation' );

				return HOUR_IN_SECONDS; // Default
			}

			$size = strlen( $serialized );

			// Large payloads: cache longer
			if ( $size > 1048576 ) { // > 1MB
				return 6 * HOUR_IN_SECONDS;
			}

			// Small payloads: cache shorter
			if ( $size < 102400 ) { // < 100KB
				return 30 * MINUTE_IN_SECONDS;
			}

			// Default: 1 hour
			return HOUR_IN_SECONDS;

		} catch ( \Exception $e ) {
			error_log( 'Yoast NLWeb Cache: Error calculating expiration: ' . $e->getMessage() );

			return HOUR_IN_SECONDS; // Safe default
		}
	}
}
