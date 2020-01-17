<?php

namespace Yoast\WP\SEO\Tests\Database;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\SEO\Database\Ruckusing_Framework;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Database\Migration_Runner;
use Yoast\WP\SEO\ORM\Yoast_Model;
use Yoast\WP\SEO\Tests\TestCase;
use YoastSEO_Vendor\Ruckusing_Adapter_MySQL_Base;
use YoastSEO_Vendor\Ruckusing_Adapter_MySQL_TableDefinition;
use YoastSEO_Vendor\Ruckusing_FrameworkRunner;
use YoastSEO_Vendor\Ruckusing_Task_Manager;

/**
 * Class Migration_Runner_Test.
 *
 * @group   db-migrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Database\Migration_Runner
 * @covers ::<!public>
 *
 * @package Yoast\Tests
 */
class Migration_Runner_Test extends TestCase {

	/**
	 * Setup the tests.
	 */
	public function setUp() {
		parent::setUp();

		global $wpdb;
		$wpdb = $this->get_wpdb_mock();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Indexables_Feature_Flag_Conditional::class ],
			Migration_Runner::get_conditionals()
		);
	}

	/**
	 * Tests that initialize runs migrations.
	 *
	 * @covers ::initialize
	 */
	public function test_initialize() {
		$instance = Mockery::mock( Migration_Runner::class )->makePartial();
		$instance->expects( 'run_migrations' )->once()->with( 'free', Yoast_Model::get_table_name( 'migrations' ), \WPSEO_PATH . 'migrations' );

		$instance->initialize();
	}

	/**
	 * Tests if the migrations are usable with transients.
	 *
	 * @covers ::__construct
	 * @covers ::is_usable
	 */
	public function test_is_usable() {
		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY . 'test', Migration_Runner::MIGRATION_STATE_SUCCESS )
			->andReturn( Migration_Runner::MIGRATION_STATE_SUCCESS );

		$framework_mock = Mockery::mock( Ruckusing_Framework::class );
		$logger_mock    = Mockery::mock( Logger::class );

		$instance = new Migration_Runner( $framework_mock, $logger_mock );

		$this->assertTrue( $instance->is_usable( 'test' ) );
	}

	/**
	 * Tests if the migrations are usable with transients.
	 *
	 * @covers ::__construct
	 * @covers ::is_usable
	 */
	public function test_is_not_usable() {
		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY . 'test', Migration_Runner::MIGRATION_STATE_SUCCESS )
			->andReturn( Migration_Runner::MIGRATION_STATE_ERROR );

		$framework_mock = Mockery::mock( Ruckusing_Framework::class );
		$logger_mock    = Mockery::mock( Logger::class );

		$instance = new Migration_Runner( $framework_mock, $logger_mock );

		$this->assertFalse( $instance->is_usable( 'test' ) );
	}

	/**
	 * Tests the has_migration_error method.
	 *
	 * @covers ::has_migration_error
	 */
	public function test_has_migration_error() {
		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY . 'test', Migration_Runner::MIGRATION_STATE_SUCCESS )
			->andReturn( Migration_Runner::MIGRATION_STATE_ERROR );

		$framework_mock = Mockery::mock( Ruckusing_Framework::class );
		$logger_mock    = Mockery::mock( Logger::class );

		$instance = new Migration_Runner( $framework_mock, $logger_mock );

		$this->assertTrue( $instance->has_migration_error( 'test' ) );
	}

	/**
	 * Tests the has_migration_error method.
	 *
	 * @covers ::has_migration_error
	 */
	public function test_has_no_migration_error() {
		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY . 'test', Migration_Runner::MIGRATION_STATE_SUCCESS )
			->andReturn( Migration_Runner::MIGRATION_STATE_SUCCESS );

		$framework_mock = Mockery::mock( Ruckusing_Framework::class );
		$logger_mock    = Mockery::mock( Logger::class );

		$instance = new Migration_Runner( $framework_mock, $logger_mock );

		$this->assertFalse( $instance->has_migration_error( 'test' ) );
	}

	/**
	 * Tests the initializing when everything goes as planned.
	 *
	 * @covers ::run_migrations
	 */
	public function test_migration_success() {
		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY . 'test' )
			->andReturn( true );

		$framework_mock    = Mockery::mock( Ruckusing_Framework::class );
		$runner_mock       = Mockery::mock( Ruckusing_FrameworkRunner::class );
		$logger_mock       = Mockery::mock( Logger::class );
		$adapter_mock      = Mockery::mock( Ruckusing_Adapter_MySQL_Base::class );
		$task_manager_mock = Mockery::mock( Ruckusing_Task_Manager::class );

		$framework_mock->expects( 'get_framework_runner' )->once()->with( 'table', 'dir' )->andReturn( $runner_mock );
		$framework_mock->expects( 'get_framework_task_manager' )->once()->with( $adapter_mock, 'table', 'dir' )->andReturn( $task_manager_mock );
		$runner_mock->expects( 'get_adapter' )->once()->andReturn( $adapter_mock );
		$adapter_mock->expects( 'has_table' )->once()->with( 'table' )->andReturn( true );
		$task_manager_mock->expects( 'execute' )->once()->with( $runner_mock, 'db:migrate', [] );

		$instance = new Migration_Runner( $framework_mock, $logger_mock );

		$this->assertTrue( $instance->run_migrations( 'test', 'table', 'dir' ) );
	}

	/**
	 * Tests the initializing when everything goes as planned including creating migration tables.
	 *
	 * @covers ::run_migrations
	 */
	public function test_migration_success_with_migrations_table() {
		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY . 'test' )
			->andReturn( true );

		$framework_mock    = Mockery::mock( Ruckusing_Framework::class );
		$runner_mock       = Mockery::mock( Ruckusing_FrameworkRunner::class );
		$logger_mock       = Mockery::mock( Logger::class );
		$adapter_mock      = Mockery::mock( Ruckusing_Adapter_MySQL_Base::class );
		$table_mock        = Mockery::mock( Ruckusing_Adapter_MySQL_TableDefinition::class );
		$task_manager_mock = Mockery::mock( Ruckusing_Task_Manager::class );

		$framework_mock->expects( 'get_framework_runner' )->once()->with( 'table', 'dir' )->andReturn( $runner_mock );
		$framework_mock->expects( 'get_framework_task_manager' )->once()->with( $adapter_mock, 'table', 'dir' )->andReturn( $task_manager_mock );
		$runner_mock->expects( 'get_adapter' )->once()->andReturn( $adapter_mock );
		$adapter_mock->expects( 'has_table' )->once()->with( 'table' )->andReturn( false );
		$adapter_mock->expects( 'create_table' )->once()->with( 'table', [ 'id' => false ] )->andReturn( $table_mock );
		$adapter_mock->expects( 'add_index' )->once()->with( 'table', 'version', [ 'unique' => true ] );
		$table_mock->expects( 'column' )->once()->with( 'version', 'string', [ 'limit' => 191 ] );
		$table_mock->expects( 'finish' )->once();
		$task_manager_mock->expects( 'execute' )->once()->with( $runner_mock, 'db:migrate', [] );

		$instance = new Migration_Runner( $framework_mock, $logger_mock );

		$this->assertTrue( $instance->run_migrations( 'test', 'table', 'dir' ) );
	}

	/**
	 * Returns a wpdb mock.
	 *
	 * @return \wpdb The wpdb mock.
	 */
	protected function get_wpdb_mock() {
		$wpdb         = Mockery::mock( 'wpdb' );
		$wpdb->prefix = 'test';

		return $wpdb;
	}
}
