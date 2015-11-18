<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * This class adds the helpscout beacon by hooking on admin_footer.
 */
class WPSEO_HelpScout_Beacon {

	const YST_SEO_SUPPORT_IDENTIFY = 'yst_seo_support_identify';

	/**
	 * @var string The current opened page without the prefix.
	 */
	private $current_page = '';

	/**
	 * Setting the hook to load the beacon
	 *
	 * @param string $current_page The current opened page without the prefix.
	 */
	public function __construct( $current_page ) {
		$this->current_page = $current_page;
		add_action( 'admin_enqueue_scripts', array( $this, 'load_assets' ) );
	}

	/**
	 * Loading the js file and the translations for the HelpScout beacon.
	 */
	public function load_assets() {
		wp_enqueue_script( 'yoast-seo-helpscout-beacon', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/yoast-seo-helpscout-beacon' . WPSEO_CSSJS_SUFFIX . '.js', array(), WPSEO_VERSION, true );
		wp_localize_script( 'yoast-seo-helpscout-beacon', 'wpseoHelpscoutBeaconL10n', $this->localize_beacon() );
	}

	/**
	 * Loads the beacon translations
	 *
	 * @return array
	 */
	private function localize_beacon() {
		return array(
			'config' => array(
				'instructions' => $this->get_instructions(),
				'icon'         => 'question',
				'color'        => '#A4286A',
				'poweredBy'    => false,
				'translation'  => $this->get_translations(),
			),
			'identify' => $this->get_identify(),
			'suggest'  => $this->get_suggest(),
		);
	}

	/**
	 * Parsing the text for the beacon instructions, this is what the user sees when he is using the beacon
	 *
	 * @return string
	 */
	private function get_instructions() {
		$return  = __( "Please explain what you're trying to find or do. If something isn't working, please explain what you expect to happen. If you can make a screenshot, please attach it.", 'wordpress-seo-premium' );
		$return .= ' ';
		$return .= __( 'Note: submitting this form also sends us debug info about your server.', 'wordpress-seo-premium' );

		return $return;
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
			'contactSuccessLabel'       => __( 'Message sent, thank you!', 'wordpress-seo-premium' ),
			'contactSuccessDescription' => __( 'Someone from Team Yoast will get back to you soon, normally within a couple of hours.', 'wordpress-seo-premium' ),
		);
	}


	/**
	 * Retrieve data to populate the beacon email form
	 *
	 * @return array
	 */
	private function get_identify() {
		$identify_data = get_transient( self::YST_SEO_SUPPORT_IDENTIFY );
		if ( ! $identify_data ) {
			$identifier = new WPSEO_HelpScout_Beacon_Identifier();
			$identify_data = $identifier->get_data();
			if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
				set_transient( self::YST_SEO_SUPPORT_IDENTIFY, $identify_data, DAY_IN_SECONDS );
			}
		}

		return $identify_data;
	}

	/**
	 * Getting the suggestions for the current page
	 *
	 * @return array
	 */
	private function get_suggest() {
		$suggest = new WPSEO_HelpScout_Beacon_Suggest();

		return $suggest->get_suggest( $this->current_page );
	}

}
