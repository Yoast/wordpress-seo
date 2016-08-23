<?php

class WPSEO_Config_Component_Connect_Google_Search_Console implements WPSEO_Config_Component {

	/**
	 * @return string
	 */
	public function get_identifier() {
		return 'connectGoogleSearchConsole';
	}

	/**
	 * @return mixed
	 */
	public function get_data() {

		$access_token_data = get_option(
			'wpseo-gsc-access_token',
			array(
				'refresh_token' => '',
				'access_token'  => '',
				'expires'       => 0
			)
		);

		return array(
			'profile'            => WPSEO_GSC_Settings::get_profile(),
			'refreshToken'       => $access_token_data['refresh_token'],
			'accessToken'        => $access_token_data['access_token'],
			'accessTokenExpires' => $access_token_data['expires']
		);
	}

	/**
	 * @param $data
	 *
	 * @return mixed
	 */
	public function set_data( $data ) {
		// TODO: Implement set_data() method.
	}

	/**
	 * @return WPSEO_Config_Field
	 */
	public function get_field() {
		return new WPSEO_Config_Field_Connect_Google_Search_Console();
	}
}