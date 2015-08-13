<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Handler
 */
class WPSEO_Redirect_Handler {

	/**
	 * @var string
	 */
	private $normal_option = 'wpseo-premium-redirects';

	/**
	 * @var string
	 */
	private $regex_option  = 'wpseo-premium-redirects-regex';

	/**
	 * @var string
	 */
	private $request_url = '';

	/**
	 * @var array
	 */
	private $redirects;

	/**
	 * @var array
	 */
	private $url_matches = array();

	/**
	 * Constructor
	 */
	public function __construct() {
		// Set the requested url.
		$this->request_url = htmlspecialchars_decode( urldecode( filter_input( INPUT_SERVER, 'REQUEST_URI' ) ) );

		// Check the normal redirects.
		$this->handle_normal_redirects();

		// Check the regex redirects.
		$this->handle_regex_redirects();
	}

	/**
	 * Replace the $regex vars with URL matches
	 *
	 * @param array $matches
	 *
	 * @return string
	 */
	public function format_regex_redirect_url( $matches ) {
		$arr_key = substr( $matches[0], 1 );

		if ( isset( $this->url_matches[ $arr_key ] ) ) {
			return $this->url_matches[ $arr_key ];
		}

		return '';
	}

	/**
	 * Checking if current url matches a normal redirect
	 */
	private function handle_normal_redirects() {
		// Setting the redirects.
		$this->redirects = $this->get_redirects( $this->normal_option );

		// Get the URL and doing the redirect.
		if ( $redirect_url = $this->find_url( $this->request_url ) ) {
			$this->do_redirect( $this->redirect_url( $redirect_url['url'] ), $redirect_url['type'] );
		}
	}

	/**
	 * Check if current url matches a regex redirect
	 */
	private function handle_regex_redirects() {
		// Setting the redirects.
		$this->redirects = $this->get_redirects( $this->regex_option );

		foreach ( $this->redirects as $regex => $redirect ) {
			// Check if the URL matches the $regex.
			$this->match_regex_redirect( $regex, $redirect );
		}
	}

	/**
	 * Check if request url matches one of the regex redirects
	 *
	 * @param string $regex
	 * @param array  $redirect
	 */
	private function match_regex_redirect( $regex, array $redirect ) {
		if ( 1 === preg_match( "`{$regex}`", $this->request_url, $this->url_matches ) ) {
			// Replace the $regex vars with URL matches.
			$redirect_url = preg_replace_callback( '/[\$0-9]+/', array(
				$this,
				'format_regex_redirect_url',
			), $redirect['url'] );

			$this->do_redirect( $this->redirect_url( $redirect_url ), $redirect['type'] );
		}

		// Reset url_matches.
		$this->url_matches = array();
	}

	/**
	 * Getting the redirects from the options
	 *
	 * @param string $option
	 *
	 * @return array
	 */
	private function get_redirects( $option ) {
		global $wpdb;

		// Getting the value.
		$wpdb->query( "SELECT option_value FROM {$wpdb->options} WHERE option_name = '{$option}'" );

		if ( $result = $wpdb->get_var() ) {
			return unserialize( $result );
		}

		return array();
	}

	/**
	 * Check if URL exists in the redirects.
	 *
	 * @param string $url
	 *
	 * @return bool|string
	 */
	private function find_url( $url ) {
		if ( $redirect_url = $this->search( $url ) ) {
			return $redirect_url;
		}

		return $this->find_url_fallback( $url );
	}

	/**
	 * @param string $url
	 *
	 * @return mixed
	 */
	private function search( $url ) {
		if ( isset( $this->redirects[ $url ] ) ) {
			return $this->redirects[ $url ];
		}
	}

	/**
	 * Fallback if requested url isn't found. This will add a slash if there isn't a slash or it will remove a
	 * trailing slash when there isn't one.
	 *
	 * @discuss: Maybe we should add slashes to all the values we handle instead of using a fallback
	 *
	 * @param string $url
	 *
	 * @return bool|string
	 */
	private function find_url_fallback( $url ) {
		// Check if last character is a slash, if so trim it.
		if ( substr( $url, -1 ) === '/' && $redirect_url = $this->search( rtrim( $url, '/' ) ) ) {
			return $redirect_url;
		}

		// There was no trailing slash, so add this to check.
		if ( $redirect_url = $this->search( $url . '/' ) ) {
			return $redirect_url;
		}

		return false;
	}

	/**
	 * Getting the redirect url by given $url
	 *
	 * @param string $redirect_url
	 *
	 * @return string mixed
	 */
	private function redirect_url( $redirect_url ) {
		if ( '/' === substr( $redirect_url, 0, 1 ) ) {
			$redirect_url = home_url( $redirect_url );
		}

		return $redirect_url;
	}

	/**
	 * Perform the redirect
	 *
	 * @param string $redirect_url
	 * @param string $redirect_type
	 */
	private function do_redirect( $redirect_url, $redirect_type ) {
		if ( 410 === $redirect_type ) {
			$this->do_410();
			return;
		}

		if ( ! function_exists( 'wp_redirect' ) ) {
			require_once( ABSPATH . 'wp-includes/pluggable.php' );
		}

		header( 'X-Redirect-By: Yoast SEO Premium' );
		wp_redirect( $redirect_url, $redirect_type );
		exit;
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
