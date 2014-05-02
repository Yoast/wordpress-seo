<?php

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
			if ( isset ( $redirects[$_SERVER['REQUEST_URI']] ) ) {
				wp_redirect( $redirects[$_SERVER['REQUEST_URI']], 301 );
				exit;
			}
		}

	}

}