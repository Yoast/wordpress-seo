<?php

if ( class_exists( 'WPSEO_Redirect_Manager' ) && ! class_exists( 'WPSEO_URL_Redirect_Manager', false ) ) {

	class WPSEO_URL_Redirect_Manager extends WPSEO_Redirect_Manager {

		protected $redirects;

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
			$this->redirects = $this->get_redirects();

			// Do the actual redirect
			if ( count( $this->redirects ) > 0 ) {
				$this->check_if_redirect();
			}

		}

		/**
		 * Check if redirect should be done
		 */
		private function check_if_redirect() {
			// Decode the URL
			$url = htmlspecialchars_decode( urldecode( $_SERVER['REQUEST_URI'] ) );

			// Get the URL and
			if( $redirect_url = $this->find_url( $url, $this->redirects ) ) {
				$this->do_redirect( $url, $redirect_url );
			}
		}

		/**
		 * Check if URL exists in the redirects.
		 *
		 * @param $url
		 *
		 * @return string
		 */
		private function find_url( $url ) {
			if ( isset ( $this->redirects[ $url ] ) ) {
				return $this->redirect_url( $url );
			}

			// Fallback if url cannot be found, possibly remove the slash on the end
			$trimmed_url = rtrim( $url, '/' );
			if ( isset ( $this->redirects[ $trimmed_url ] ) ) {
				return $this->redirect_url( $trimmed_url );
			}

		}

		/**
		 * Getting the redirect url by given $url
		 *
		 * @param string $url
		 *
		 * @return string mixed
		 */
		private function redirect_url( $url ) {
			$redirect_url = $this->redirects[ $url ]['url'];
			if ( '/' === substr( $redirect_url, 0, 1 ) ) {
				$redirect_url = home_url( $redirect_url );
			}

			return $redirect_url;

		}

		/**
		 * Perform the redirect
		 *
		 * @param string $url
		 * @param string $redirect_url
		 */
		private function do_redirect( $url, $redirect_url ) {
			if ( 410 !== $this->redirects[ $url ]['type'] ) {
				wp_redirect( $redirect_url, $this->redirects[ $url ]['type'] );
				exit;
			}
			else {
				$this->do_410();
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
