<?php
/**
 * @package WPSEO\Tests\Frontend
 */

/**
 * Unit Test Class.
 */
class WPSEO_Frontend_Page_Type_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the situation where nothing has been done to manipulate the result.
	 *
	 * @covers WPSEO_Frontend_Page_Type::is_singular()
	 * @covers WPSEO_Frontend_Page_Type::get_singular_id()
	 */
	public function test_default_state() {
		$instance = new WPSEO_Frontend_Page_Type( new WPSEO_WooCommerce_Shop_Page() );
		$this->assertFalse( $instance->is_singular() );
		$this->assertEquals( 0, $instance->get_singular_id() );
	}

	/**
	 * Tests the situation where a single post will be visited.
	 *
	 * @covers WPSEO_Frontend_Page_Type::is_singular()
	 * @covers WPSEO_Frontend_Page_Type::get_singular_id()
	 */
	public function test_singular_page() {
		$post = $this->factory()->post->create_and_get();

		$this->go_to( get_permalink( $post ) );

		$instance = new WPSEO_Frontend_Page_Type( new WPSEO_WooCommerce_Shop_Page() );

		$this->go_to( get_permalink( $post ) );
		$this->assertTrue( $instance->is_singular() );
		$this->assertEquals(  $post->ID, $instance->get_singular_id() );
	}

	/**
	 * Tests the situation where a page that is set as home will be visited.
	 *
	 * @covers WPSEO_Frontend_Page_Type::is_singular()
	 * @covers WPSEO_Frontend_Page_Type::get_singular_id()
	 */
	public function test_page_as_home_page() {
		$current_page_for_posts = get_option( 'page_for_posts' );
		$current_show_on_front  = get_option( 'show_on_front' );

		$post = $this->factory()->post->create_and_get( [ 'post_type' => 'page' ] );

		update_option( 'show_on_front', 'page' );
		update_option( 'page_for_posts', $post->ID );

		$instance = new WPSEO_Frontend_Page_Type( new WPSEO_WooCommerce_Shop_Page() );

		$this->go_to( get_permalink( $post ) );
		$this->assertTrue( $instance->is_singular() );
		$this->assertEquals(  $post->ID, $instance->get_singular_id() );

		update_option( 'show_on_front', $current_show_on_front );
		update_option( 'page_for_posts', $current_page_for_posts );
	}


	/**
	 * Tests the situation where a WooCommerce shop page will be visited.
	 *
	 * @covers WPSEO_Frontend_Page_Type::is_singular()
	 * @covers WPSEO_Frontend_Page_Type::get_singular_id()
	 */
	public function test_woocommerce_shop_page(  ) {
		$woocommerce = $this
			->getMockBuilder( 'WPSEO_WooCommerce_Shop_Page' )
			->setMethods( array( 'is_shop_page', 'get_page_id' ) )
			->getMock();

		$woocommerce
			->expects( $this->any() )
			->method( 'is_shop_page' )
			->will( $this->returnValue( true ) );

		$woocommerce
			->expects( $this->once() )
			->method( 'get_page_id' )
			->will( $this->returnValue( 100 ) );

		$instance = new WPSEO_Frontend_Page_Type( $woocommerce );

		$this->assertTrue( $instance->is_singular() );
		$this->assertEquals(  100,  $instance->get_singular_id() );
	}





}