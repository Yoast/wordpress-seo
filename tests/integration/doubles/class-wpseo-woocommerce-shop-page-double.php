<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_WooCommerce_Shop_Page_Double extends WPSEO_WooCommerce_Shop_Page {

	/**
	 * "Simulate" that woocommerce is active.
	 *
	 * @return bool Always return true because it's "double" class.
	 */
	private function is_woocommerce_active() {
		return true;
	}
}
