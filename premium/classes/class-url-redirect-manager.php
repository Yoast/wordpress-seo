<?php

if ( class_exists( 'WPSEO_Redirect_Manager' ) && ! class_exists( 'WPSEO_URL_Redirect_Manager', false ) ) {

	class WPSEO_URL_Redirect_Manager extends WPSEO_Redirect_Manager {

		protected $option_redirects = 'wpseo-premium-redirects';

		/**
		 * Do the PHP redirect
		 */
		public function do_redirects() {

			// Check if PHP redirects are enabled
			if ( false == $this->is_php_redirects_enabled() ) {
				return;
			}

			// Load redirects
			$redirects = $this->get_redirects();

			// Do the actual redirect
			if ( count( $redirects ) > 0 ) {

				// Decode the URL
				$url = htmlspecialchars_decode( urldecode( $_SERVER['REQUEST_URI'] ) );

				if ( isset ( $redirects[ $url ] ) ) {
					$redirect_url = $redirects[ $url ]['url'];
					if ( '/' === substr( $redirect_url, 0, 1 ) ) {
						$redirect_url = home_url( $redirect_url );
					}

					if ( 410 !== $redirects[ $url ]['type'] ) {
						wp_redirect( $redirect_url, $redirects[ $url ]['type'] );
						exit;
					} else {
						$this->do_410();
					}
				}
			}

		}

		/**
		 * Handle the 410 status codes
		 */
		private function do_410() {
			header( "HTTP/1.1 410 Gone" );
			global $wp_query;
			$wp_query->is_404 = true;
		}
	}

}
