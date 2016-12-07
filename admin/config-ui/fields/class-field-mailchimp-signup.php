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

		$this->set_property( 'title' , __( 'Newsletter signup', 'wordpress-seo' ) );
		$this->set_property(
			'label',
			sprintf(
				/* translators: %s expands to Yoast SEO. */
				__( 'If you would like us to keep you up-to-date regarding %s, other plugins by Yoast and major news in the world of SEO, subscribe to our newsletter:', 'wordpress-seo' ),
				'Yoast SEO'
			)
		);

		$this->set_property( 'mailchimpActionUrl', 'https://yoast.us1.list-manage.com/subscribe/post-json?u=ffa93edfe21752c921f860358&id=972f1c9122' );
		$this->set_property( 'currentUserEmail', $user_email );
		$this->set_property( 'userName', trim( $current_user->user_firstname . ' ' . $current_user->user_lastname ) );
	}

	/**
	 * Get the data
	 *
	 * @return array
	 */
	public function get_data() {
		return array(
			'hasSignup' => $this->has_mailchimp_signup(),
		);

	}

	/**
	 * Checks if the user has entered his email for mailchimp already.
	 *
	 * @return bool
	 */
	protected function has_mailchimp_signup() {
		$user_meta = get_user_meta( get_current_user_id(), WPSEO_Config_Component_Mailchimp_Signup::META_NAME, true );
		return ( ! empty( $user_meta ) );
	}
}
