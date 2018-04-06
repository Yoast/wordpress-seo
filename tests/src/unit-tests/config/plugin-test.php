<?php

namespace Yoast\Tests\UnitTests\Config;

use Yoast\Tests\Doubles\Plugin as Plugin_Double;
use Yoast\YoastSEO\Config\Database_Migration;
use Yoast\YoastSEO\Config\Dependency_Management;
use Yoast\YoastSEO\WordPress\Integration_Group;

/**
 * Class Plugin_Test
 *
 * @group namespaced
 *
 * @package Yoast\Tests\Config
 */
class Plugin_Test extends \PHPUnit_Framework_TestCase {
	/**
	 * Tests if the class is based upon the Integration interface
	 */
	public function test_class_instance() {
		$this->assertInstanceOf( '\Yoast\YoastSEO\WordPress\Integration', new Plugin_Double() );
	}

	/**
	 * Tests adding an integration
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::add_integration()
	 */
	public function test_add_integration() {
		$instance = new Plugin_Double( $this->get_dependecy_management_mock(), $this->get_database_migration_mock() );

		$integration = $this
			->getMockBuilder( '\Yoast\YoastSEO\WordPress\Integration' )
			->getMock();

		$instance->add_integration( $integration );

		$this->assertContains( $integration, $instance->get_integrations() );
	}

	/**
	 * Tests for default dependeny management class
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::__construct()
	 */
	public function test_default_dependency_management() {
		$instance = new Plugin_Double( null, $this->get_database_migration_mock() );

		$this->assertInstanceOf( '\Yoast\YoastSEO\Config\Dependency_Management', $instance->get_dependency_management() );
	}

	/**
	 * Tests for default database migration class
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::__construct()
	 */
	public function test_default_database_migration() {
		$instance = new Plugin_Double( null, null );

		$this->assertInstanceOf( '\Yoast\YoastSEO\Config\Database_Migration', $instance->get_database_migration() );
	}

