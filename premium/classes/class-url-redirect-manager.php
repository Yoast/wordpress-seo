<?php
/**
 * @package WPSEO\Premium\Classes
 */

if ( class_exists( 'WPSEO_Redirect_Manager' ) && ! class_exists( 'WPSEO_URL_Redirect_Manager', false ) ) {

	/**
	 * Class WPSEO_URL_Redirect_Manager
	 */
	class WPSEO_URL_Redirect_Manager extends WPSEO_Redirect_Manager {

		/**
		 * @var array
		 */
		protected $redirects;

		/**
		 * @var string
		 */
		protected $option_redirects = 'wpseo-premium-redirects';

		/**
		 * Do the PHP redirect
		 */
		public function do_redirects() {

			// Check if PHP redirects are enabled.
			if ( false == $this->is_php_redirects_enabled() ) {
				return;
			}

			// Load redirects.
			$this->redirects = $this->get_redirects();

			// Do the actual redirect.
			if ( count( $this->redirects ) > 0 ) {
				$this->check_if_redirect();
			}

		}

		/**
		 * Check if redirect should be done
		 */
		private function check_if_redirect() {
			// Decode the URL.
			$url = htmlspecialchars_decode( urldecode( $_SERVER['REQUEST_URI'] ) );

			// Get the URL and doing the redirect.
			if ( $redirect_url = $this->find_url( $url ) ) {
				$this->do_redirect( $url, $redirect_url );
			}
		}

		/**
		 * Check if URL exists in the redirects.
		 *
		 * @param string $url
		 *
		 * @return bool|string
		 */
		private function find_url( $url ) {
			if ( isset ( $this->redirects[ $url ] ) ) {
				return $this->redirect_url( $url );
			}

			return $this->find_url_fallback( $url );
		}

		/**
		 * Fallback if requested url isn't found. This will add a slash if there isn't a slash or it will remove a
		 * trailing slash when there isn't one.
		 *
		 * @param string $url
		 *
		 * @return bool|string
		 */
		private function find_url_fallback( $url ) {

			// Check if last character is a slash, if so trim it.
			if ( substr( $url, -1 ) === '/' ) {
				$trimmed_url = rtrim( $url, '/' );
				if ( isset ( $this->redirects[ $trimmed_url ] ) ) {
					return $this->redirect_url( $trimmed_url );
				}
			}
			else {
				// There was no trailing slash, so add this to check.
				$slashed_url = $url . '/';
				if ( isset ( $this->redirects[ $slashed_url ] ) ) {
					return $this->redirect_url( $slashed_url );
				}
			}

			return false;

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
				header( 'X-Redirect-By: Yoast SEO Premium' );
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
			header( 'HTTP/1.1 410 Gone' );
			global $wp_query;
			$wp_query->is_404 = true;
		}
	}

}
