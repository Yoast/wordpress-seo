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
		$woocommerce_shop_page = $this->getMockBuilder( 'WPSEO_WooCommerce_Shop_Page' )
			->setMethods( array( 'is_shop_page', 'get_shop_page_id' ) )
			->getMock();

		$woocommerce_shop_page->expects( $this->any() )
			->method( 'get_shop_page_id' )
			->will( $this->returnValue( $post->ID ) );

		$woocommerce_shop_page->expects( $this->once() )
			->method( 'is_shop_page' )
			->will( $this->returnValue( true ) );

		return $woocommerce_shop_page;
	}

	/**
	 * Tests if the is_shop_page conditional is being respected.
	 *
	 * @covers WPSEO_Frontend::generate_title()
	 */
	public function test_get_shop_page_title() {
		$post = self::factory()->post->create_and_get();

		$woocommerce_shop_page = $this->get_woocommerce_shop_page_mock( $post );

		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_seo_title' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_seo_title' )
			->with( $post )
			->will( $this->returnValue( 'post title' ) );

		$instance->set_woocommerce_shop_page( $woocommerce_shop_page );

		$this->assertEquals( 'post title', $instance->title( 'original title' ) );
	}

	/**
	 * Tests if the post type archive fallback is being used.
	 *
	 * @covers WPSEO_Frontend::generate_title()
	 */
	public function test_get_shop_page_title_post_archive_title_fallback() {
		$post = self::factory()->post->create_and_get();

		$woocommerce_shop_page = $this->get_woocommerce_shop_page_mock( $post );

		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_seo_title', 'get_post_type_archive_title' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_seo_title' )
			->with( $post )
			->will( $this->returnValue( '' ) );

		$instance->expects( $this->once() )
			->method( 'get_post_type_archive_title' )
			->will( $this->returnValue( 'post type archive title' ) );

		$instance->set_woocommerce_shop_page( $woocommerce_shop_page );

		$this->assertEquals( 'post type archive title', $instance->title( 'original title' ) );
	}

	/**
	 * Tests if the metadescription is being used on the shop page.
	 *
	 * @covers WPSEO_Frontend::generate_metadesc()
	 */
	public function test_get_shop_page_meta_description() {
		$post = self::factory()->post->create_and_get();

		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_seo_meta_value', 'get_queried_post_type', 'replace_vars' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_queried_post_type' )
			->will( $this->returnValue( 'product' ) );

		$instance->expects( $this->once() )
			->method( 'get_seo_meta_value' )
			->with( 'metadesc', $post->ID )
			->will( $this->returnValue( 'override' ) );

		$instance->expects( $this->once() )
			->method( 'replace_vars' )
			->with( 'override', $post )
			->will( $this->returnValue( 'replaced' ) );

		$instance->options['metadesc-ptarchive-product'] = 'product metadescription';

		$woocommerce_shop_page = $this->get_woocommerce_shop_page_mock( $post );

		$instance->set_woocommerce_shop_page( $woocommerce_shop_page );

		$this->assertEquals( 'replaced', $instance->metadesc( false ) );
	}

	/**
	 * Tests expected behaviour for an empty post type archive template.
	 *
	 * @covers WPSEO_Frontend::generate_metadesc()
	 */
	public function test_get_shop_page_meta_description_empty_template() {
		$post = self::factory()->post->create_and_get();

		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_seo_meta_value', 'get_queried_post_type', 'replace_vars' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_queried_post_type' )
			->will( $this->returnValue( 'product' ) );

		$instance->expects( $this->once() )
			->method( 'replace_vars' )
			->with( '', $post )
			->will( $this->returnValue( 'replaced' ) );

		WPSEO_Options::set( 'metadesc-ptarchive-product', null );

		$woocommerce_shop_page = $this->get_woocommerce_shop_page_mock( $post );
		$instance->set_woocommerce_shop_page( $woocommerce_shop_page );

		$this->assertEquals( 'replaced', $instance->metadesc( false ) );
	}

	/**
	 * Tests expected behaviour for an undetermined post type.
	 *
	 * @covers WPSEO_Frontend::generate_metadesc()
	 */
	public function test_get_shop_page_meta_description_empty_post_type() {
		$post = self::factory()->post->create_and_get();

		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_seo_meta_value', 'get_queried_post_type', 'replace_vars' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_queried_post_type' )
			->will( $this->returnValue( '' ) );

		$instance->expects( $this->once() )
			->method( 'replace_vars' )
			->with( '', $post )
			->will( $this->returnValue( 'replaced' ) );

		$instance->options['metadesc-ptarchive-product'] = 'product metadescription';

		$woocommerce_shop_page = $this->get_woocommerce_shop_page_mock( $post );
		$instance->set_woocommerce_shop_page( $woocommerce_shop_page );

		$this->assertEquals( 'replaced', $instance->metadesc( false ) );
	}
}