	/**
	 * Tests if the initialize calls the expected methods
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::initialize()
	 */
	public function test_initialize() {
		$dependency_management = $this->get_dependecy_management_mock();
		$dependency_management
			->expects( $this->once() )
			->method( 'initialize' )
			->will( $this->returnValue( true ) );

		$database_migration = $this->get_database_migration_mock();

		$database_migration
			->expects( $this->exactly( 1 ) )
			->method( 'is_usable' )
			->will( $this->returnValue( false ) );

		$database_migration
			->expects( $this->once() )
			->method( 'run_migrations' );

		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Plugin' )
			->setMethods( array( 'configure_orm' ) )
			->setConstructorArgs( array( $dependency_management, $database_migration ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'configure_orm' );

		$instance->initialize();
	}

	/**
	 * Tests early return if dependency management could not complete
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::initialize()
	 */
	public function test_initialize_dependency_management_not_initialized() {
		$dependency_management = $this->get_dependecy_management_mock();
		$dependency_management
			->expects( $this->once() )
			->method( 'initialize' )
			->will( $this->returnValue( false ) );

		$database_migration = $this->get_database_migration_mock();

		$database_migration
			->expects( $this->never() )
			->method( 'run_migrations' );

		$database_migration
			->expects( $this->never() )
			->method( 'is_usable' );

		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Plugin' )
			->setMethods( array( 'configure_orm' ) )
			->setConstructorArgs( array( $dependency_management, $database_migration ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'configure_orm' );

		$instance->initialize();
	}

	/**
	 * Tests if initialize failed if migration failed
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::initialize()
	 */
	public function test_initialize_db_migration_not_initialized() {
		$dependency_management = $this->get_dependecy_management_mock();
		$dependency_management
			->expects( $this->once() )
			->method( 'initialize' )
			->will( $this->returnValue( true ) );

		$database_migration = $this->get_database_migration_mock();
		$database_migration
			->expects( $this->once() )
			->method( 'has_migration_error' )
			->will( $this->returnValue( true ) );

		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Plugin' )
			->setMethods( array( 'configure_orm' ) )
			->setConstructorArgs( array( $dependency_management, $database_migration ) )
			->getMock();

		$instance->initialize();

		$this->assertAttributeEquals( false, 'initialize_success', $instance );
	}

	/**
	 * Tests if the expected methods are called during register hooks
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::register_hooks()
	 * @covers \Yoast\YoastSEO\Config\Plugin::trigger_integration_hook()
	 */
	public function test_register_hooks() {
		$instance = $this
			->getMockBuilder( 'Yoast\Tests\Doubles\Plugin' )
			->setMethods( array(
				'is_admin',
				'is_frontend',
				'add_admin_integrations',
				'add_frontend_integrations',
				'get_integration_group'
			) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'is_admin' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'is_frontend' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'add_admin_integrations' );

		$instance
			->expects( $this->once() )
			->method( 'add_frontend_integrations' );

		$integration_group = $this->get_integration_group_mock();
		$integration_group
			->expects( $this->once() )
			->method( 'register_hooks' );

		$instance
			->expects( $this->once() )
			->method( 'get_integration_group' )
			->will( $this->returnValue( $integration_group ) );

		$instance->set_initialize_success( true );

		$instance->register_hooks();
	}

	/**
	 * Tests if the action is called during register hooks
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::register_hooks()
	 * @covers \Yoast\YoastSEO\Config\Plugin::trigger_integration_hook()
	 */
	public function test_register_hooks_action_is_called() {
		$instance = new Plugin_Double();
		$instance->set_initialize_success( true );

		$action_count = did_action( 'wpseo_load_integrations' );

		$instance->register_hooks();

		$this->assertEquals( $action_count + 1, did_action( 'wpseo_load_integrations' ) );
	}

	/**
	 * Tests if get integration group is not called on failed initialize
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::register_hooks()
	 */
	public function test_register_hooks_not_initialzed() {
		$instance = $this
			->getMockBuilder( 'Yoast\Tests\Doubles\Plugin' )
			->setMethods( array( 'get_integration_group' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'get_integration_group' );

		$instance->set_initialize_success( false );

		$instance->register_hooks();
	}

	/**
	 * Tests if frontend integration returns a Frontend object
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::add_frontend_integrations()
	 */
	public function test_add_frontend_integrations() {
		$instance = $this
			->getMockBuilder( 'Yoast\Tests\Doubles\Plugin' )
			->setMethods( array(
				'add_integration'
			) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'add_integration' )
			->with( $this->isInstanceOf( '\Yoast\YoastSEO\Config\Frontend' ) );

		$instance->add_frontend_integrations();
	}

	/**
	 * Tests if add admin integrations returns an Admin object
	 *
	 * @covers \Yoast\YoastSEO\Config\Plugin::add_admin_integrations()
	 */
	public function test_add_admin_integrations() {
		$instance = $this
			->getMockBuilder( 'Yoast\Tests\Doubles\Plugin' )
			->setMethods( array(
				'add_integration'
			) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'add_integration' )
			->with( $this->isInstanceOf( '\Yoast\YoastSEO\Config\Admin' ) );

		$instance->add_admin_integrations();
	}

	/**
	 * Tests the return type of the integration group
	 */
	public function test_get_integration_group() {
		$instance = new Plugin_Double();
		$this->assertInstanceOf( '\Yoast\YoastSEO\WordPress\Integration_Group', $instance->get_integration_group() );
	}

	/**
	 * Tests if frontend is not the same as admin
	 */
	public function test_is_frontend() {
		$instance = new Plugin_Double();

		$this->assertNotEquals( $instance->is_frontend(), $instance->is_admin() );
	}

	/**
	 * Mocks a Dependency Management
	 *
	 * @return Dependency_Management
	 */
	protected function get_dependecy_management_mock() {
		return $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Dependency_Management' )
			->setMethods( array( 'initialize' ) )
			->getMock();
	}

	/**
	 * Mocks a Database Migration
	 *
	 * @return Database_Migration
	 */
	protected function get_database_migration_mock() {
		return $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Database_Migration' )
			->setMethods( array( 'run_migrations', 'is_usable', 'has_migration_error' ) )
			->setConstructorArgs( array( null, $this->get_dependecy_management_mock() ) )
			->getMock();
	}

	/**
	 * Mocks an Integration Group
	 *
	 * @param array $integrations List of integrations to load.
	 *
	 * @return Integration_Group
	 */
	protected function get_integration_group_mock( array $integrations = array() ) {
		return $this
			->getMockBuilder( '\Yoast\YoastSEO\WordPress\Integration_Group' )
			->setMethods( array( 'register_hooks' ) )
			->setConstructorArgs( array( $integrations ) )
			->getMock();
	}
}
