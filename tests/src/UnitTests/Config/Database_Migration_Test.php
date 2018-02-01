<?php

namespace Yoast\Tests\UnitTests\Config;

use Yoast\Tests\Doubles\Database_Migration;
use Yoast\Tests\Doubles\Database_Migration as Database_Migration_Double;
use Yoast\YoastSEO\Config\Dependency_Management;

/**
 * Class Database_Migration_Test
 *
 * @group   yoastmeta
 *
 * @package Yoast\Tests
 */
class Database_Migration_Test extends \PHPUnit_Framework_TestCase {
	/**
	 * Tests the initializing with the wrong migration state.
	 */
	public function test_initialize() {
		$instance = $this
			->getMockBuilder( 'Yoast\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array(
				null,
				new Dependency_Management()
			) )
			->setMethods( array( 'get_migration_state', 'set_defines' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_migration_state' )
			->will( $this->returnValue( Database_Migration::MIGRATION_STATE_ERROR ) );

		$instance
			->expects( $this->never() )
			->method( 'set_defines' );

		$this->assertFalse( $instance->initialize() );
	}

	/**
	 * Tests the initializing with the defining of constants fails.
	 */
	public function test_initialize_with_set_defines_failing() {
		$instance = $this
			->getMockBuilder( 'Yoast\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array(
				null,
				new Dependency_Management()
			) )
			->setMethods( array( 'get_migration_state', 'set_defines' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_migration_state' )
			->will( $this->returnValue( Database_Migration::MIGRATION_STATE_SUCCESS ) );

		$instance
			->expects( $this->once() )
			->method( 'set_defines' )
			->will( $this->returnValue( false ) );

		$this->assertFalse( $instance->initialize() );
	}

	/**
	 * Tests the initializing when everything goes as planned.
	 */
	public function test_initialize_success() {
		$instance = $this
			->getMockBuilder( 'Yoast\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array(
				null,
				new Dependency_Management()
			) )
			->setMethods( array(
				'get_migration_state',
				'set_defines',
				'get_framework_runner'
			) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_migration_state' )
			->will( $this->returnValue( Database_Migration::MIGRATION_STATE_SUCCESS ) );

		$instance
			->expects( $this->once() )
			->method( 'set_defines' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'get_framework_runner' )
			->will( $this->returnValue( $this->get_framework_runner_mock() ) );

		$this->assertTrue( $instance->initialize() );
	}

	/**
	 * Tests the initializing with an exception being thrown.
	 *
	 * @covers \Yoast\YoastSEO\Config\Database_Migration::initialize()
	 */
	public function test_initialize_with_exception_thrown() {
		$instance = $this
			->getMockBuilder( 'Yoast\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array(
				null,
				new Dependency_Management()
			) )
			->setMethods(
				array(
					'get_migration_state',
					'set_defines',
					'get_framework_runner',
					'set_failed_state'
				)
			)
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_migration_state' )
			->will( $this->returnValue( Database_Migration::MIGRATION_STATE_SUCCESS ) );

		$instance
			->expects( $this->once() )
			->method( 'set_defines' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'get_framework_runner' )
			->will( $this->throwException( new \Exception ) );

		$instance
			->expects( $this->once() )
			->method( 'set_failed_state' );

		$this->assertFalse( $instance->initialize() );
	}

	/**
	 * Tests the retrieval of the charset.
	 *
	 * @covers \Yoast\YoastSEO\Config\Database_Migration::get_charset()
	 */
	public function test_get_charset() {
		$instance = new Database_Migration_Double(
			( object ) array( 'charset' => 'foo' ), new Dependency_Management()
		);

		$this->assertEquals( 'foo', $instance->get_charset() );
	}

	/**
	 * Tests the retrieval of the migration configuration.
	 *
	 * @covers \Yoast\YoastSEO\Config\Database_Migration::get_configuration()
	 */
	public function test_get_configuration() {
		$instance = new Database_Migration_Double(
			( object ) array( 'charset' => 'foo' ), new Dependency_Management()
		);

		$this->assertInternalType( 'array', $instance->get_configuration() );
	}

	/**
	 * @covers \Yoast\YoastSEO\Config\Database_Migration::set_defines()
	 */
	public function test_set_define_success() {
		$instance = $this
			->getMockBuilder( 'Yoast\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array(
				null,
				new Dependency_Management()
			) )
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
	 * @covers \Yoast\YoastSEO\Config\Database_Migration::set_defines()
	 */
	public function test_set_define_failed() {
		$instance = $this
			->getMockBuilder( 'Yoast\Tests\Doubles\Database_Migration' )
			->setConstructorArgs( array(
				null,
				new Dependency_Management()
			) )
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

		$this->assertFalse( $instance->set_defines( 'table_name' ) );
	}

	/**
	 * Tests if the defines are configured correctly when we are using prefixed dependencies.
	 *
	 * @covers \Yoast\YoastSEO\Config\Database_Migration::get_defines()
	 */
	public function test_get_defines() {
		$dependency_management = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Dependency_Management' )
			->setMethods( array( 'prefixed_available' ) )
			->getMock();

		$dependency_management
			->expects( $this->once() )
			->method( 'prefixed_available' )
			->will( $this->returnValue( true ) );

		$instance = new Database_Migration( null, $dependency_management );

		$defines = $instance->get_defines( 'table_name' );

		$this->assertArrayHasKey( YOAST_VENDOR_DEFINE_PREFIX . 'RUCKUSING_BASE', $defines );
		$this->assertArrayHasKey( YOAST_VENDOR_DEFINE_PREFIX . 'RUCKUSING_TS_SCHEMA_TBL_NAME', $defines );

		$this->assertContains( 'table_name', $defines );
	}

	/**
	 * Tests if the defines are configured correctly when we are not using prefixed dependencies.
	 *
	 * @covers \Yoast\YoastSEO\Config\Database_Migration::get_defines()
	 */
	public function test_get_defines_not_prefixed() {
		$dependency_management = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Dependency_Management' )
			->setMethods( array( 'prefixed_available' ) )
			->getMock();

		$dependency_management
			->expects( $this->once() )
			->method( 'prefixed_available' )
			->will( $this->returnValue( false ) );

		$instance = new Database_Migration( null, $dependency_management );

		$defines = $instance->get_defines( 'table_name' );

		$this->assertArrayHasKey( 'RUCKUSING_BASE', $defines );
		$this->assertArrayHasKey( 'RUCKUSING_TS_SCHEMA_TBL_NAME', $defines );

		$this->assertContains( 'table_name', $defines );
	}

	/**
	 * Retrieves a class to mock a FrameworkRunner
	 *
	 * @return FrameworkRunner
	 */
	protected function get_framework_runner_mock() {
		return $this
			->getMockBuilder( 'FrameworkRunner' )
			->setMethods( array( 'execute' ) )
			->getMock();
	}
}
