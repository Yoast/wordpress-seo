<?php

class WPSEO_REGEX_Redirect_Manager extends WPSEO_Redirect_Manager {

	protected $option_redirects = 'wpseo-premium-redirects-regex';

	private $url_matches = array();

	/**
	 * Replace the $regex vars with URL matches
	 * 
	 * @param $matches
	 *
	 * @return string
	 */
	public function format_redirect_url( $matches ) {

		$arr_key = substr( $matches[0], 1 );

		if ( isset ( $this->url_matches[ $arr_key ] ) ) {
			return $this->url_matches[ $arr_key ];
		}

		return '';
	}

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

			$url = $_SERVER['REQUEST_URI'];

			foreach ( $redirects as $regex => $target_url ) {

				// Check if the URL matches the $regex
				if ( 1 === @preg_match( "`{$regex}`", $url, $this->url_matches ) ) {

					// Replace the $regex vars with URL matches
					$redirect_url = preg_replace_callback( "/[\$0-9]+/", array(
						$this,
						'format_redirect_url'
					), $target_url );

					// Do the redirect
					wp_redirect( $redirect_url, 301 );
					exit;

				}

				// Reset url_matches
				$this->url_matches = array();

			}

		}

	}

}