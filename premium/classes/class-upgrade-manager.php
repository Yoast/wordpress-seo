<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Upgrade_Manager
 */
class WPSEO_Upgrade_Manager {

	/**
	 * Option key to save the version of Premium
	 */
	const VERSION_OPTION_KEY = 'wpseo_premium_version';

	/**
	 * Run the upgrade routine when it's necessary.
	 *
	 * @param string $current_version The current WPSEO version.
	 */
	public function run_upgrade( $current_version ) {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX === true ) {
			return;
		}

		$saved_version = get_option( self::VERSION_OPTION_KEY, '3.0.7' );

		if ( version_compare( $saved_version, $current_version, '<' ) ) {
			$this->check_update( $saved_version );

			update_option( self::VERSION_OPTION_KEY, $current_version );
		}
	}

	/**
	 * Run the specific updates when it is necessary.
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

		if ( version_compare( $version_number, '2.3', '<' ) ) {
			add_action( 'wp', array( 'WPSEO_Redirect_Upgrade', 'import_redirects_2_3' ), 11 );
			add_action( 'admin_head', array( 'WPSEO_Redirect_Upgrade', 'import_redirects_2_3' ), 11 );
		}

		if ( version_compare( $version_number, '3.1', '<' ) ) {
			add_action( 'wp', array( 'WPSEO_Redirect_Upgrade', 'upgrade_3_1' ), 12 );
			add_action( 'admin_head', array( 'WPSEO_Redirect_Upgrade', 'upgrade_3_1' ), 12 );
		}
	}

	/**
	 * Returns whether or not we should retry the 31 upgrade
	 *
	 * @return bool
	 */
	public function should_retry_upgrade_31() {
		$retry = false;

		$new_redirects = get_option( WPSEO_Redirect_Option::OPTION, null );
		if ( null === $new_redirects ) {
			$old_plain_redirects = get_option( WPSEO_Redirect_Option::OLD_OPTION_PLAIN, array() );
			$old_regex_redirects = get_option( WPSEO_Redirect_Option::OLD_OPTION_REGEX, array() );

			if ( ! empty( $old_plain_redirects ) || ! empty( $old_regex_redirects ) ) {
				$retry = true;
			}
		}

		return $retry;
	}

	/**
	 * Validates if the 31 upgrade routine has correctly run and if not retries to run it
	 *
	 * @param bool $immediately Whether to do the upgrade immediately when this function is called.
	 */
	public function retry_upgrade_31( $immediately = false ) {
		/*
		 * If we detect that the new redirect option doesn't exist but there are redirects in the old option we try the
		 * upgrade routine again. This brings the redirects back for people if the upgrade routine failed the first
		 * time.
		 */
		if ( $this->should_retry_upgrade_31() ) {
			if ( $immediately ) {
				WPSEO_Redirect_Upgrade::upgrade_3_1();
			}
			else {
				add_action( 'wp', array( 'WPSEO_Redirect_Upgrade', 'upgrade_3_1' ), 12 );
				add_action( 'admin_head', array( 'WPSEO_Redirect_Upgrade', 'upgrade_3_1' ), 12 );
			}
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
			$license_manager = WPSEO_Premium::get_license_manager();
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
