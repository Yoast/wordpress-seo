<?php
/**
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Canonical_Double extends WPSEO_Canonical {

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
	 * @return WPSEO_Canonical_Double
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}
