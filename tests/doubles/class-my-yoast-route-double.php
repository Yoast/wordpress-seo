<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_MyYoast_Route_Double extends WPSEO_MyYoast_Route {

	/**
	 * Checks if the current page is the MyYoast route.
	 *
	 * @param string $route The myyoast route.
	 *
	 * @return bool True when url is the myyoast route.
	 */
	public function is_myyoast_route( $route ) {
		return parent::is_myyoast_route( $route );
	}

	/**
	 * Compares an action to a list of allowed actions to see if it is valid.
	 *
	 * @param string $action The action to check.
	 *
	 * @return bool True if the action is valid.
	 */
	public function is_valid_action( $action ) {
		return parent::is_valid_action( $action );
	}

	/**
	 * Connects to MyYoast and generates a new clientId.
	 *
	 * @return void
	 */
	public function connect() {
		parent::connect();
	}

	/**
	 * Redirects the user to the oAuth authorization page.
	 *
	 * @return void
	 */
	public function authorize() {
		parent::authorize();
	}

	/**
	 * Completes the oAuth connection flow.
	 *
	 * @return void
	 */
	public function complete() {
		parent::complete();
	}
}
