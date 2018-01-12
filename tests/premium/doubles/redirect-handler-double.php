<?php
/**
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Class double for overriding the method visibility.
 */
class WPSEO_Redirect_Handler_Double extends WPSEO_Redirect_Handler {

	/**
	 * Check if request URL matches one of the regex redirects
	 *
	 * @param string $regex    The reqular expression to match.
	 * @param array  $redirect The URL that might be matched with the regex.
	 */
	public function match_regex_redirect( $regex, array $redirect ) {
		parent::match_regex_redirect( $regex, $redirect );
	}

	/**
	 * Check if we should load the PHP redirects.
	 *
	 * If Apache or NginX configuration is selected, don't load PHP redirects.
	 *
	 * @return bool True if PHP redirects should be loaded and used.
	 */
	public function load_php_redirects() {
		return parent::load_php_redirects();
	}

	/**
	 * Checks if the current URL matches a normal redirect.
	 *
	 * @param string $request_url The request url to look for.
	 *
	 * @returns void
	 */
	public function handle_normal_redirects( $request_url ) {
		parent::handle_normal_redirects( $request_url );
	}

	/**
	 * Checks if the current URL matches a regex.
	 *
	 * @return void
	 */
	public function handle_regex_redirects() {
		parent::handle_regex_redirects();
	}

	/**
	 * Sets the request URL and sanitize the slashes for it.
	 *
	 * @return void
	 */
	public function set_request_url() {
		parent::set_request_url();
	}

	/**
	 * Sets the url matches.
	 *
	 * @param array $matches The matches.
	 */
	public function set_url_matches( array $matches ) {
		$this->url_matches = $matches;
	}
}
