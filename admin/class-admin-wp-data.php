<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_WP_Data
 *
 * Integration class for the yoast wp-data javascript module.
 */
class WPSEO_WP_Data implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Enqueue required scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		global $pagenow;

		if ( $pagenow === 'post.php' || $pagenow === 'post-new.php' ) {
			$script_handle = WPSEO_Admin_Asset_Manager::PREFIX . 'wp-data';

			wp_enqueue_script( $script_handle );
			wp_localize_script( $script_handle, 'wpseoWpData', $this->get_localized_data() );
		}
	}

	/**
	 * Get localized data.
	 *
	 * @return array Data to localize.
	 */
	public function get_localized_data() {
		return array(
			'taxonomies' => null,
			'terms' => (object) array(),
		);
	}
}
