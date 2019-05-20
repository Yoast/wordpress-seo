<?php

namespace Yoast\WP\Free\Tests\Config;

use Yoast\WP\Free\Tests\Doubles\Database_Migration;
use Yoast\WP\Free\Config\Dependency_Management;

use Brain\Monkey;

/**
 * Class Database_Migration_Test.
 *
 * @group   db-migrations
 *
 * @package Yoast\Tests
 */
class Database_Migration_Test extends \Yoast\WP\Free\Tests\TestCase {

	public function setUp() {
		parent::setUp();

		global $wpdb;
		$wpdb         = $this->createMock( '\stdClass' );
		$wpdb->prefix = 'test';
	}

	/**
	 * Tests the initializing with the defining of constants fails.
	 */
	public function test_initialize_with_set_defines_failing() {
		$config = $this->get_config();
		$transient_key = $this->get_transient_key( $config['table_name'] );
		Monkey\Functions\expect( 'set_transient' )
			->once()
			->with( $transient_key, Database_Migration::MIGRATION_STATE_ERROR, DAY_IN_SECONDS )
			->andReturn( true );

		$instance = $this
			->getMockBuilder( 'Yoast\WP\Free\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array( null, new Dependency_Management(), $config ) )
			->setMethods( array( 'set_defines' ) )
			->getMock();

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
		$instance = $this
			->getMockBuilder( 'Yoast\WP\Free\Tests\Doubles\Database_Migration' )
			->disableOriginalConstructor()
			->setMethods( array( 'get_migration_state' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_migration_state' )
			->will( $this->returnValue( Database_Migration::MIGRATION_STATE_SUCCESS ) );

		$this->assertTrue( $instance->is_usable() );
	}

	/**
	 * Tests if the migrations are usable.
	 */
	public function test_is_not_usable() {
		$instance = $this
			->getMockBuilder( 'Yoast\WP\Free\Tests\Doubles\Database_Migration' )
			->disableOriginalConstructor()
			->setMethods( array( 'get_migration_state' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_migration_state' )
			->will( $this->returnValue( Database_Migration::MIGRATION_STATE_ERROR ) );

		$this->assertFalse( $instance->is_usable() );
	}

	/**
	 * Tests if the migrations are usable with transients.
	 */
	public function test_is_usable_with_transient() {
		$config = $this->get_config();
		$transient_key = $this->get_transient_key( $config['table_name'] );
		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( $transient_key, Database_Migration::MIGRATION_STATE_SUCCESS )
			->andReturn( Database_Migration::MIGRATION_STATE_SUCCESS );

		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Config\Database_Migration' )
			->setConstructorArgs( array( null, new Dependency_Management(), $config ) )
			->setMethods( null )
			->getMock();

		/**
		 * @var \Yoast\WP\Free\Config\Database_Migration $instance
		 */
		$this->assertTrue( $instance->is_usable() );
	}

	/**
	 * Tests if the migrations are usable with transients.
	 */
	public function test_is_not_usable_with_transient() {
		$config = $this->get_config();
		$transient_key = $this->get_transient_key( $config['table_name'] );
		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( $transient_key, Database_Migration::MIGRATION_STATE_SUCCESS )
			->andReturn( Database_Migration::MIGRATION_STATE_ERROR );

		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Config\Database_Migration' )
			->setConstructorArgs( array( null, new Dependency_Management(), $config ) )
			->setMethods( null )
			->getMock();

		/**
		 * @var \Yoast\WP\Free\Config\Database_Migration $instance
		 */
		$this->assertFalse( $instance->is_usable() );
	}

	/**
	 * Tests the initializing when everything goes as planned.
	 */
	public function test_migration_success() {
		$config = $this->get_config();
		$transient_key = $this->get_transient_key( $config['table_name'] );
		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( $transient_key )
			->andReturn( true );

		$instance = $this
			->getMockBuilder( 'Yoast\WP\Free\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array( null, new Dependency_Management(), $config ) )
			->setMethods(
				array(
					'set_defines',
					'get_framework_runner',
				)
			)
			->getMock();

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
	 * @covers \Yoast\WP\Free\Config\Database_Migration::run_migrations()
	 */
	public function test_initialize_with_exception_thrown() {
		$instance = $this
			->getMockBuilder( 'Yoast\WP\Free\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array( null, new Dependency_Management(), $this->get_config() ) )
			->setMethods(
				array(
					'set_defines',
					'get_framework_runner',
					'set_failed_state',
				)
			)
			->getMock();

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

		$this->assertFalse( $instance->run_migrations() );
	}

	/**
	 * Tests the retrieval of the charset.
	 *
	 * @covers \Yoast\WP\Free\Config\Database_Migration::get_charset()
	 */
	public function test_get_charset() {
		$instance = new Database_Migration_Double(
			(object) array( 'charset' => 'foo' ),
			new Dependency_Management(),
			$this->get_config()
		);

		$this->assertEquals( 'foo', $instance->get_charset() );
	}

	/**
	 * Tests the retrieval of the migration configuration.
	 *
	 * @covers \Yoast\WP\Free\Config\Database_Migration::get_configuration()
	 */
	public function test_get_configuration() {
		$instance = new Database_Migration_Double(
			(object) array( 'charset' => 'foo' ),
			new Dependency_Management(),
			$this->get_config()
		);

		$this->assertInternalType( 'array', $instance->get_configuration() );
	}

	/**
	 * @covers \Yoast\WP\Free\Config\Database_Migration::set_defines()
	 */
	public function test_set_define_success() {
		$instance = $this
			->getMockBuilder( 'Yoast\WP\Free\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array( null, new Dependency_Management(), $this->get_config() ) )
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

		$this->assertTrue( $instance->set_defines() );
	}

	/**
	 * @covers \Yoast\WP\Free\Config\Database_Migration::set_defines()
	 */
	public function test_set_define_failed() {
		$instance = $this
			->getMockBuilder( 'Yoast\WP\Free\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array( null, new Dependency_Management(), $this->get_config() ) )
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
			->will( $this->returnValue( false ) );

		$this->assertFalse( $instance->set_defines() );
	}

	/**
	 * Tests if the defines are configured correctly when we are using prefixed dependencies.
	 *
	 * @covers \Yoast\WP\Free\Config\Database_Migration::get_defines()
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

		$instance = new Database_Migration( null, $dependency_management, $this->get_config() );

		$defines = $instance->get_defines();

		$this->assertArrayHasKey( YOAST_VENDOR_NS_PREFIX . '\RUCKUSING_BASE', $defines );
	}

	/**
	 * Tests if the defines are configured correctly when we are not using prefixed dependencies.
	 *
	 * @covers \Yoast\WP\Free\Config\Database_Migration::get_defines()
	 */
	public function test_get_defines_not_prefixed() {
		$dependency_management = $this
			->getMockBuilder( '\Yoast\WP\Free\Config\Dependency_Management' )
			->setMethods( array( 'prefixed_available' ) )
			->getMock();

		$dependency_management
			->expects( $this->once() )
			->method( 'prefixed_available' )
			->will( $this->returnValue( false ) );

		$instance = new Database_Migration( null, $dependency_management, $this->get_config() );

		$defines = $instance->get_defines();

		$this->assertArrayHasKey( 'RUCKUSING_BASE', $defines );
	}

	/**
	 * Retrieves a class to mock a FrameworkRunner.
	 *
	 * @return FrameworkRunner
	 */
	protected function get_framework_runner_mock() {
		return $this
			->getMockBuilder( 'FrameworkRunner' )
			->setMethods( array( 'execute' ) )
			->getMock();
	}

	/**
	 * Returns the transient key that is used to store the migration status for a given feature.
	 *
	 * @param string $feature_name The name of the feature for which the migration status should be stored.
	 *
	 * @return string The transient key.
	 */
	protected function get_transient_key( $feature_name ) {
		return Database_Migration::MIGRATION_ERROR_TRANSIENT_KEY . $feature_name;
	}

	/**
	 * Creates and returns a new mock database migration configuration.
	 *
	 * @return array
	 */
	protected function get_config() {
		return array(
			'directory'  => 'test/migrations',
			'table_name' => 'test_name'
		);
	}
}
