<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_HelpScout_Beacon
 */
class WPSEO_HelpScout_Beacon {

	/**
	 * Setting the hook to load the beacon
	 */
	public function __construct() {
		add_action( 'admin_footer', array( $this, 'load_beacon' ) );
	}

	/**
	 * Loading the beacon view.
	 */
	public function load_beacon() {
		$translation = WPSEO_Utils::json_encode( $this->get_translations() );

		require WPSEO_PATH . 'premium/views/helpscout_beacon.php';

	}

	/**
	 * Translates the values for the beacon. The array keys are the names of the translateble strings in the beacon.
	 *
	 * @return array
	 */
	private function get_translations() {

		return array(
			'searchLabel'               => __( 'What can we help you with?', 'wordpress-seo-premium' ),
			'searchErrorLabel'          => __( 'Your search timed out. Please double-check your internet connection and try again.', 'wordpress-seo-premium' ),
			'noResultsLabel'            => __( 'No results found for', 'wordpress-seo-premium' ),
			'contactLabel'              => __( 'Send a Message', 'wordpress-seo-premium' ),
			'attachFileLabel'           => __( 'Attach a file', 'wordpress-seo-premium' ),
			'attachFileError'           => __( 'The maximum file size is 10mb', 'wordpress-seo-premium' ),
			'nameLabel'                 => __( 'Your Name', 'wordpress-seo-premium' ),
			'nameError'                 => __( 'Please enter your name', 'wordpress-seo-premium' ),
			'emailLabel'                => __( 'Email address', 'wordpress-seo-premium' ),
			'emailError'                => __( 'Please enter a valid email address', 'wordpress-seo-premium' ),
			'topicLabel'                => __( 'Select a topic', 'wordpress-seo-premium' ),
			'topicError'                => __( 'Please select a topic from the list', 'wordpress-seo-premium' ),
			'subjectLabel'              => __( 'Subject', 'wordpress-seo-premium' ),
			'subjectError'              => __( 'Please enter a subject', 'wordpress-seo-premium' ),
			'messageLabel'              => __( 'How can we help you?', 'wordpress-seo-premium' ),
			'messageError'              => __( 'Please enter a message', 'wordpress-seo-premium' ),
			'sendLabel'                 => __( 'Send', 'wordpress-seo-premium' ),
			'contactSuccessLabel'       => __( 'Message sent!', 'wordpress-seo-premium' ),
			'contactSuccessDescription' => __( 'Thanks for reaching out! Someone from our team will get back to you soon.', 'wordpress-seo-premium' ),
		);
	}
}
