<?php
/**
 * @package WPSEO\Tests\Frontend
 */

/**
 * Unit Test Class.
 */
class WPSEO_Frontend_WooCommerce_Shop_Page_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests for original title on non-shop page.
	 *
	 * @covers WPSEO_Frontend_WooCommerce_Shop_Page::apply_shop_page_title()
	 */
	public function test_apply_shop_page_title_not_applied() {
		/** @var WPSEO_Frontend_WooCommerce_Shop_Page $instance */
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_WooCommerce_Shop_Page' )
						 ->setConstructorArgs( array( WPSEO_Frontend::get_instance() ) )
						 ->setMethods( array( 'is_wc_shop_page' ) )
						 ->getMock();

		$instance->expects( $this->once() )
				 ->method( 'is_wc_shop_page' )
				 ->will( $this->returnValue( false ) );

		$this->assertEquals( 'Not modified', $instance->apply_shop_page_title( 'Not modified' ) );
	}

	/**
	 * Tests for shop page title on shop page.
	 *
	 * @covers WPSEO_Frontend_WooCommerce_Shop_Page::apply_shop_page_title()
	 */
	public function test_apply_shop_page_title_applied() {
		$shop_page_id = $this->factory->post->create(
			array(
				'post_type' => 'page',
			)
		);

		// Set SEO Metadata on the page.
		WPSEO_Meta::set_value( 'title', 'SEO Title', $shop_page_id );

		/** @var WPSEO_Frontend_WooCommerce_Shop_Page $instance */
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_WooCommerce_Shop_Page' )
						 ->setConstructorArgs( array( WPSEO_Frontend::get_instance() ) )
						 ->setMethods( array( 'is_wc_shop_page', 'get_shop_page_id' ) )
						 ->getMock();

		$instance->expects( $this->once() )
				 ->method( 'is_wc_shop_page' )
				 ->will( $this->returnValue( true ) );

		$instance->expects( $this->once() )
				 ->method( 'get_shop_page_id' )
				 ->will( $this->returnValue( $shop_page_id ) );

		$this->assertEquals( 'SEO Title', $instance->apply_shop_page_title( 'Original Title' ) );
	}

	/**
	 * Tests for original meta description for non-shop pages.
	 *
	 * @covers WPSEO_Frontend_WooCommerce_Shop_Page::apply_shop_page_metadesc()
	 */
	public function test_apply_shop_page_metadesc_not_applied() {
		/** @var WPSEO_Frontend_WooCommerce_Shop_Page $instance */
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_WooCommerce_Shop_Page' )
						 ->setConstructorArgs( array( WPSEO_Frontend::get_instance() ) )
						 ->setMethods( array( 'is_wc_shop_page' ) )
						 ->getMock();

		$instance->expects( $this->once() )
				 ->method( 'is_wc_shop_page' )
				 ->will( $this->returnValue( false ) );

		$description = 'Not modified';

		$this->assertEquals( $description, $instance->apply_shop_page_metadesc( $description ) );
	}

	/**
	 * Tests for applied Meta Description on the shop page.
	 *
	 * @covers WPSEO_Frontend_WooCommerce_Shop_Page::apply_shop_page_metadesc()
	 */
	public function test_apply_shop_page_metadesc_applied() {
		$shop_page_id = $this->factory->post->create(
			array(
				'post_type' => 'page',
			)
		);

		/** @var WPSEO_Frontend_WooCommerce_Shop_Page $instance */
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_WooCommerce_Shop_Page' )
						 ->setConstructorArgs( array( WPSEO_Frontend::get_instance() ) )
						 ->setMethods( array( 'is_wc_shop_page', 'get_shop_page_id' ) )
						 ->getMock();

		$instance->expects( $this->once() )
				 ->method( 'is_wc_shop_page' )
				 ->will( $this->returnValue( true ) );

		$instance->expects( $this->once() )
				 ->method( 'get_shop_page_id' )
				 ->will( $this->returnValue( $shop_page_id ) );

		// Set SEO Metadata on the page.
		WPSEO_Meta::set_value( 'metadesc', 'SEO Description', $shop_page_id );

		$this->assertEquals( 'SEO Description', $instance->apply_shop_page_metadesc( 'Original description' ) );
	}

	/**
	 * Tests for fallback method on the post type description.
	 *
	 * @covers WPSEO_Frontend_WooCommerce_Shop_Page::apply_shop_page_metadesc()
	 */
	public function test_apply_shop_page_metadesc_post_type_fallback() {
		$frontend                           = WPSEO_Frontend::get_instance();
		$frontend->options['metadesc-page'] = 'Post type metadescription';

		$shop_page_id = $this->factory->post->create(
			array(
				'post_type' => 'page',
			)
		);

		/** @var WPSEO_Frontend_WooCommerce_Shop_Page $instance */
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_WooCommerce_Shop_Page' )
						 ->setConstructorArgs( array( WPSEO_Frontend::get_instance() ) )
						 ->setMethods( array( 'is_wc_shop_page', 'get_shop_page_id' ) )
						 ->getMock();

		$instance->expects( $this->once() )
				 ->method( 'is_wc_shop_page' )
				 ->will( $this->returnValue( true ) );

		$instance->expects( $this->once() )
				 ->method( 'get_shop_page_id' )
				 ->will( $this->returnValue( $shop_page_id ) );

		// Set the global post to allow post type to be fetched.
		$GLOBALS['post'] = get_post( $shop_page_id );

		// Set SEO Metadata on the page to empty, to make sure the post type version is used.
		WPSEO_Meta::set_value( 'metadesc', '', $shop_page_id );

		$this->assertEquals( 'Post type metadescription', $instance->apply_shop_page_metadesc( 'Original description' ) );
	}
}
