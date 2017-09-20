<?php
/**
 * @package WPSEO\Admin\Statistics
 */

/**
 * Class WPSEO_Statistic_Integration
 */
class WPSEO_Statistic_Integration implements WPSEO_WordPress_Integration {
	/**
	 * Adds hooks to clear the cache.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wp_insert_post', array( $this, 'clear_cache' ) );
		add_action( 'delete_post', array( $this, 'clear_cache' ) );
	}

	/**
	 * Clears the dashboard widget items cache.
	 *
	 * @return void
	 */
	public function clear_cache() {
		delete_transient( WPSEO_Statistics_Service::CACHE_TRANSIENT_KEY );
	}
}
