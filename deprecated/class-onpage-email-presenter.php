<?php
/**
 * @package WPSEO\Admin
 */

/**
 * @deprecated
 *
 * This class is the presenter for the email. Based on the given parameters and data it will parse the email message
 * that will be send
 */
class WPSEO_OnPage_Email_Presenter {

	/**
	 * @deprecated
	 */
	public function __construct() {}

	/**
	 * @deprecated
	 */
	public function get_subject() {
		return array(
			'0' => '',
			'1' => '',
		);
	}

	/**
	 * @deprecated 3.0.7
	 */
	public function get_message() {
		return '';
	}
}
