<?php

namespace Yoast\WP\Free\Tests\Database;

use Brain\Monkey;
use Exception;
use Mockery;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Config\Dependency_Management;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\Database\Migration_Runner;
use Yoast\WP\Free\Tests\TestCase;
use YoastSEO_Vendor\Ruckusing_Adapter_MySQL_Base;
use YoastSEO_Vendor\Ruckusing_Adapter_MySQL_TableDefinition;
use YoastSEO_Vendor\Ruckusing_FrameworkRunner;

/**
 * Class Migration_Runner_Test.
 *
 * @group   db-migrations
 *
 * @coversDefaultClass \Yoast\WP\Free\Database\Migration_Runner
 * @covers ::<!public>
 *
 * @package Yoast\Tests
 */
class Migration_Runner_test extends TestCase {

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
	 * @covers ::initialize;
	 */
	public function test_initialize() {
		$instance = Mockery::mock( Migration_Runner::class )->makePartial();
		$instance->expects( 'run_migrations' )->once();

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
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY, Migration_Runner::MIGRATION_STATE_SUCCESS )
			->andReturn( Migration_Runner::MIGRATION_STATE_SUCCESS );

		$framework_mock = Mockery::mock( Ruckusing_FrameworkRunner::class );
		$logger_mock    = Mockery::mock( Logger::class );

		$instance = new Migration_Runner( $framework_mock, $logger_mock );

		$this->assertTrue( $instance->is_usable() );
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
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY, Migration_Runner::MIGRATION_STATE_SUCCESS )
			->andReturn( Migration_Runner::MIGRATION_STATE_ERROR );

		$framework_mock = Mockery::mock( Ruckusing_FrameworkRunner::class );
		$logger_mock    = Mockery::mock( Logger::class );

		$instance = new Migration_Runner( $framework_mock, $logger_mock );

		$this->assertFalse( $instance->is_usable() );
	}

	/**
	 * Tests the has_migration_error method.
	 *
	 * @covers ::has_migration_error
	 */
	public function test_has_migration_error() {
		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY, Migration_Runner::MIGRATION_STATE_SUCCESS )
			->andReturn( Migration_Runner::MIGRATION_STATE_ERROR );

		$framework_mock = Mockery::mock( Ruckusing_FrameworkRunner::class );
		$logger_mock    = Mockery::mock( Logger::class );

		$instance = new Migration_Runner( $framework_mock, $logger_mock );

		$this->assertTrue( $instance->has_migration_error() );
	}

	/**
	 * Tests the has_migration_error method.
	 *
	 * @covers ::has_migration_error
	 */
	public function test_has_no_migration_error() {
		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY, Migration_Runner::MIGRATION_STATE_SUCCESS )
			->andReturn( Migration_Runner::MIGRATION_STATE_SUCCESS );

		$framework_mock  = Mockery::mock( Ruckusing_FrameworkRunner::class );
		$logger_mock     = Mockery::mock( Logger::class );

		$instance = new Migration_Runner( $framework_mock, $logger_mock );

		$this->assertFalse( $instance->has_migration_error() );
	}

	/**
	 * Tests the initializing when everything goes as planned.
	 *
	 * @covers ::run_migrations
	 */
	public function test_migration_success() {
		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY )
			->andReturn( true );

		$framework_mock  = Mockery::mock( Ruckusing_FrameworkRunner::class );
		$logger_mock     = Mockery::mock( Logger::class );
		$adapter_mock    = Mockery::mock( Ruckusing_Adapter_MySQL_Base::class );

		$framework_mock->expects( 'get_adapter' )->once()->andReturn( $adapter_mock );
		$framework_mock->expects( 'execute' )->once()->andReturn( true );
		$adapter_mock->expects( 'get_schema_version_table_name' )->once()->andReturn( 'migrations_table' );
		$adapter_mock->expects( 'has_table' )->once()->with( 'migrations_table' )->andReturn( true );

		$instance = Mockery::mock( Migration_Runner::class, [ $framework_mock, $logger_mock ] )
						   ->makePartial()->shouldAllowMockingProtectedMethods();

		$this->assertTrue( $instance->run_migrations() );
	}

	/**
	 * Tests the initializing when everything goes as planned including creating migration tables.
	 *
	 * @covers ::run_migrations
	 */
	public function test_migration_success_with_migrations_table() {
		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY )
			->andReturn( true );

		$framework_mock = Mockery::mock( Ruckusing_FrameworkRunner::class );
		$logger_mock    = Mockery::mock( Logger::class );
		$adapter_mock   = Mockery::mock( Ruckusing_Adapter_MySQL_Base::class );
		$table_mock     = Mockery::mock( Ruckusing_Adapter_MySQL_TableDefinition::class );

		$framework_mock->expects( 'get_adapter' )->once()->andReturn( $adapter_mock );
		$framework_mock->expects( 'execute' )->once()->andReturn( true );
		$adapter_mock->expects( 'get_schema_version_table_name' )->once()->andReturn( 'migrations_table' );
		$adapter_mock->expects( 'has_table' )->once()->with( 'migrations_table' )->andReturn( false );
		$adapter_mock->expects( 'create_table' )->once()->with( 'migrations_table', [ 'id' => false ] )->andReturn( $table_mock );
		$adapter_mock->expects( 'add_index' )->once()->with( 'migrations_table', 'version', [ 'unique' => true ] );
		$table_mock->expects( 'column' )->once()->with( 'version', 'string', [ 'limit' => 191 ] );
		$table_mock->expects( 'finish' )->once();

		$instance = Mockery::mock( Migration_Runner::class, [ $framework_mock, $logger_mock ] )
						   ->makePartial()->shouldAllowMockingProtectedMethods();

		$this->assertTrue( $instance->run_migrations() );
	}

	/**
	 * Tests the initializing with an exception being thrown.
	 *
	 * @expectedException \Exception
	 *
	 * @covers ::run_migrations
	 */
	public function test_initialize_with_exception_thrown() {
		$framework_mock = Mockery::mock( Ruckusing_FrameworkRunner::class );
		$logger_mock    = Mockery::mock( Logger::class );
		$adapter_mock   = Mockery::mock( Ruckusing_Adapter_MySQL_Base::class );

		$framework_mock->expects( 'get_adapter' )->once()->andReturn( $adapter_mock );
		$framework_mock->expects( 'execute' )->once()->andThrow( new Exception() );
		$adapter_mock->expects( 'get_schema_version_table_name' )->once()->andReturn( 'migrations_table' );
		$adapter_mock->expects( 'has_table' )->once()->with( 'migrations_table' )->andReturn( true );

		$instance = Mockery::mock( Migration_Runner::class, [ $framework_mock, $logger_mock ] )
						   ->makePartial()->shouldAllowMockingProtectedMethods();

		$instance->run_migrations();
	}

	/**
	 * Returns a wpdb mock.
	 *
	 * @return wpdb The wpdb mock.
	 */
	protected function get_wpdb_mock() {
		$wpdb = Mockery::mock( 'wpdb' );
		$wpdb->prefix = 'test';

		return $wpdb;
	}
}
