<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Cache;

use Exception;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;

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
	private const CACHE_PREFIX = 'yoast_schema_aggregator';

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
	 * @param string $post_type The post type that the cache is for.
	 * @param int    $page      Page number.
	 * @param int    $per_page  Items per page.
	 *
	 * @return array<string>|null Cached data or null.
	 */
	public function get( string $post_type, int $page, int $per_page ): ?array {
		try {
			if ( ! $this->config->cache_enabled() ) {
				return null;
			}
			if ( $page < 1 || $per_page < 1 ) {
				return null;
			}

			$key = $this->get_cache_key( $post_type, $page, $per_page );

			$data = \get_transient( $key );

			if ( $data === false ) {
				return null;
			}
			if ( ! \is_array( $data ) ) {
				\delete_transient( $key );

				return null;
			}

			return $data;

		} catch ( Exception $e ) {
			return null;
		}
	}

	/**
	 * Set cache data for a page
	 *
	 * @param string        $post_type The post type that the cache is for.
	 * @param int           $page      Page number.
	 * @param int           $per_page  Items per page.
	 * @param array<string> $data      Data to cache.
	 *
	 * @return bool Success.
	 */
	public function set( string $post_type, int $page, int $per_page, array $data ): bool {
		try {
			if ( $page < 1 || $per_page < 1 || empty( $data ) ) {
				return false;
			}

			$key        = $this->get_cache_key( $post_type, $page, $per_page );
			$expiration = $this->config->get_expiration( $data );

			return \set_transient( $key, $data, $expiration );

		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Invalidate cache for specific page/per_page combination or all pages
	 *
	 * Note: When invalidating a specific page without per_page, this clears
	 * ALL per_page variations for that page using a wildcard pattern.
	 *
	 * @param string   $post_type The post type that the cache is for.
	 * @param int|null $page      Page number or null for all.
	 * @param int|null $per_page  Items per page or null to clear all per_page variations.
	 *
	 * @return bool Success.
	 */
	public function invalidate( string $post_type, ?int $page = null, ?int $per_page = null ): bool {
		if ( $page !== null && $per_page !== null ) {
			// Clear specific page/per_page combination.
			return \delete_transient( $this->get_cache_key( $post_type, $page, $per_page ) );
		}

		if ( $page !== null && $per_page === null ) {
			// Clear all per_page variations for this page.
			global $wpdb;

			if ( ! isset( $wpdb ) || ! \is_object( $wpdb ) ) {
				return false;
			}

			$pattern         = '_transient_' . self::CACHE_PREFIX . '_page_' . $page . '_per_%';
			$timeout_pattern = '_transient_timeout_' . self::CACHE_PREFIX . '_page_' . $page . '_per_%';
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
			$deleted = $wpdb->query(
				$wpdb->prepare(
					"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
					$pattern,
					$timeout_pattern
				)
			);

			return $deleted !== false;
		}
		return $this->invalidate_all();
	}

	/**
	 * Invalidate all cache pages
	 *
	 * @return bool Success.
	 */
	public function invalidate_all(): bool {
		try {
			global $wpdb;

			if ( ! isset( $wpdb ) || ! \is_object( $wpdb ) ) {
				return false;
			}

			// Pattern matches: yoast_schema__aggregator_page_{n}_per_{m}_v{version}.
			$pattern         = '_transient_' . self::CACHE_PREFIX . '_page_%';
			$timeout_pattern = '_transient_timeout_' . self::CACHE_PREFIX . '_page_%';
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
			$deleted = $wpdb->query(
				$wpdb->prepare(
					"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
					$pattern,
					$timeout_pattern
				)
			);

			if ( $deleted === false ) {
				return false;
			}

			return true;

		} catch ( Exception $e ) {

			return false;
		}
	}

	/**
	 * Generate cache key for page.
	 *
	 * @param string $post_type The post type that the cache is for.
	 * @param int    $page      Page number.
	 * @param int    $per_page  Items per page.
	 *
	 * @return string Cache key.
	 */
	private function get_cache_key( string $post_type, int $page, int $per_page ): string {
		return \sprintf(
			'%s_page_%d_per_%d_type_%s_v%d',
			self::CACHE_PREFIX,
			$page,
			$per_page,
			$post_type,
			self::CACHE_VERSION
		);
	}
}
