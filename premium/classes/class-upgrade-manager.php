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
	 * @param string $version_number The version number that will be compared.
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

		if ( version_compare( $version_number, '3.1', '<' ) ) {
			add_action( 'wp', array( 'WPSEO_Redirect_Upgrade', 'upgrade_3_1' ), 12 );
			add_action( 'admin_head', array( 'WPSEO_Redirect_Upgrade', 'upgrade_3_1' ), 12 );
		}
	}

	/**
	 * An update is required, do it
	 *
	 * @param string $current_version The current version number of the installation.
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
}
