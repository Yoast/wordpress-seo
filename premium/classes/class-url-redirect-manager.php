<?php

if ( class_exists( 'WPSEO_Redirect_Manager' ) && ! class_exists( 'WPSEO_URL_Redirect_Manager', false ) ) {

	class WPSEO_URL_Redirect_Manager extends WPSEO_Redirect_Manager {

	protected $option_redirects = 'wpseo-premium-redirects';

	/**
	 * Do the PHP redirect
	 */
	public function do_redirects() {

		// Check if PHP redirects are enabled
		if( false == $this->is_php_redirects_enabled() ) {
			return;
		}

		// Load redirects
		$redirects = $this->get_redirects();

		// Do the actual redirect
		if ( count( $redirects ) > 0 ) {

			// Decode the URL
			$url = htmlspecialchars_decode( urldecode( $_SERVER['REQUEST_URI'] ) );

			if ( isset ( $redirects[$url] ) ) {
				wp_redirect( $redirects[$url]['url'], $redirects[$url]['type'] );
				exit;
			}
		}

	}

}

}
