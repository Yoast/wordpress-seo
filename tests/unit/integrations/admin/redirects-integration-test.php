<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Premium_Inactive_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Redirects_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Redirects_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Redirects_Integration
 *
 * @group integrations
 */
class Redirects_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Redirects_Integration|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Set up the fixtures for the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Redirects_Integration();
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
				Premium_Inactive_Conditional::class,
			],
			Redirects_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse( Monkey\Filters\has( 'wpseo_submenu_pages', [ $this->instance, 'add_submenu_page' ] ), 'Does not have expected wpseo_submenu_pages filter' );
	}

	/**
	 * Tests the addition of a submenu page.
	 *
	 * @covers ::add_submenu_page
	 */
	public function test_add_submenu_page() {
		Monkey\Functions\expect( '__' )
			->andReturnFirstArg();

		$submenu_pages = [
			[
				'wpseo_dashboard',
				'',
				'Redirects <span class="yoast-badge yoast-premium-badge"></span>',
				'wpseo_manage_options',
				'wpseo_redirects',
				[ $this->instance, 'display' ],
			],
		];

		$this->assertSame( $submenu_pages, $this->instance->add_submenu_page( [] ) );
	}
}
