<?php
/**
 * @package WPSEO\Admin
 */

_deprecated_file( __FILE__, 'WPSEO 3.0.7' );

/**
 * @deprecated
 *
 * This class is the presenter for the email. Based on the given parameters and data it will parse the email message
 * that will be send
 */
class WPSEO_OnPage_Email_Presenter {

	/**
	 * @deprecated 3.0.7
	 */
	public function __construct() {
		_deprecated_constructor( __CLASS__, 'WPSEO 3.0.7' );
	}

	/**
	 * @deprecated 3.0.7
	 */
	public function get_subject() {
		_deprecated_function( __METHOD__, 'WPSEO 3.0.7' );

		return array(
			'0' => '',
			'1' => '',
		);
	}

	/**
	 * @deprecated 3.0.7
	 */
	public function get_message() {
		_deprecated_function( __METHOD__, 'WPSEO 3.0.7' );

		return '';
	}
}
