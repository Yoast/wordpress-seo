<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Frontend
 */

/**
 * Unit Test Class.
 */
class WPSEO_WooCommerce_Shop_Page_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the situation when WooCommerce isn't activated.
	 *
	 * @covers WPSEO_WooCommerce_Shop_Page::get_shop_page_id
	 */
	public function test_get_shop_page_id() {
		$woocommerce_shop_page = new WPSEO_WooCommerce_Shop_Page();

		$this->assertEquals( -1, $woocommerce_shop_page->get_shop_page_id() );
	}

	/**
	 * Tests the situation when WooCommerce isn't activated.
	 *
	 * @covers WPSEO_WooCommerce_Shop_Page::is_shop_page
	 */
	public function test_is_shop_page() {
		$woocommerce_shop_page = new WPSEO_WooCommerce_Shop_Page();

		$this->assertEquals( false, $woocommerce_shop_page->is_shop_page() );
	}
}
