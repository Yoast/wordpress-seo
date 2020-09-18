<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Product_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Product_Helper
 *
 * @group helpers
 */
class Product_Helper_Test extends TestCase {

	/**
	 * @var Mockery\Mock|Product_Helper
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Product_Helper::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Retrieves the name when premium is 'active'.
	 *
	 * @covers ::get_name
	 */
	public function test_get_name_premium() {
		$this->instance
			->expects( 'is_premium' )
			->once()
			->andReturnTrue();

		$this->assertEquals( 'Yoast SEO Premium plugin', $this->instance->get_name() );
	}

	/**
	 * Retrieves the name when premium is not 'active'.
	 *
	 * @covers ::get_name
	 */
	public function test_get_name_not_premium() {
		$this->instance
			->expects( 'is_premium' )
			->once()
			->andReturnFalse();

		$this->assertEquals( 'Yoast SEO plugin', $this->instance->get_name() );
	}

	/**
	 * When current page is not in the list of Yoast SEO Free, is_yoast_seo_free_page() should return false.
	 *
	 * @covers ::is_free_page
	 */
	public function test_current_page_not_in_yoast_seo_free_pages() {
		$current_page = '';

		$this->assertFalse( $this->instance->is_free_page( $current_page ) );
	}

	/**
	 * When current page is not in the list of Yoast SEO Free, but is a page of one of the plugin' addons,
	 * the function should return false.
	 *
	 * @covers ::is_free_page
	 */
	public function test_current_page_not_in_yoast_seo_free_pages_but_is_yoast_seo_addon_page() {
		$current_page = 'wpseo_news';

		$this->assertFalse( $this->instance->is_free_page( $current_page ) );
	}

	/**
	 * When the current page belongs to Yoast SEO Free, the function is_yoast_seo_free_page() should return true.
	 *
	 * @covers ::is_free_page
	 */
	public function test_current_page_in_yoast_seo_free_pages() {
		$current_page = 'wpseo_dashboard';

		$this->assertTrue( $this->instance->is_free_page( $current_page ) );
	}

}
