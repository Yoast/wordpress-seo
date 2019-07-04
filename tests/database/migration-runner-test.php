<?php

namespace Yoast\WP\Free\Tests\Config;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Config\Dependency_Management;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\Loggers\Migration_Logger;
use Yoast\WP\Free\Tests\Doubles\Migration_Runner;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Migration_Runner_Test.
 *
 * @group   db-migrations
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
	 * Tests the initializing with the defining of constants fails.
	 */
	public function test_initialize_with_set_defines_failing() {
		Monkey\Functions\expect( 'set_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY, Migration_Runner::MIGRATION_STATE_ERROR, \DAY_IN_SECONDS )
			->andReturn( true );

		$instance = $instance = $instance = $this->get_migration_runner_mock( [ 'set_defines' ] );

		$instance
			->expects( $this->once() )
			->method( 'set_defines' )
			->will( $this->returnValue( false ) );

		$this->assertFalse( $instance->run_migrations() );
	}

	/**
	 * Tests if the migrations are usable.
	 */
	public function test_is_usable() {
		$instance = $instance = $instance = $this->get_migration_runner_mock( [ 'get_migration_state' ] );

		$instance->expects( $this->once() )
			->method( 'get_migration_state' )
			->will( $this->returnValue( Migration_Runner::MIGRATION_STATE_SUCCESS ) );

		$this->assertTrue( $instance->is_usable() );
	}

	/**
	 * Tests if the migrations are usable.
	 */
	public function test_is_not_usable() {
		$instance = $instance = $instance = $this->get_migration_runner_mock( [ 'get_migration_state' ] );

		$instance->expects( $this->once() )
			->method( 'get_migration_state' )
			->will( $this->returnValue( Migration_Runner::MIGRATION_STATE_ERROR ) );

		$this->assertFalse( $instance->is_usable() );
	}

	/**
	 * Tests if the migrations are usable with transients.
	 */
	public function test_is_usable_with_transient() {
		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY, Migration_Runner::MIGRATION_STATE_SUCCESS )
			->andReturn( Migration_Runner::MIGRATION_STATE_SUCCESS );

		$instance = $instance = $instance = $this->get_migration_runner_mock( null );

		/**
		 * @var \Yoast\WP\Free\Config\Migration_Runner $instance
		 */
		$this->assertTrue( $instance->is_usable() );
	}

	/**
	 * Tests if the migrations are usable with transients.
	 */
	public function test_is_not_usable_with_transient() {
		$wpdb = $this->get_wpdb_mock();

		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY, Migration_Runner::MIGRATION_STATE_SUCCESS )
			->andReturn( Migration_Runner::MIGRATION_STATE_ERROR );

		$instance = $instance = $this->get_migration_runner_mock();

		/**
		 * @var \Yoast\WP\Free\Config\Migration_Runner $instance
		 */
		$this->assertFalse( $instance->is_usable() );
	}

	/**
	 * Tests the initializing when everything goes as planned.
	 */
	public function test_migration_success() {
		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( Migration_Runner::MIGRATION_ERROR_TRANSIENT_KEY )
			->andReturn( true );

		$instance = $instance = $this->get_migration_runner_mock( [
			'set_defines',
			'get_framework_runner',
		] );

		$instance
			->expects( $this->once() )
			->method( 'set_defines' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'get_framework_runner' )
			->will( $this->returnValue( $this->get_framework_runner_mock() ) );

		$this->assertTrue( $instance->run_migrations() );
	}

	/**
	 * Tests the initializing with an exception being thrown.
	 *
	 * @expectedException \Exception
	 *
	 * @covers \Yoast\WP\Free\Config\Migration_Runner::run_migrations()
	 */
	public function test_initialize_with_exception_thrown() {
		$instance = $instance = $this->get_migration_runner_mock( [
			'set_defines',
			'get_framework_runner',
			'set_failed_state',
		] );

		$instance
			->expects( $this->once() )
			->method( 'set_defines' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'get_framework_runner' )
			->will( $this->throwException( new \Exception() ) );

		$instance
			->expects( $this->once() )
			->method( 'set_failed_state' );

		$instance->run_migrations();
	}

	/**
	 * Tests the retrieval of the migration configuration.
	 *
	 * @covers \Yoast\WP\Free\Config\Migration_Runner::get_configuration()
	 */
	public function test_get_configuration() {
		$instance = $instance = $this->get_migration_runner_mock();;

		$this->assertInternalType( 'array', $instance->get_configuration() );
	}

	/**
	 * @covers \Yoast\WP\Free\Config\Migration_Runner::set_defines()
	 */
	public function test_set_define_success() {
		$wpdb = $this->get_wpdb_mock();

		$instance = $this
			->getMockBuilder( 'Yoast\WP\Free\Tests\Doubles\Migration_Runner' )
			->setConstructorArgs( array( $wpdb, new Dependency_Management() ) )
			->setMethods(
				array( 'set_define', 'get_defines' )
			)
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_defines' )
			->will( $this->returnValue( array( 'my_define' => 'define_value' ) ) );

		$instance
			->expects( $this->once() )
			->method( 'set_define' )
			->with( 'my_define', 'define_value' )
			->will( $this->returnValue( true ) );

		$this->assertTrue( $instance->set_defines( 'table_name' ) );
	}

	/**
	 * @covers \Yoast\WP\Free\Config\Migration_Runner::set_defines()
	 */
	public function test_set_define_failed() {
		$instance = $this->get_migration_runner_mock( [ 'set_define', 'get_defines' ] );

		$instance
			->expects( $this->once() )
			->method( 'get_defines' )
			->will( $this->returnValue( array( 'my_define' => 'define_value' ) ) );

		$instance
			->expects( $this->once() )
			->method( 'set_define' )
			->with( 'my_define', 'define_value' )
			->will( $this->returnValue( false ) );

		$this->assertFalse( $instance->set_defines( 'table_name' ) );
	}

	/**
	 * Tests if the defines are configured correctly when we are using prefixed dependencies.
	 *
	 * @covers \Yoast\WP\Free\Config\Migration_Runner::get_defines()
	 */
	public function test_get_defines() {
		$dependency_management = $this
			->getMockBuilder( '\Yoast\WP\Free\Config\Dependency_Management' )
			->setMethods( array( 'prefixed_available' ) )
			->getMock();

		$dependency_management
			->expects( $this->once() )
			->method( 'prefixed_available' )
			->will( $this->returnValue( true ) );

		$instance = $this->get_migration_runner_mock( null, $dependency_management );

		$defines = $instance->get_defines( 'table_name' );

		$this->assertArrayHasKey( \YOAST_VENDOR_NS_PREFIX . '\RUCKUSING_BASE', $defines );
		$this->assertArrayHasKey( \YOAST_VENDOR_NS_PREFIX . '\RUCKUSING_TS_SCHEMA_TBL_NAME', $defines );

		$this->assertContains( 'table_name', $defines );
	}

	/**
	 * Tests if the defines are configured correctly when we are not using prefixed dependencies.
	 *
	 * @covers \Yoast\WP\Free\Config\Migration_Runner::get_defines()
	 */
	public function test_get_defines_not_prefixed() {
		$dependency_management = $this
			->getMockBuilder( '\Yoast\WP\Free\Config\Dependency_Management' )
			->setMethods( [ 'prefixed_available' ] )
			->getMock();

		$dependency_management
			->expects( $this->once() )
			->method( 'prefixed_available' )
			->will( $this->returnValue( false ) );

		$instance = $this->get_migration_runner_mock( null, $dependency_management );

		$defines = $instance->get_defines( 'table_name' );

		$this->assertArrayHasKey( 'RUCKUSING_BASE', $defines );
		$this->assertArrayHasKey( 'RUCKUSING_TS_SCHEMA_TBL_NAME', $defines );

		$this->assertContains( 'table_name', $defines );
	}

	protected function get_migration_runner_mock( $methods = null, $dependency_management_mock = null ) {
		$wpdb             = $this->get_wpdb_mock();
		$logger           = new Logger();

		if ( ! $dependency_management_mock ) {
			$dependency_management_mock = new Dependency_Management();
		}

		return $this->getMockBuilder( 'Yoast\WP\Free\Tests\Doubles\Migration_Runner' )
					->setConstructorArgs( array( $wpdb, $logger, new Migration_Logger( $logger ), $dependency_management_mock ) )
					->setMethods( $methods )
					->getMock();
	}

	/**
	 * Retrieves a class to mock a FrameworkRunner.
	 *
	 * @return \FrameworkRunner
	 */
	protected function get_framework_runner_mock() {
		$mock = $this
			->getMockBuilder( 'FrameworkRunner' )
			->setMethods( [ 'execute', 'get_adapter' ] )
			->getMock();

		$adapter_mock = $this
			->getMockBuilder( 'Ruckusing_Adapter_MySQL_Base' )
			->disableOriginalConstructor()
			->setMethods( [ 'has_table', 'get_schema_version_table_name' ] )
			->getMock();

		$adapter_mock->method( 'get_schema_version_table_name' )->willReturn( 'yoast_migrations_table' );
		$adapter_mock->method( 'has_table' )->with( 'yoast_migrations_table' )->willReturn( true );

		$mock->method( 'get_adapter' )->willReturn( $adapter_mock );

		return $mock;
	}

	protected function get_wpdb_mock() {
		$wpdb = Mockery::mock( 'wpdb' );
		$wpdb->prefix  = 'test';
		$wpdb->charset = 'foo';

		return $wpdb;
	}
}
