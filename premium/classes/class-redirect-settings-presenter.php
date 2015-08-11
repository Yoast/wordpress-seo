<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Settings_Presenter
 */
class WPSEO_Redirect_Settings_Presenter extends WPSEO_Redirects_Tab_Presenter {

	/**
	 * Extending the view vars with pre settings key
	 *
	 * @return array
	 */
	protected function get_view_vars() {
		return array_merge(
			$this->view_vars,
			array(
				'pre_settings' => $this->writable_redirect_file(),
			)
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

}