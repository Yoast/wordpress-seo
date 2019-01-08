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
	 * Tests the situation when woocommerce isn't activated.
	 *
	 * @covers WPSEO_WooCommerce_Shop_Page::get_shop_page_id()
	 */
	public function test_get_shop_page_id() {
		$woocommerce_shop_page = new WPSEO_WooCommerce_Shop_Page();

		$this->assertEquals( -1, $woocommerce_shop_page->get_shop_page_id() );
	}

	/**
	 * Tests the situation when woocommerce isn't activated.
	 *
	 * @covers WPSEO_WooCommerce_Shop_Page::is_shop_page()
	 */
	public function test_is_shop_page() {
		$woocommerce_shop_page = new WPSEO_WooCommerce_Shop_Page();

		$this->assertEquals( false, $woocommerce_shop_page->is_shop_page() );
	}

	/**
	 * Tests the situation where the currently opened page isn't a shop page.
	 *
	 * @covers WPSEO_WooCommerce_Shop_Page::get_page_id()
	 */
	public function test_get_page_id_for_non_shop_page() {
		/** @var $woocommerce_shop_page WPSEO_WooCommerce_Shop_Page */
		$woocommerce_shop_page = $this
			->getMockBuilder( 'WPSEO_WooCommerce_Shop_Page_Double' )
			->setMethods( array( 'is_shop_page', 'get_shop_page_id' ) )
			->getMock();

		$woocommerce_shop_page
			->expects( $this->once() )
			->method( 'is_shop_page' )
			->will( $this->returnValue( false ) );

		$woocommerce_shop_page
			->expects( $this->never() )
			->method( 'get_shop_page_id' );

		$this->assertEquals( 100, $woocommerce_shop_page->get_page_id( 100 ) );
	}

	/**
	 * Tests the situation where the currently opened page isn't a shop page.
	 *
	 * @covers WPSEO_WooCommerce_Shop_Page::get_page_id()
	 */
	public function test_get_page_id_for_shop_page() {
		/** @var $woocommerce_shop_page WPSEO_WooCommerce_Shop_Page */
		$woocommerce_shop_page = $this
			->getMockBuilder( 'WPSEO_WooCommerce_Shop_Page_Double' )
			->setMethods( array( 'is_shop_page', 'get_shop_page_id' ) )
			->getMock();

		$woocommerce_shop_page
			->expects( $this->once() )
			->method( 'is_shop_page' )
			->will( $this->returnValue( true ) );

		$woocommerce_shop_page
			->expects( $this->once() )
			->method( 'get_shop_page_id' )
			->will( $this->returnValue( 150 ) );

		$this->assertEquals( 150, $woocommerce_shop_page->get_page_id( 100 ) );
	}

	/**
	 * Tests the situation where the currently opened page isn't a shop page.
	 *
	 * @covers WPSEO_WooCommerce_Shop_Page::get_page_id()
	 * @covers WPSEO_WooCommerce_Shop_Page::get_shop_page_id()
	 */
	public function test_get_page_id_for_shop_page_with_missing_get_page_id_function() {
		/** @var $woocommerce_shop_page WPSEO_WooCommerce_Shop_Page */
		$woocommerce_shop_page = $this
			->getMockBuilder( 'WPSEO_WooCommerce_Shop_Page_Double' )
			->setMethods( array( 'is_shop_page' ) )
			->getMock();

		$woocommerce_shop_page
			->expects( $this->once() )
			->method( 'is_shop_page' )
			->will( $this->returnValue( true ) );

		$this->assertEquals( -1, $woocommerce_shop_page->get_page_id( 100 ) );
	}
}
