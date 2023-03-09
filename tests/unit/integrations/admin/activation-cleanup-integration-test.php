<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Integrations\Admin\Activation_Cleanup_Integration;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;

/**
 * Class Admin_Columns_Cache_Integration_Test.
 *
 * @group integrations
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Activation_Cleanup_Integration
 */
class Activation_Cleanup_Integration_Test extends TestCase {

	/**
	 * Holds the activation indexation integration.
	 *
	 * @var \Yoast\WP\SEO\Integrations\Admin\Activation_Cleanup_Integration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Activation_Cleanup_Integration();
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
			[],
			Activation_Cleanup_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\has( 'wpseo_activate', [ $this->instance, 'register_cleanup_routine' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the registration of the cleanup routine when there is no cleanup routine running.
	 *
	 * @covers ::register_cleanup_routine
	 */
	public function test_register_cleanup_routine_no_running() {

		Monkey\Functions\expect( 'get_option' )
			->andReturnTrue();

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->andReturnFalse();

		Monkey\Functions\expect( 'wp_schedule_single_event' )
			->once()
			->with( ( time() + ( MINUTE_IN_SECONDS * 5 ) ), Cleanup_Integration::START_HOOK );


		$this->instance->register_cleanup_routine();
	}

	/**
	 * Tests that there is no registration of the cleanup routine if it is already running.
	 *
	 * @covers ::register_cleanup_routine
	 */
	public function test_register_cleanup_routine_already_running() {

		Monkey\Functions\expect( 'get_option' )
			->andReturnTrue();

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->with( Cleanup_Integration::START_HOOK )
			->andReturnTrue();

		Monkey\Functions\expect( 'wp_schedule_single_event' )
			->never();


		$this->instance->register_cleanup_routine();
	}
}
