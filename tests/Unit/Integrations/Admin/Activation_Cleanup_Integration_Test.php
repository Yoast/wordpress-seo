<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Activation_Cleanup_Integration;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Admin_Columns_Cache_Integration_Test.
 *
 * @group integrations
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Activation_Cleanup_Integration
 */
final class Activation_Cleanup_Integration_Test extends TestCase {

	/**
	 * Represents the indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the activation indexation integration.
	 *
	 * @var Activation_Cleanup_Integration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper   = Mockery::mock( Options_Helper::class );
		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );
		$this->instance         = new Activation_Cleanup_Integration( $this->options_helper, $this->indexable_helper );
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
			[],
			Activation_Cleanup_Integration::get_conditionals()
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
		Monkey\Actions\has( 'wpseo_activate', [ $this->instance, 'register_cleanup_routine' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the registration of the cleanup routine when there is no cleanup routine running.
	 *
	 * @covers ::register_cleanup_routine
	 *
	 * @return void
	 */
	public function test_register_cleanup_routine_no_running() {
		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->andReturnFalse();

		Monkey\Functions\expect( 'wp_schedule_single_event' )
			->once()
			->with( ( \time() + \DAY_IN_SECONDS ), Cleanup_Integration::START_HOOK );

		$this->indexable_helper->expects( 'should_index_indexables' )
			->once()
			->andReturnTrue();

		$this->options_helper->expects( 'get' )
			->once()
			->with( 'first_activated_on', false )
			->andReturn( ( \time() - ( \HOUR_IN_SECONDS * 5 ) ) );

		$this->instance->register_cleanup_routine();
	}

	/**
	 * Tests that there is no registration of the cleanup routine if it is already running.
	 *
	 * @covers ::register_cleanup_routine
	 *
	 * @return void
	 */
	public function test_register_cleanup_routine_already_running() {
		$this->indexable_helper->expects( 'should_index_indexables' )
			->once()
			->andReturnTrue();

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->with( Cleanup_Integration::START_HOOK )
			->andReturnTrue();

		Monkey\Functions\expect( 'wp_schedule_single_event' )
			->never();

		$this->options_helper->expects( 'get' )
			->once()
			->with( 'first_activated_on', false )
			->andReturn( ( \time() - ( \HOUR_IN_SECONDS * 5 ) ) );

		$this->instance->register_cleanup_routine();
	}

	/**
	 * Tests that there is no registration of the cleanup routine if it is the first time the plugin is installed.
	 * This is measured by checking if the first_activated_on is less than 5minutes ago.
	 *
	 * @covers ::register_cleanup_routine
	 *
	 * @return void
	 */
	public function test_register_cleanup_routine_first_time_install() {
		$this->indexable_helper->expects( 'should_index_indexables' )
			->once()
			->andReturnTrue();

		$this->options_helper->expects( 'get' )
			->once()
			->with( 'first_activated_on', false )
			->andReturn( \time() );

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->never()
			->with( Cleanup_Integration::START_HOOK )
			->andReturnTrue();

		Monkey\Functions\expect( 'wp_schedule_single_event' )
			->never();

		$this->instance->register_cleanup_routine();
	}

	/**
	 * Tests that the cleanup routine is not scheduled when indexables are disabled.
	 *
	 * @covers ::register_cleanup_routine
	 *
	 * @return void
	 */
	public function test_register_cleanup_routine_indexables_disabled() {
		$this->indexable_helper->expects( 'should_index_indexables' )
			->once()
			->andReturnFalse();

		$this->options_helper->expects( 'get' )
			->never();

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->never()
			->with( Cleanup_Integration::START_HOOK )
			->andReturnTrue();

		Monkey\Functions\expect( 'wp_schedule_single_event' )
			->never();

		$this->instance->register_cleanup_routine();
	}
}
