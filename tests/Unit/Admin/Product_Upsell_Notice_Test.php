<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use WPSEO_Product_Upsell_Notice;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit test class.
 *
 * @coversDefaultClass WPSEO_Product_Upsell_Notice
 */
final class Product_Upsell_Notice_Test extends TestCase {

	/**
	 * Test the dismiss_notice_listener function.
	 *
	 * @covers ::dismiss_notice_listener
	 *
	 * @return void
	 */
	public function test_dismiss_notice_listener() {
		$_GET['_wpnonce']      = 'test-nonce';
		$_GET['yoast_dismiss'] = 'upsell';
		Monkey\Functions\expect( 'wp_verify_nonce' )
			->with( 'test-nonce', 'dismiss-5star-upsell' )
			->andReturn( true );
		Monkey\Functions\expect( 'get_current_user_id' )
			->andReturn( 1 );
		Monkey\Functions\expect( 'update_user_meta' )
			->andReturn( '1' );
		Monkey\Functions\expect( 'get_option' )
			->andReturn( [] );
		Monkey\Functions\expect( 'wp_safe_redirect' )
			->andReturn( false );
		Monkey\Functions\expect( 'admin_url' )
			->andReturn( 'admin.php' );
		$instance = new WPSEO_Product_Upsell_Notice();
		$instance->dismiss_notice_listener();
	}

	/**
	 * Test the dismiss_notice_listener function when the nonce is null.
	 *
	 * @covers ::dismiss_notice_listener
	 *
	 * @return void
	 */
	public function test_dismiss_notice_listener_nonce_is_null() {
		$_GET['_wpnonce']      = null;
		$_GET['yoast_dismiss'] = 'upsell';
		Monkey\Functions\expect( 'wp_verify_nonce' )
			->never();
		$instance = new WPSEO_Product_Upsell_Notice();
		$instance->dismiss_notice_listener();
	}

	/**
	 * Test the dismiss_notice_listener function when the nonce is incorrect.
	 *
	 * @covers ::dismiss_notice_listener
	 *
	 * @return void
	 */
	public function test_dismiss_notice_listener_wrong_nonce() {
		$_GET['_wpnonce']      = 'wrong-nonce';
		$_GET['yoast_dismiss'] = 'upsell';
		Monkey\Functions\expect( 'wp_verify_nonce' )
			->with( 'wrong-nonce', 'dismiss-5star-upsell' )
			->andReturn( false );
		Monkey\Functions\expect( 'admin_url' )
			->never();
		$instance = new WPSEO_Product_Upsell_Notice();
		$instance->dismiss_notice_listener();
	}

	/**
	 * Test the dismiss_notice_listener function when the yoast_dismiss GET parameter is wrong.
	 *
	 * @covers ::dismiss_notice_listener
	 *
	 * @return void
	 */
	public function test_dismiss_notice_listener_no_dismiss_get_parameter() {
		$_GET['_wpnonce']      = 'test-nonce';
		$_GET['yoast_dismiss'] = 'wrong-parameter';
		Monkey\Functions\expect( 'wp_verify_nonce' )
			->with( 'test-nonce', 'dismiss-5star-upsell' )
			->andReturn( true );
		Monkey\Functions\expect( 'admin_url' )
			->never();
		$instance = new WPSEO_Product_Upsell_Notice();
		$instance->dismiss_notice_listener();
	}

	/**
	 * Test the dismiss_notice_listener function when the yoast_dismiss GET parameter is null.
	 *
	 * @covers ::dismiss_notice_listener
	 *
	 * @return void
	 */
	public function test_dismiss_notice_listener_dismiss_get_parameter_is_null() {
		$_GET['_wpnonce']      = 'test-nonce';
		$_GET['yoast_dismiss'] = null;
		Monkey\Functions\expect( 'wp_verify_nonce' )
			->with( 'test-nonce', 'dismiss-5star-upsell' )
			->andReturn( true );
		Monkey\Functions\expect( 'admin_url' )
			->never();
		$instance = new WPSEO_Product_Upsell_Notice();
		$instance->dismiss_notice_listener();
	}
}
