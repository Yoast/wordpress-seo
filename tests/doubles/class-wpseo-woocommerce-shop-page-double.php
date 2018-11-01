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
	 * Resets static variables.
	 *
	 * @return void
	 */
	public function reset() {
		self::$shop_page_id = null;
		self::$is_shop_page = null;
	}

	/**
	 * "Simulate" that woocommerce is active.
	 *
	 * @return bool Always return true because it's "double" class.
	 */
	private function is_woo_activated() {
		return true;
	}
}
