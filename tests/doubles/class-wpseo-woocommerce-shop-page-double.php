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

	private function is_woo_activated() {
		return true;
	}
}
