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
		$identify    = WPSEO_Utils::json_encode( $this->identify_data() );

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
			'contactSuccessLabel'       => __( 'Message sent, thank you!', 'wordpress-seo-premium' ),
			'contactSuccessDescription' => __( 'Someone from Team Yoast will get back to you soon, normally within a couple of hours.', 'wordpress-seo-premium' ),
		);
	}

	/**
	 * Retrieve data to populate the beacon email form
	 *
	 * @return array
	 */
	private function identify_data() {
		$identify_data = get_transient( self::YST_SEO_SUPPORT_IDENTIFY );
		if ( ! $identify_data ) {
			$identify_data = $this->build_identify_data();
			if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
				set_transient( self::YST_SEO_SUPPORT_IDENTIFY, $identify_data, DAY_IN_SECONDS );
			}
		}

		return $identify_data;
	}

	/**
	 * Build data to populate the beacon email form
	 *
	 * @return array
	 */
	private function build_identify_data() {
		// Do not make these strings translateable! They are for our support agents, the user won't see them!
		$identify_data = array(
			'name'                                                     => $this->identify_user(),
			'email'                                                    => $this->identify_user( 'email' ),
			'WordPress Version'                                        => $this->identify_wordpress_version(),
			'Yoast SEO'                                                => $this->identify_yoast_seo_data(),
			'Server'                                                   => $this->identify_server(),
			'<a href="' . admin_url( 'themes.php' ) . '">Theme</a>'    => $this->identify_theme(),
			'<a href="' . admin_url( 'plugins.php' ) . '">Plugins</a>' => $this->identify_plugins(),
		);

		return $identify_data;
	}

	/**
	 * Returns basic info about the server software
	 *
	 * @return string
	 */
	private function identify_server() {
		$out = '<table>';
		$out .= '<tr><td>IP</td><td>' . filter_input( INPUT_SERVER, 'SERVER_ADDR' ) . '</td></tr>';
		$out .= '<tr><td>Hostname</td><td>' . gethostbyaddr( filter_input( INPUT_SERVER, 'SERVER_ADDR' ) ) . '</td></tr>';
		$out .= '<tr><td>OS</td><td>' . php_uname( 's r' ) . '</td></tr>';
		$out .= '<tr><td>PHP</td><td>' . PHP_VERSION . '</td></tr>';
		$out .= '<tr><td>CURL</td><td>' . $this->identify_curl() . '</td></tr>';
		$out .= '</table>';

		return $out;
	}

	/**
	 * Returns info about the Yoast SEO plugin version and license
	 *
	 * @return string
	 */
	private function identify_yoast_seo_data() {
		$license_manager = new Yoast_Plugin_License_Manager( new WPSEO_Product_Premium() );

		$out = '<table>';
		$out .= '<tr><td>Version</td><td>' . WPSEO_VERSION . '</td></tr>';
		$out .= '<tr><td>License</td><td>' . '<a href=" ' . admin_url( 'admin.php?page=wpseo_licenses#top#licenses' ) . ' ">' . $license_manager->get_license_key() . '</a>' . '</td></tr>';
		$out .= '<tr><td>Status</td><td>' . $license_manager->get_license_status() . '</td></tr>';
		$out .= '</table>';

		return $out;
	}

	/**
	 * Returns info about the current user
	 *
	 * @param string $what What to retrieve, defaults to name
	 *
	 * @return string
	 */
	private function identify_user( $what = 'name' ) {
		global $current_user;
		get_currentuserinfo();

		switch ( $what ) {
			case 'email':
				$out = $current_user->user_email;
				break;
			case 'name':
			default:
				$out = $current_user->user_firstname . ' ' . $current_user->user_lastname;
				break;
		}

		return $out;
	}

	/**
	 * Returns the WordPress version + a suffix if current WP is multi site
	 *
	 * @return string
	 */
	private function identify_wordpress_version() {
		global $wp_version;
		$msg = $wp_version;
		if ( is_multisite() ) {
			$msg .= ' MULTI-SITE';
		}

		return $msg;
	}

	/**
	 * Returns the curl version, if curl is found
	 * @return string
	 */
	private function identify_curl() {
		if ( function_exists( 'curl_version' ) ) {
			$curl = curl_version();
			$msg  = $curl['version'];
			if ( ! $curl['features'] & CURL_VERSION_SSL ) {
				$msg .= " - NO SSL SUPPORT";
			}
		} else {
			$msg = 'No CURL installed';
		}

		return $msg;
	}

	/**
	 * Returns a formatted HTML string for the current theme
	 *
	 * @return string
	 */
	private function identify_theme() {
		$theme = wp_get_theme();

		$msg = '<a href="' . $theme->display( 'ThemeURI' ) . '">' . $theme->display( 'Name' ) . '</a> v' . $theme->display( 'Version' ) . ' by ' . $theme->display( 'Author' );

		if ( is_child_theme() ) {
			$msg .= '<br />' . 'Child theme of: ' . $theme->display( 'Template' );
		}

		return $msg;
	}

	/**
	 * Returns a formatted HTML list of all active plugins
	 *
	 * @return string
	 */
	private function identify_plugins() {
		$updates_avail = get_site_transient( 'update_plugins' );

		$msg = '';
		foreach ( wp_get_active_and_valid_plugins() as $plugin ) {
			$plugin_data = get_plugin_data( $plugin );

			$plugin_file = str_replace( trailingslashit( WP_PLUGIN_DIR ), '', $plugin );

			if ( isset( $updates_avail->response[ $plugin_file ] ) ) {
				$msg .= '<i class="icon-close1"></i> ';
			}
			$msg .= '<a href="' . $plugin_data['PluginURI'] . '">' . $plugin_data['Name'] . '</a> v' . $plugin_data['Version'] . '<br/>';
		}

		return $msg;
	}
}
