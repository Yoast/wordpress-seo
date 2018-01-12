<?php
/**
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Class double for overriding the method visibility.
 */
class WPSEO_Redirect_Handler_Double extends WPSEO_Redirect_Handler {

	/**
	 * Sets the url matches.
	 *
	 * @param array $matches The matches.
	 */
	public function set_url_matches( array $matches ) {
		$this->url_matches = $matches;
	}

	/**
	 * Sets the redirects.
	 *
	 * @param array $redirects The redirects to set.
	 *
	 * @return void
	 */
	public function set_redirects( $redirects ) {
		$this->redirects = $redirects;
	}

	/**
	 * @inheritdoc
	 */
	public function match_regex_redirect( $regex, array $redirect ) {
		parent::match_regex_redirect( $regex, $redirect );
	}

	/**
	 * @inheritdoc
	 */
	public function load_php_redirects() {
		return parent::load_php_redirects();
	}

	/**
	 * @inheritdoc
	 */
	public function handle_normal_redirects( $request_url ) {
		parent::handle_normal_redirects( $request_url );
	}

	/**
	 * @inheritdoc
	 */
	public function handle_regex_redirects() {
		parent::handle_regex_redirects();
	}

	/**
	 * @inheritdoc
	 */
	public function set_request_url() {
		parent::set_request_url();
	}

	/**
	 * @inheritdoc
	 */
	public function get_redirects( $option ) {
		return parent::get_redirects( $option );
	}

	/**
	 * @inheritdoc
	 */
	public function parse_target_url( $target_url ) {
		return parent::parse_target_url( $target_url );
	}

	/**
	 * @inheritdoc
	 */
	public function do_redirect( $redirect_url, $redirect_type ) {
		parent::do_redirect( $redirect_url, $redirect_type );
	}

	/**
	 * @inheritdoc
	 */
	public function normalize_redirects( $redirects ) {
		return parent::normalize_redirects( $redirects );
	}

	/**
	 * @inheritdoc
	 */
	public function find_url( $url ) {
		return parent::find_url( $url );

	}
}
