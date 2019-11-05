<?php
/**
 * WPSEO plugin test file.
 *
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
	 * Get the singleton instance of this class.
	 *
	 * This needs to be overwritten to make sure it returns the Double version of this class.
	 *
	 * @return WPSEO_Frontend_Double
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

}
