<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Yoast\WP\SEO\Integrations\Uninstall_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Primary_Category_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Uninstall_Integration
 *
 * @group integrations
 */
class Uninstall_Integration_Test extends TestCase {

	/**
	 * The class under test.
	 *
	 * @var Uninstall_Integration
	 */
	protected $instance;

	/**
	 * Runs the setup to prepare the needed instance
	 */
	public function set_up() {
		$this->instance = new Uninstall_Integration();
	}

	/**
	 * Test register hooks function.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		// Arrange.
		Monkey\Functions\expect( 'add_action' )
			->once()
			->with( 'uninstall_' . WPSEO_BASENAME, [ $this->instance, 'wpseo_uninstall' ] );

		// Act.
		$this->instance->register_hooks();

		// Assert.
	}

	/**
	 * Tests the wpseo_uninstall function happy path
	 *
	 * @covers ::wpseo_uninstall
	 * @covers ::clear_import_statuses
	 */
	public function test_wpseo_uninstall() {
		// Arrange.
		Monkey\Functions\expect( 'get_site_option' )
			->once()
			->with( 'wpseo' )
			->andReturn( [ 'importing_completed' => [ 'dummy value' ] ] );

		Monkey\Functions\expect( 'update_site_option' )
			->once()
			->with( 'wpseo', [ 'importing_completed' => [] ] );

		// Act.
		$this->instance->wpseo_uninstall();

		// Assert.
	}

	/**
	 * Tests the wpseo_uninstall function unhappy path
	 *
	 * @covers ::wpseo_uninstall
	 * @covers ::clear_import_statuses
	 */
	public function test_wpseo_uninstall_not_found() {
		// Arrange.
		Monkey\Functions\expect( 'get_site_option' )
			->once()
			->with( 'wpseo' )
			->andReturn( [ 'these are not the droids you are looking for' => [ 'dummy value' ] ] );

		Monkey\Functions\expect( 'update_site_option' )
			->never();

		// Act.
		$this->instance->wpseo_uninstall();

		// Assert.
	}
}
