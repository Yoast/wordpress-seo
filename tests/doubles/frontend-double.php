<?php
/**
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Frontend_Double extends WPSEO_Frontend {

	/**
	 * Exposes the constructor to the public.
	 */
	public function __construct() {
		parent::__construct();
	}
	/**
	 * Get the singleton instance of this class
	 *
	 * This needs to be overrwritten to make sure it returns the Double version of this class.
	 *
	 * @return WPSEO_Frontend_Double
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Short-circuit redirecting.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   Status code to use.
	 */
	public function redirect( $location, $status = 302 ) {
		// Intentionally left empty to remove actual redirection code to be able to test it.
	}
}
