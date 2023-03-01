<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Crawl_Settings_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Crawl_Settings_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Premium\Integrations\Admin\Crawl_Settings_Integration
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
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The shortlinker.
	 *
	 * @var Mockery\MockInterface|WPSEO_Shortlinker
	 */
	private $shortlinker;

	/**
	 * Set up the fixtures for the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->shortlinker    = Mockery::mock( WPSEO_Shortlinker::class );
		$this->instance       = new Crawl_Settings_Integration( $this->options_helper, $this->shortlinker );
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
		Monkey\Functions\stubTranslationFunctions();

		Monkey\Actions\has( 'wpseo_settings_tab_crawl_cleanup_internal', [ $this->instance, 'add_crawl_settings_tab_content' ] );
		Monkey\Actions\has( 'wpseo_settings_tab_crawl_cleanup_network', [ $this->instance, 'add_crawl_settings_tab_content_network' ] );
		Monkey\Actions\has( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_assets' ] );

		$this->instance->register_hooks();
	}
}
