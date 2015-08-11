<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Presenter
 */
class WPSEO_Redirect_Presenter {

	/**
	 * Function that outputs the redirect page
	 *
	 * @param array $view_vars
	 */
	public function display( $view_vars = array() ) {
		// Extracting the vars.
		// @codingStandardsIgnoreStart
		extract( array_merge( $view_vars, $this->get_view_vars() ) );
		// @codingStandardsIgnoreEnd

		require_once( WPSEO_PATH . 'premium/views/redirects.php' );
	}

	/**
	 * Getting the variables for the view
	 *
	 * @return array
	 */
	private function get_view_vars() {
		return array(
			'redirect_types'  => $this->get_redirect_types(),
			'nonce'           => wp_create_nonce( 'wpseo-redirects-ajax-security' ),
			'old_url'         => $this->get_old_url(),
			'pre_settings'    => $this->writable_redirect_file(),
		);
	}

	/**
	 * Check if it is possible to write to the files
	 *
	 * @return string
	 */
	private function writable_redirect_file() {
		// Get redirect options.
		$redirect_options = WPSEO_Redirect_Manager::get_options();

		if ( 'on' !== $redirect_options['disable_php_redirect'] ) {
			return '';
		}

		// Do file checks.
		$file_path      = WPSEO_Redirect_File_Manager::get_file_path();
		$file_can_write = file_exists( $file_path );

		if ( WPSEO_Utils::is_apache() ) {
			if ( 'on' === $redirect_options['separate_file'] ) {
				if ( $file_can_write ) {
					$return  = '<div style="margin: 5px 0; padding: 3px 10px; background-color: #ffffe0; border: 1px solid #E6DB55; border-radius: 3px">';
					$return .= '<p>' . __( "As you're on Apache, you should add the following include to the website httpd config file:", 'wordpress-seo-premium' ) . '</p>';
					$return .= '<pre>Include ' . $file_path . '</pre>';
					$return .= '</div>';

					return $return;
				}
			}
			else {
				if ( ! is_writable( WPSEO_Redirect_Htaccess::get_htaccess_file_path() ) ) {
					/* translators: %s: '.htaccess' file name */
					return "<div class='error'><p><strong>" . sprintf( __( 'We\'re unable to save the redirects to your %s file. Please make the file writable.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' ) . "</strong></p></div>\n";
				}
			}
		}

		if ( WPSEO_Utils::is_nginx() && $file_can_write ) {
			$return  = '<div style="margin: 5px 0; padding: 3px 10px; background-color: #ffffe0; border: 1px solid #E6DB55; border-radius: 3px">';
			$return .= '<p>' . __( 'As you\'re on Nginx, you should add the following include to the NGINX config file:', 'wordpress-seo-premium' ) . '</p>';
			$return .= '<pre>include ' . $file_path . ';</pre>';
			$return .= '</div>';

			return $return;
		}

		return "<div class='error'><p><strong>" . __( sprintf( "We're unable to save the redirect file to %s", $file_path ), 'wordpress-seo-premium' ) . "</strong></p></div>\n";
	}

	/**
	 * Get the old url from the URL
	 *
	 * @return string
	 */
	private function get_old_url() {
		// Check if there's an old URL set.
		if ( ( $old_url = filter_input( INPUT_GET, 'old_url', FILTER_DEFAULT, array( 'default' => '' ) ) ) !== '' ) {
			return esc_attr( urldecode( $old_url ) );
		}

		return '';
	}

	/**
	 * Getting array with the available redirect types
	 *
	 * @return array|void
	 */
	private function get_redirect_types() {
		$redirect_types = array(
			'301' => __( '301 Moved Permanently', 'wordpress-seo-premium' ),
			'302' => __( '302 Found', 'wordpress-seo-premium' ),
			'307' => __( '307 Temporary Redirect', 'wordpress-seo-premium' ),
			'410' => __( '410 Content Deleted', 'wordpress-seo-premium' ),
		);

		return apply_filters( 'wpseo_premium_redirect_types', $redirect_types );
	}

}
