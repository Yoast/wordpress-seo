<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Checks whether there is a cache for the frontend, if not, creates one.
 */
class WPSEO_Frontend_Cache {
	/**
	 * Contains the cache for the current page, if there is one.
	 *
	 * @var bool|string
	 */
	public $cache = false;

	/**
	 * The cache group we're saving things to.
	 *
	 * @var string
	 */
	private $cache_group = 'yoast-seo-frontend-cache';

	/**
	 * WPSEO_Frontend_Cache constructor.
	 */
	public function __construct() {
		add_action( 'wp_head', array( $this, 'init' ), '-10' );
	}

	/**
	 * Init caching.
	 *
	 * @return void
	 */
	public function init() {
		if ( ! defined( 'WP_CACHE' ) || ! ini_get( 'output_buffering' ) ) {
			WPSEO_Frontend::get_instance();
			return;
		}

		$this->cache = wp_cache_get( $this->get_cache_key(), $this->cache_group );
		if ( ! $this->cache ) {
			$this->build_cache();
			return;
		}
		add_action( 'wp_head', array( $this, 'output_cache' ), 1 );
	}

	/**
	 * Builds a cache for the current URL.
	 *
	 * @return void
	 */
	public function build_cache() {
		add_action( 'wpseo_head', array( $this, 'start_cache' ), - 9999 );
		add_action( 'wpseo_head', array( $this, 'save_cache' ), PHP_INT_MAX );

		// Make sure we load Yoast SEO.
		WPSEO_Frontend::get_instance();
	}

	/**
	 * Starts caching.
	 *
	 * @return void
	 */
	public function start_cache() {
		ob_start();
	}

	/**
	 * Saves the Yoast SEO output to the cache.
	 *
	 * @return void
	 */
	public function save_cache() {
		$output = ob_get_flush();
		wp_cache_set( $this->get_cache_key(), $output, $this->cache_group, DAY_IN_SECONDS );
	}

	/**
	 * Output our cached data.
	 *
	 * @return void
	 */
	public function output_cache() {
		echo $this->cache;
		echo "<!-- / Yoast SEO (cached). -->\n\n";
	}

	/**
	 * Gets a cache key for the current URL.
	 *
	 * @return string A cache key for the current URL.
	 */
	private function get_cache_key() {
		$current_url = ( isset( $_SERVER['HTTPS'] ) ? "https" : "http" ) . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
		return md5( $current_url );
	}
}
