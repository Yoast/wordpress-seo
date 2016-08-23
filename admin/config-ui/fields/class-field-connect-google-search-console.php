<?php

class WPSEO_Config_Field_Connect_Google_Search_Console extends WPSEO_Config_Field {
	public function __construct() {
		parent::__construct( 'connectGoogleSearchConsole', 'ConnectGoogleSearchConsole' );
	}

	public function get_data() {
		return array(
			'profile'            => '',
			'refreshToken'       => '',
			'accessToken'        => '',
			'accessTokenExpires' => 0
		);
	}
}
