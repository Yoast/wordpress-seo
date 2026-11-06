<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Removable_Query_Args_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Removable_Query_Args_Integration_Test.
 *
 * @group integrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Removable_Query_Args_Integration
 */
final class Removable_Query_Args_Integration_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Removable_Query_Args_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Removable_Query_Args_Integration();
	}

	/**
	 * Tests if the expected conditionals are given.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Admin_Conditional::class ], Removable_Query_Args_Integration::get_conditionals() );
	}

	/**
	 * Tests that all seven Yoast transient query args are returned.
	 *
	 * @covers ::get_removable_query_args
	 *
	 * @return void
	 */
	public function test_get_removable_query_args() {
		$this->assertEquals(
			[
				'redirected_from_site_kit',
				'wpseo_tracked_action',
				'wpseo_tracking_nonce',
				'start-myyoast-connection',
				'_wpnonce',
				'install',
				'from_tools',
			],
			Removable_Query_Args_Integration::get_removable_query_args(),
		);
	}

	/**
	 * Tests that register_hooks registers the removable_query_args filter.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'removable_query_args' )
			->with( [ $this->instance, 'add_removable_query_args' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that the filter callback merges the Yoast args into the existing list.
	 *
	 * @covers ::add_removable_query_args
	 *
	 * @return void
	 */
	public function test_add_removable_query_args() {
		$existing = [ 'existing_arg' ];
		$result   = Removable_Query_Args_Integration::add_removable_query_args( $existing );

		$this->assertContains( 'existing_arg', $result );
		$this->assertContains( 'redirected_from_site_kit', $result );
		$this->assertContains( 'from_tools', $result );
	}
}
