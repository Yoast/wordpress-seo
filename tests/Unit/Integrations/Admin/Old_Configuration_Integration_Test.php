<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Old_Configuration_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Old_Configuration_Integration
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Old_Configuration_Integration
 *
 * @group integrations
 */
final class Old_Configuration_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Old_Configuration_Integration|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Set up the fixtures for the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Old_Configuration_Integration();
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Admin_Conditional::class,
			],
			Old_Configuration_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse(
			Monkey\Filters\has(
				'admin_menu',
				[
					$this->instance,
					'add_submenu_page',
				]
			),
			'Does not have expected admin_menu filter'
		);
		$this->assertNotFalse(
			Monkey\Actions\has(
				'admin_init',
				[
					$this->instance,
					'redirect_to_new_configuration',
				]
			),
			'Does not have expected admin_init action'
		);
	}

	/**
	 * Tests the addition of a submenu page.
	 *
	 * @covers ::add_submenu_page
	 *
	 * @return void
	 */
	public function test_add_submenu_page() {
		Monkey\Functions\expect( '__' )
			->andReturnFirstArg();

		Monkey\Functions\expect( 'add_submenu_page' )
			->with(
				'',
				'Old Configuration Wizard',
				'',
				'manage_options',
				'wpseo_configurator',
				[
					$this->instance,
					'render_page',
				]
			);

		$submenu_pages = [
			'array',
			'that',
			'should',
			'remain',
			'untouched',
		];

		$this->assertSame( $submenu_pages, $this->instance->add_submenu_page( $submenu_pages ) );
	}
}
