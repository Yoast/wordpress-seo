<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Component_Connect_Google_Search_Console
 */
class WPSEO_Config_Component_Connect_Google_Search_Console implements WPSEO_Config_Component {

	const OPTION_ACCESS_TOKEN = 'wpseo-gsc-access_token';
	const OPTION_REFRESH_TOKEN = 'wpseo-gsc-refresh_token';

	/** @var array Map option keys to api keys */
	protected $mapping = array(
		'refresh_token' => 'refreshToken',
		'access_token'  => 'accessToken',
		'expires'       => 'accessTokenExpires',
	);

	/** @var WPSEO_GSC_Service Service to use */
	protected $gsc_service;

	/**
	 * WPSEO_Config_Component_Connect_Google_Search_Console constructor.
	 */
	public function __construct() {
		$this->gsc_service = new WPSEO_GSC_Service( $this->get_profile() );
	}

	/**
	 * @param WPSEO_GSC_Service $service Set service to use.
	 */
	public function set_gsc_service( WPSEO_GSC_Service $service ) {
		$this->gsc_service = $service;
	}

	/**
	 * @return string
	 */
	public function get_identifier() {
		return 'ConnectGoogleSearchConsole';
	}

	/**
	 * @return WPSEO_Config_Field
	 */
	public function get_field() {
		return new WPSEO_Config_Field_Connect_Google_Search_Console();
	}

	/**
	 * Get the data for the field.
	 *
	 * @return mixed
	 */
	public function get_data() {

		$access_token_data = get_option(
			self::OPTION_ACCESS_TOKEN,
			array(
				'refresh_token' => '',
				'access_token'  => '',
				'expires'       => 0,
			)
		);

		$data = array( 'profile' => $this->get_profile() );

		foreach ( $this->mapping as $option_key => $api_key ) {
			$data[ $api_key ] = $access_token_data[ $option_key ];
		}

		return $data;
	}

	/**
	 * Save data
	 *
	 * @param array $data Data containing changes.
	 *
	 * @return mixed
	 */
	public function set_data( $data ) {

		$current_data = $this->get_data();

		$this->handle_access_token_clear( $current_data, $data );
		$this->handle_profile_change( $current_data, $data );

		// Save profile.
		$has_saved = update_option(
			WPSEO_GSC::OPTION_WPSEO_GSC,
			array( 'profile' => $data['profile'] )
		);

		if ( ! empty( $data['accessToken'] ) ) {
			// Save access token information.
			update_option(
				self::OPTION_ACCESS_TOKEN,
				array(
					'refresh_token' => $data['refreshToken'],
					'access_token'  => $data['accessToken'],
					'expires'       => $data['accessTokenExpires'],
				)
			);

			update_option( self::OPTION_REFRESH_TOKEN, trim( $data['refreshToken'] ) );
		}

		if ( empty( $data['accessToken'] ) ) {
			delete_option( self::OPTION_ACCESS_TOKEN );
			delete_option( self::OPTION_REFRESH_TOKEN );
		}

		// Get the saved state.
		$saved_option = get_option(
			self::OPTION_ACCESS_TOKEN,
			array(
				'refresh_token' => '',
				'access_token'  => '',
				'expires'       => 0,
			)
		);

		// Collect results to return to the configurator.
		$results = array(
			'profile' => $has_saved,
		);

		foreach ( $this->mapping as $option_key => $api_key ) {
			$results[ $api_key ] = ( $saved_option[ $option_key ] === $data[ $api_key ] );
		}

		return $results;
	}

	/**
	 * Check for token changes and reset GSC settings if it has been removed
	 *
	 * @param array $current_data Saved data before changes.
	 * @param array $data         Data after changes.
	 */
	protected function handle_access_token_clear( $current_data, $data ) {
		// If the accessToken has not changed.
		if ( $current_data['accessToken'] === $data['accessToken'] ) {
			return;
		}

		// If we have an accessToken we don't want to reset.
		if ( '' !== $data['accessToken'] ) {
			return;
		}

		$this->clear_gsc_data();
	}

	/**
	 * Remove issues when the profile has changed
	 *
	 * @param array $current_data Saved data before changes.
	 * @param array $data         Data after changes.
	 */
	protected function handle_profile_change( $current_data, $data ) {
		// If the profile has been changed, remove issues.
		if ( $current_data['profile'] === $data['profile'] ) {
			return;
		}

		$this->reload_issues();
	}

	/**
	 * Get the current GSC profile
	 *
	 * @return string
	 */
	protected function get_profile() {
		return WPSEO_GSC_Settings::get_profile();
	}

	/**
	 * Clear the GSC data
	 */
	protected function clear_gsc_data() {
		WPSEO_GSC_Settings::clear_data( $this->gsc_service );
	}

	/**
	 * Reload GSC issues
	 */
	protected function reload_issues() {
		WPSEO_GSC_Settings::reload_issues();
	}
}
