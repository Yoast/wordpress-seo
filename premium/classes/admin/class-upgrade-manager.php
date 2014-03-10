<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class WPSEO_Upgrade_Manager {

	/**
	 * Check if there's a plugin update
	 */
	public function check_update() {

		// Get current version
		$current_version = get_site_option( WPSEO_Premium::OPTION_CURRENT_VERSION, 1 );

		// Check if update is required
		if( WPSEO_Premium::PLUGIN_VERSION_CODE > $current_version ) {

			// Do update
			$this->do_update( $current_version );

			// Update version code
			$this->update_current_version_code();

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
			$license_manager = new Yoast_Plugin_License_Manager( new Yoast_WPSEO_Premium() );
			$license_manager->set_license_key( trim( get_option( 'wpseo_license_key', '' ) ) );
			$license_manager->set_license_status( trim( get_option( 'wpseo_license_status', '' ) ) );

			// Remove old license options
			delete_option( 'wpseo_license_key' );
			delete_option( 'wpseo_license_status' );

		}

	}

	/**
	 * Update the current version code
	 */
	private function update_current_version_code() {
		update_site_option( WPSEO_Premium::OPTION_CURRENT_VERSION, WPSEO_Premium::PLUGIN_VERSION_CODE );
	}

}