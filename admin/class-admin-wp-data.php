<?php

class WPSEO_WP_Data implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	public function enqueue_scripts() {
		global $pagenow;

		if ( $pagenow === 'post.php' || $pagenow === 'post-new.php') {
			$script_handle = WPSEO_Admin_Asset_Manager::PREFIX . 'wp-data';

			wp_enqueue_script( $script_handle );
			wp_localize_script( $script_handle, 'wpseoWpData', $this->get_localized_data() );
		}
	}

	public function get_localized_data() {
		return array (
			'taxonomies' => array(),
			'terms' => (object) array(),
		);
	}
}
