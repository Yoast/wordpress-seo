<?php
/**
 * WPSEO plugin file.
 *
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
		$user_email   = ( $current_user->ID > 0 ) ? $current_user->user_email : '';

		$signup_text = sprintf(
			/* translators: %1$s expands to Yoast SEO for WordPress, %2$s expands to Yoast */
			__( 'Sign up for our newsletter if you would like to keep up-to-date about %1$s, other cool plugins by %2$s, and interesting news and tips from the world of SEO.', 'wordpress-seo' ),
			'Yoast SEO for WordPress',
			'Yoast'
		);

		$gdpr_notice = sprintf(
			/* translators: %1$s expands Yoast, %2$s expands to an opening anchor tag, %3$s expands to a closing anchor tag. */
			__( '%1$s respects your privacy. Read our %2$sprivacy policy%3$s on how we handle your personal information.', 'wordpress-seo' ),
			'Yoast',
			'<a target="_blank" rel="noopener noreferrer" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/gdpr-config-wizard' ) . '">',
			'</a>'
		);

		$this->set_property( 'label', $signup_text );
		$this->set_property( 'decoration', plugin_dir_url( WPSEO_FILE ) . 'images/newsletter-collage.png' );
		$this->set_property( 'mailchimpActionUrl', 'https://yoast.us1.list-manage.com/subscribe/post-json?u=ffa93edfe21752c921f860358&id=972f1c9122' );
		$this->set_property( 'currentUserEmail', $user_email );
		$this->set_property( 'freeAccountNotice', __( 'Includes a free MyYoast account which gives you access to our free SEO for Beginners course!', 'wordpress-seo' ) );
		$this->set_property( 'GDPRNotice', sprintf( '<small>%s</small>', $gdpr_notice ) );
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
