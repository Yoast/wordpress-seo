<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Crawl_Settings_Integration;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Cron_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Crawl_Settings_Integration
 *
 * @group integrations
 */
class Crawl_Settings_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Crawl_Settings_Integration
	 */
	protected $instance;

	/**
	 * The admin asset manager.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * Set up the fixtures for the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->product_helper = Mockery::mock( Product_Helper::class );
		$this->instance       = new Crawl_Settings_Integration( $this->product_helper );
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
			[
				Admin_Conditional::class,
			],
			Crawl_Settings_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\has( 'wpseo_settings_tabs_dashboard', [ $this->instance, 'add_crawl_settings_tab' ] );

		$this->product_helper
			->expects( 'is_premium' )
			->once()
			->andReturn( true );

		$this->product_helper
			->expects( 'get_premium_version' )
			->once()
			->andReturn( '18.6' );

		$this->instance->register_hooks();
	}
}
