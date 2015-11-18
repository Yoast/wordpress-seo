<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Upgrade_Manager
 */
class WPSEO_Upgrade_Manager {

	/**
	 * Check if there's a plugin update
	 *
	 * @param string $version_number The version number of Premium.
	 */
	public function check_update( $version_number ) {

		// Get current version.
		$current_version = get_site_option( WPSEO_Premium::OPTION_CURRENT_VERSION, 1 );

		// Check if update is required.
		if ( WPSEO_Premium::PLUGIN_VERSION_CODE > $current_version ) {

			// Do update.
			$this->do_update( $current_version );

			// Update version code.
			$this->update_current_version_code();

		}

		if ( version_compare( $version_number, '2.3', '<' ) ) {
			add_action( 'wp', array( $this, 'import_redirects_2_3' ), 11 );
			add_action( 'admin_head', array( $this, 'import_redirects_2_3' ), 11 );
		}

		if ( version_compare( $version_number, '3.1', '<' ) ) {
			add_action( 'wp', array( 'WPSEO_Redirect_Upgrade', 'upgrade_3_1' ), 12 );
			add_action( 'admin_head', array( 'WPSEO_Redirect_Upgrade', 'upgrade_3_1' ), 12 );
		}
	}

	/**
	 * An update is required, do it
	 *
	 * @param string $current_version The current version of Premium.
	 */
	private function do_update( $current_version ) {
		// < 1.0.4.
		if ( $current_version < 5 ) {

			/**
			 * Upgrade to version 1.0.4
			 *
			 * - Save the old license to the new license option
			 */

			// Save the old license to the new license option.
			$license_manager = new Yoast_Plugin_License_Manager( new WPSEO_Product_Premium() );
			$license_manager->set_license_key( trim( get_option( 'wpseo_license_key', '' ) ) );
			$license_manager->set_license_status( trim( get_option( 'wpseo_license_status', '' ) ) );

			// Remove old license options.
			delete_option( 'wpseo_license_key' );
			delete_option( 'wpseo_license_status' );

		}

		// Upgrade to version 1.2.0.
		if ( $current_version < 15 ) {
			/**
			 * Upgrade redirects
			 */
			add_action( 'wp', array( 'WPSEO_Redirect_Upgrade', 'upgrade_1_2_0' ), 10 );
			add_action( 'admin_head', array( 'WPSEO_Redirect_Upgrade', 'upgrade_1_2_0' ), 10 );
		}

	}

	/**
	 * Update the current version code
	 */
	private function update_current_version_code() {
		update_site_option( WPSEO_Premium::OPTION_CURRENT_VERSION, WPSEO_Premium::PLUGIN_VERSION_CODE );
	}

	/**
	 * Check if redirects should be imported from the free version
	 *
	 * @since 2.3
	 */
	public function import_redirects_2_3() {
		$wp_query  = new WP_Query( 'post_type=any&meta_key=_yoast_wpseo_redirect&order=ASC' );

		if ( ! empty( $wp_query->posts ) ) {
			$redirect_manager = new WPSEO_Redirect_Manager();

			foreach ( $wp_query->posts as $post ) {
				$old_url = '/' . $post->post_name . '/';
				$new_url = get_post_meta( $post->ID, '_yoast_wpseo_redirect', true );

				// Create redirect.
				$redirect_manager->create_redirect( new WPSEO_Redirect( $old_url, $new_url, 301, WPSEO_Redirect::FORMAT_PLAIN ) );

				// Remove post meta value.
				delete_post_meta( $post->ID, '_yoast_wpseo_redirect' );
			}
		}
	}
}
