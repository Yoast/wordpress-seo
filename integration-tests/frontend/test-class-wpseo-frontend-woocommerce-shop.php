<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group frontend
 */
final class WPSEO_Frontend_WooCommerce_Shop_Test extends WPSEO_UnitTestCase {

	/**
	 * Creates a mock for the WooCommerce Shop Page.
	 *
	 * @param object $post Object that resembles a WP_Post.
	 *
	 * @return WPSEO_WooCommerce_Shop_page
	 */
	protected function get_woocommerce_shop_page_mock( $post ) {
		$woocommerce_shop_page = $this->getMockBuilder( 'WPSEO_WooCommerce_Shop_Page_Double' )
			->setMethods( array( 'is_shop_page', 'get_shop_page_id' ) )
			->getMock();

		$woocommerce_shop_page->expects( $this->once() )
			->method( 'get_shop_page_id' )
			->will( $this->returnValue( $post->ID ) );

		$woocommerce_shop_page->expects( $this->once() )
			->method( 'is_shop_page' )
			->will( $this->returnValue( true ) );

		return $woocommerce_shop_page;
	}
}
