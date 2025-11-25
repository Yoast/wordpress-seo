<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Cache;

use Exception;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;

/**
 * Cache manager for the XML sitemap.
 *
 * Manages cache storage/retrieval/invalidation using WordPress Transients API.
 */
class Xml_Manager {
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
	 * Get cached data for a page.
	 *
	 * @return string|null Cached data or null.
	 */
	public function get(): ?string {
		try {
			if ( ! $this->config->cache_enabled() ) {
				return null;
			}

			$key = $this->get_cache_key();

			$data = \get_transient( $key );

			if ( $data === false ) {
				return null;
			}
			if ( ! \is_string( $data ) ) {
				\delete_transient( $key );

				return null;
			}

			return $data;

		} catch ( Exception $e ) {
			return null;
		}
	}

	/**
	 * Set cache data for a page.
	 *
	 * @param string $data Data to cache.
	 *
	 * @return bool Success.
	 */
	public function set( string $data ): bool {
		try {
			$key        = $this->get_cache_key();
			$expiration = $this->config->get_expiration( [ $data ] );

			return \set_transient( $key, $data, $expiration );

		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Invalidate cache for the xml sitemap.
	 *
	 * @return bool Success.
	 */
	public function invalidate(): bool {
			return \delete_transient( $this->get_cache_key() );
	}

	/**
	 * Generate cache key for page.
	 *
	 * @return string Cache key.
	 */
	private function get_cache_key(): string {
		return \sprintf(
			'%s_xml_sitemap_v%d',
			self::CACHE_PREFIX,
			self::CACHE_VERSION
		);
	}
}
