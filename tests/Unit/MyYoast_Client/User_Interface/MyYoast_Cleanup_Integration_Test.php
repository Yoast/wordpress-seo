<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\User_Interface;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client_Cleanup;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\MyYoast_Cleanup_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the MyYoast_Cleanup_Integration class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\User_Interface\MyYoast_Cleanup_Integration
 */
final class MyYoast_Cleanup_Integration_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var MyYoast_Cleanup_Integration
	 */
	private $instance;

	/**
	 * The cleanup service mock.
	 *
	 * @var MyYoast_Client_Cleanup|Mockery\MockInterface
	 */
	private $cleanup;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->cleanup  = Mockery::mock( MyYoast_Client_Cleanup::class );
		$this->instance = new MyYoast_Cleanup_Integration( $this->cleanup );
	}

	/**
	 * Tests that get_conditionals returns an empty array.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame( [], MyYoast_Cleanup_Integration::get_conditionals() );
	}

	/**
	 * Tests that register_hooks registers the uninstall hook.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Functions\expect( 'add_action' )
			->with( 'uninstall_' . \WPSEO_BASENAME, [ $this->instance, 'cleanup' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests that cleanup delegates to the cleanup service and clears all scheduled hooks.
	 *
	 * @covers ::cleanup
	 *
	 * @return void
	 */
	public function test_cleanup() {
		$this->cleanup->expects( 'execute' )->once();

		Functions\expect( 'wp_clear_scheduled_hook' )
			->with( 'wpseo_myyoast_key_rotation' )
			->once();

		$this->instance->cleanup();
	}
}
