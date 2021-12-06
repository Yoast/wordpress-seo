<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Installation_Success_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Installation_Success_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Installation_Success_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Installation_Success_Integration
 *
 * @group integrations
 */
class Installation_Success_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Installation_Success_Integration
	 */
	protected $instance;

	/**
	 * Options Helper class mock.
	 *
	 * @var Options_Helper|Mockery\Mock
	 */
	protected $options_helper;

	/**
	 * Set up the fixtures for the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Installation_Success_Integration( $this->options_helper );
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
				Installation_Success_Conditional::class,
			],
			Installation_Success_Integration::get_conditionals()
		);
	}

	/**
	 * Tests if the required dependencies are set right.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		static::assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse( Monkey\Filters\has( 'admin_menu', [ $this->instance, 'add_submenu_page' ] ), 'Does not have expected admin_menu filter' );
		$this->assertNotFalse( Monkey\Actions\has( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_assets' ] ), 'Does not have expected admin_enqueue_scripts action' );
		$this->assertNotFalse( Monkey\Actions\has( 'admin_init', [ $this->instance, 'maybe_redirect' ] ), 'Does not have expected admin_init action' );
	}

	/**
	 * Tests that the redirection does not occur when it's already happened.
	 *
	 * @covers ::maybe_redirect
	 */
	public function test_maybe_redirect_prevented() {
		$this->options_helper
			->expects( 'get' )
			->with( 'should_redirect_after_install_free', false )
			->andReturnFalse();

		Monkey\Functions\expect( 'wp_safe_redirect' )
			->never();

		$this->instance->maybe_redirect();
	}

	/**
	 * Tests the addition of a submenu page.
	 *
	 * @covers ::add_submenu_page
	 */
	public function test_add_submenu_page() {
		Monkey\Functions\expect( '__' )
			->andReturnFirstArg();

		Monkey\Functions\expect( 'add_submenu_page' );

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
