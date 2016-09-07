<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Mailchimp_Signup
 */
class WPSEO_Config_Field_Mailchimp_Signup extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Mailchimp_Signup constructor.
	 */
	public function __construct() {
		parent::__construct( 'mailchimpSignup', 'MailchimpSignup' );

		$current_user = wp_get_current_user();
		$user_email = ( $current_user->ID > 0 ) ? $current_user->user_email : '';

		$this->set_property( 'label', __( 'If you would like us to keep you up-to-date regarding Yoast SEO and other plugins by Yoast, subscribe to our newsletter:', 'wordpress-seo' ) );
		$this->set_property( 'mailchimpActionUrl', 'http://yoast.us1.list-manage1.com/subscribe/post-json?u=ffa93edfe21752c921f860358&id=972f1c9122' );
		$this->set_property( 'currentUserEmail', $user_email );
		$this->set_property( 'userName', $current_user->user_firstname . ' ' . $current_user->user_lastname );
	}
}
