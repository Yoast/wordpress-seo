<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Woocommerce_Helper_Test
 *
 * @group helpers
 * @group woocommerce
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Woocommerce_Helper
 */
final class Woocommerce_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Woocommerce_Helper
	 */
	protected $instance;

	/**
	 * Sets the instance.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Woocommerce_Helper();
	}

	/**
	 * Tests if WooCommerce is in active.
	 *
	 * @covers ::is_active
	 *
	 * @return void
	 */
	public function test_if_woocommerce_is_inactive() {
		$this->assertFalse( $this->instance->is_active() );
	}

	/**
	 * Tests if WooCommerce is active.
	 *
	 * @covers ::is_active
	 *
	 * @return void
	 */
	public function test_if_woocommerce_is_active() {
		Mockery::mock( 'overload:WooCommerce' );

		self::assertTrue( $this->instance->is_active() );
	}

	/**
	 * Tests the situation when WooCommerce isn't activated.
	 *
	 * @covers ::get_shop_page_id
	 *
	 * @return void
	 */
	public function test_get_shop_page_id_not_applicable() {
		$this->assertSame( -1, $this->instance->get_shop_page_id() );
	}

	/**
	 * Tests retrieval of the shop page id.
	 *
	 * @covers ::get_shop_page_id
	 *
	 * @return void
	 */
	public function test_get_shop_page_id() {
		Monkey\Functions\expect( 'wc_get_page_id' )
			->andReturn( 1 );

		$this->assertSame( 1, $this->instance->get_shop_page_id() );
	}

	/**
	 * Tests if current page is a shop page with the WooCommerce function not present.
	 *
	 * @covers ::is_shop_page
	 *
	 * @return void
	 */
	public function test_is_shop_page_function_not_existing() {
		$this->assertFalse( $this->instance->is_shop_page() );
	}

	/**
	 * Tests if current page isn't a shop page.
	 *
	 * @covers ::is_shop_page
	 *
	 * @return void
	 */
	public function test_is_shop_page_not_being_the_shop_page() {
		Monkey\Functions\expect( 'is_shop' )
			->andReturn( false );

		$this->assertFalse( $this->instance->is_shop_page() );
	}

	/**
	 * Tests if current page is a shop page and contain search results.
	 *
	 * @covers ::is_shop_page
	 *
	 * @return void
	 */
	public function test_is_shop_page_being_a_search_page() {
		Monkey\Functions\expect( 'is_shop' )
			->andReturn( true );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( true );

		$this->assertFalse( $this->instance->is_shop_page() );
	}

	/**
	 * Tests if current page is a shop page.
	 *
	 * @covers ::is_shop_page
	 *
	 * @return void
	 */
	public function test_is_shop_page() {
		Monkey\Functions\expect( 'is_shop' )
			->andReturn( true );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( false );

		$this->assertTrue( $this->instance->is_shop_page() );
	}
}
