<?php

class WPSEO_Upgrade_Manager {

	/**
	 * Check if there's a plugin update
	 *
	 * @param string $version_number
	 */
	public function check_update( $version_number ) {

		// Get current version
		$current_version = get_site_option( WPSEO_Premium::OPTION_CURRENT_VERSION, 1 );

		// Check if update is required
		if ( WPSEO_Premium::PLUGIN_VERSION_CODE > $current_version ) {

			// Do update
			$this->do_update( $current_version );

			// Update version code
			$this->update_current_version_code();

		}

		if ( version_compare( $version_number, WPSEO_VERSION, '<' ) ) {
			add_action( 'admin_init', array( $this, 'import_redirects' ), 11 );
		}
	}

	/**
	 * An update is required, do it
	 *
	 * @param $current_version
	 */
	private function do_update( $current_version ) {

		// < 1.0.4
		if ( $current_version < 5 ) {

			/**
			 * Upgrade to version 1.0.4
			 *
			 * - Save the old license to the new license option
			 */

			// Save the old license to the new license option
			$license_manager = new Yoast_Plugin_License_Manager( new WPSEO_Product_Premium() );
			$license_manager->set_license_key( trim( get_option( 'wpseo_license_key', '' ) ) );
			$license_manager->set_license_status( trim( get_option( 'wpseo_license_status', '' ) ) );

			// Remove old license options
			delete_option( 'wpseo_license_key' );
			delete_option( 'wpseo_license_status' );

		}

		// Upgrade to version 1.2.0
		if ( $current_version < 15 ) {

			/**
			 * Upgrade redirects
			 */

			// URL Redirects
			$url_redirect_manager = new WPSEO_URL_Redirect_Manager();
			$url_redirects        = $url_redirect_manager->get_redirects();

			// Loop through the redirects
			foreach ( $url_redirects as $old_url => $redirect ) {
				// Check if the redirect is not an array yet
				if ( ! is_array( $redirect ) ) {
					$url_redirects[ $old_url ] = array( 'url' => $redirect, 'type' => '301' );
				}
			}

			// Save the URL redirects
			$url_redirect_manager->save_redirects( $url_redirects );

			// Regex Redirects
			$regex_redirect_manager = new WPSEO_REGEX_Redirect_Manager();
			$regex_redirects        = $regex_redirect_manager->get_redirects();

			// Loop through the redirects
			foreach ( $regex_redirects as $old_url => $redirect ) {
				// Check if the redirect is not an array yet
				if ( ! is_array( $redirect ) ) {
					$regex_redirects[ $old_url ] = array( 'url' => $redirect, 'type' => '301' );
				}
			}

			// Save the URL redirects
			$regex_redirect_manager->save_redirects( $regex_redirects );

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
	 */
	public function import_redirects() {
		$wp_query  = new WP_Query( "post_type=any&meta_key=_yoast_wpseo_redirect&order=ASC" );

		if ( ! empty( $wp_query->posts) ) {
			$redirect_manager = new WPSEO_URL_Redirect_Manager();

			foreach ( $wp_query->posts as $post ) {
				$old_url = '/' . $post->post_name . '/';
				$new_url = get_post_meta( $post->ID, '_yoast_wpseo_redirect', true );

				// Create redirect
				$redirect_manager->create_redirect( $old_url, $new_url, 301 );

				// Remove post meta value
				delete_post_meta( $post->ID, '_yoast_wpseo_redirect' );
			}
		}
	}

}
