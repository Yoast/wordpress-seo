<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Component_Connect_Google_Search_Console
 */
class WPSEO_Config_Component_Connect_Google_Search_Console implements WPSEO_Config_Component {

	/** @var array Map option keys to api keys */
	private $mapping = array(
		'refresh_token' => 'refreshToken',
		'access_token'  => 'accessToken',
		'expires'       => 'accessTokenExpires',
	);

	/**
	 * @return string
	 */
	public function get_identifier() {
		return 'connectGoogleSearchConsole';
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
			'wpseo-gsc-access_token',
			array(
				'refresh_token' => '',
				'access_token'  => '',
				'expires'       => 0,
			)
		);

		$data = array(
			'profile' => WPSEO_GSC_Settings::get_profile(),
		);

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

		$saved_profile = update_option( WPSEO_GSC::OPTION_WPSEO_GSC, array( 'profile' => $data['profile'] ) );

		$results = array(
			'profile' => $saved_profile,
		);

		update_option(
			'wpseo-gsc-access_token',
			array(
				'refresh_token' => $data['refreshToken'],
				'access_token'  => $data['accessToken'],
				'expires'       => $data['accessTokenExpires'],
			)
		);

		$saved_option = get_option(
			'wpseo-gsc-access_token',
			array(
				'refresh_token' => '',
				'access_token'  => '',
				'expires'       => 0,
			)
		);

		foreach ( $this->mapping as $option_key => $api_key ) {
			$results[ $api_key ] = ( $saved_option[ $option_key ] === $data[ $api_key ] );
		}

		return $results;
	}
}
