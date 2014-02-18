<?php

class WPSEO_License_Manager {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->hooks();
	}

	/**
	 * Setup hooks
	 */
	private function hooks() {
		add_action( 'admin_init', array( $this, 'register_setting' ) );
		add_action( 'admin_init', array( $this, 'catch_activate_license' ) );
		add_action( 'admin_init', array( $this, 'catch_deactivate_license' ) );
		add_action( 'wpseo_dashboard', array( $this, 'screen_license' ) );
	}

	/**
	 * Register license setting
	 */
	public function register_setting() {
		register_setting( 'yoast_wpseo_options', WPSEO_Premium::OPTION_LICENSE_KEY, array( $this, 'sanitize_license' ) );
	}

	/**
	 * Sanitize the license
	 *
	 * @param string $new
	 *
	 * @return bool bool
	 */
	public function sanitize_license( $new ) {

		// Checking if it's the correct option. We need to rewrite the complete option setup in WPSEO 1.5
		if ( ! isset( $new[WPSEO_Premium::OPTION_LICENSE_KEY] ) ) {
			return $new;
		}

		// Sanitize posted license key
		$new_license_key = trim( (string) $new[WPSEO_Premium::OPTION_LICENSE_KEY] );

		// Check if the new license is different than the old license
		if ( $new_license_key == self::get_license_key() ) {
			return $new_license_key;
		}

		// Don't do anything if wpseo_license_deactivate is set
		if ( isset( $_POST['wpseo_license_deactivate'] ) ) {
			return $new_license_key;
		}

		// try to activate new license
		$this->activate_license( $new_license_key );

		// Return new license
		return $new_license_key;

	}

	/**
	 * Catch the activate license post
	 */
	public function catch_activate_license() {
		if ( isset( $_POST['wpseo_license_activate'] ) ) {

			// run a quick security check
			if ( ! check_admin_referer( 'wpseo_license_nonce', 'wpseo_license_nonce' ) ) {
				return; // get out if we didn't click the Activate button
			}

			// Activate the license
			$this->activate_license( trim( get_option( WPSEO_Premium::OPTION_LICENSE_KEY ) ) );
		}
	}

	/**
	 * Catch the deactivation license post
	 */
	public function catch_deactivate_license() {
		// listen for our activate button to be clicked
		if ( isset( $_POST['wpseo_license_deactivate'] ) ) {

			// run a quick security check
			if ( ! check_admin_referer( 'wpseo_license_nonce', 'wpseo_license_nonce' ) ) {
				return; // get out if we didn't click the Activate button
			}

			// Deactivate the license
			$this->deactivate_license();
		}
	}

	/**
	 * Activate the license
	 *
	 * @return object|bool
	 */
	public function activate_license( $license ) {

		// retrieve the license from the database
		//$license = trim( get_option( WPSEO_Premium::OPTION_LICENSE_KEY ) );

		// data to send in our API request
		$api_params = array(
				'edd_action' => 'activate_license',
				'license'    => $license,
				'item_name'  => urlencode( WPSEO_Premium::EDD_PLUGIN_NAME ) // the name of our product in EDD
		);

		// Call the custom API.
		$response = wp_remote_get( add_query_arg( $api_params, WPSEO_Premium::EDD_STORE_URL ), array( 'timeout' => 15, 'sslverify' => false ) );

		// make sure the response came back okay
		if ( is_wp_error( $response ) ) {
			return false;
		}

		// decode the license data
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		// Update option
		update_option( WPSEO_Premium::OPTION_LICENSE_STATUS, $license_data->license );

		return $license_data;
	}

	/**
	 * Deactivate license
	 *
	 * @return bool
	 */
	public function deactivate_license() {
		// retrieve the license from the database
		$license = trim( get_option( WPSEO_Premium::OPTION_LICENSE_KEY ) );

		// data to send in our API request
		$api_params = array(
				'edd_action' => 'deactivate_license',
				'license'    => $license,
				'item_name'  => urlencode( WPSEO_Premium::EDD_PLUGIN_NAME ) // the name of our product in EDD
		);

		// Call the custom API.
		$response = wp_remote_get( add_query_arg( $api_params, WPSEO_Premium::EDD_STORE_URL ), array( 'timeout' => 15, 'sslverify' => false ) );

		// make sure the response came back okay
		if ( is_wp_error( $response ) ) {
			return false;
		}

		// decode the license data
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		if ( $license_data->license == 'deactivated' ) {
			delete_option( WPSEO_Premium::OPTION_LICENSE_STATUS );
		}

		return true;
	}

	/**
	 * Display the license screen
	 */
	public function screen_license() {

		$license = self::get_license_key();

		echo "<h2>" . __( 'WordPress SEO Premium License', 'wordpress-seo' ) . "</h2>\n";
		wp_nonce_field( 'wpseo_license_nonce', 'wpseo_license_nonce' );

		echo '<label class="textinput" for="wpseo_license_key">License key:</label>';
		echo '<input class="textinput" type="text" id="wpseo_license_key" name="wpseo_license_key[wpseo_license_key]" value="' . $license . '">';
		echo "<br class='clear' />";

		if ( false !== $license && ''  !== $license ) {

			$status = self::get_license_status();

			echo "<label class='textinput'>" . __( 'License Status', 'wordpress-seo' ) . "</label>";

			if ( $status !== false && $status == 'valid' ) {
				?>
				<span style="color:green;"><?php _e( 'ACTIVE', 'wordpress-seo' ); ?></span><br />
				<input type="submit" class="button-secondary" name="wpseo_license_deactivate" value="<?php _e( 'Deactivate License', 'wordpress-seo' ); ?>" />
			<?php
			} else {
				?>
				<span style="color:red;"><?php _e( 'INACTIVE', 'wordpress-seo' ); ?></span><br />
				<input type="submit" class="button-secondary" name="wpseo_license_activate" value="<?php _e( 'Activate License', 'wordpress-seo' ); ?>" />
			<?php } ?>

		<?php
		}
	}

	/**
	 * Get the license key
	 *
	 * @return string|bool
	 */
	public static function get_license_key() {
		return get_option( WPSEO_Premium::OPTION_LICENSE_KEY, false );
	}

	/**
	 * Get the license status
	 *
	 * @return string|bool
	 */
	public static function get_license_status() {
		return get_option( WPSEO_Premium::OPTION_LICENSE_STATUS, false );
	}
}