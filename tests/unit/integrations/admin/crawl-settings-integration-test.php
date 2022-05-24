<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Crawl_Settings_Integration;
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
	 * Set up the fixtures for the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Crawl_Settings_Integration();
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

		$this->instance->register_hooks();
	}
}
