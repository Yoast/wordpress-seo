<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Identifier for fetching installation related data like: other plugins, environment, etc.
 */
class WPSEO_HelpScout_Beacon_Identifier {

	/**
	 * Build data to populate the beacon email form
	 *
	 * @return array
	 */
	public function get_data() {
		// Do not make these strings translateable! They are for our support agents, the user won't see them!
		return array(
			'name'                                                     => $this->get_user_info(),
			'email'                                                    => $this->get_user_info( 'email' ),
			'WordPress Version'                                        => $this->get_wordpress_version(),
			'Yoast SEO'                                                => $this->get_yoast_seo_info(),
			'Server'                                                   => $this->get_server_info(),
			'<a href="' . admin_url( 'themes.php' ) . '">Theme</a>'    => $this->get_theme_info(),
			'<a href="' . admin_url( 'plugins.php' ) . '">Plugins</a>' => $this->get_current_plugins(),
		);
	}

	/**
	 * Returns basic info about the server software
	 *
	 * @return string
	 */
	private function get_server_info() {
		$out = '<table>';

		// Validate if the server address is a valid IP-address.
		if ( $ipaddress = filter_input( INPUT_SERVER , 'SERVER_ADDR', FILTER_VALIDATE_IP ) ) {
			$out .= '<tr><td>IP</td><td>' . $ipaddress . '</td></tr>';
			$out .= '<tr><td>Hostname</td><td>' . gethostbyaddr( $ipaddress ) . '</td></tr>';
		}
		$out .= '<tr><td>OS</td><td>' . php_uname( 's r' ) . '</td></tr>';
		$out .= '<tr><td>PHP</td><td>' . PHP_VERSION . '</td></tr>';
		$out .= '<tr><td>CURL</td><td>' . $this->get_curl_info() . '</td></tr>';
		$out .= '</table>';

		return $out;
	}

	/**
	 * Returns info about the Yoast SEO plugin version and license
	 *
	 * @return string
	 */
	private function get_yoast_seo_info() {
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
	 * @param string $what What to retrieve, defaults to name.
	 *
	 * @return string
	 */
	private function get_user_info( $what = 'name' ) {
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
	private function get_wordpress_version() {
		global $wp_version;
		$msg = $wp_version;
		if ( is_multisite() ) {
			$msg .= ' MULTI-SITE';
		}

		return $msg;
	}

	/**
	 * Returns the curl version, if curl is found
	 *
	 * @return string
	 */
	private function get_curl_info() {
		if ( function_exists( 'curl_version' ) ) {
			$curl = curl_version();
			$msg  = $curl['version'];
			if ( ! $curl['features'] && CURL_VERSION_SSL ) {
				$msg .= ' - NO SSL SUPPORT';
			}
		}
		else {
			$msg = 'No CURL installed';
		}

		return $msg;
	}

	/**
	 * Returns a formatted HTML string for the current theme
	 *
	 * @return string
	 */
	private function get_theme_info() {
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
	private function get_current_plugins() {
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
