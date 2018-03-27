<?php

namespace Yoast\Tests\UnitTests\Config;

use Yoast\YoastSEO\Config\Dependency_Management;

/**
 * Class Dependency_Management_Test
 *
 * @group dependency-management
 *
 * @package Yoast\Tests
 */
class Dependency_Management_Test extends \PHPUnit_Framework_TestCase {
	/**
	 * Tests if the alias is created with ideal conditions
	 *
	 * @covers \Yoast\YoastSEO\Config\Dependency_Management::ensure_class_alias()
	 */
	public function test_ensure_class_alias() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Dependency_Management' )
			->setMethods( array( 'prefixed_available', 'class_exists', 'class_alias' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'class_exists' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->once() )
			->method( 'prefixed_available' )
			->will( $this->returnValue( false ) );

		$instance
			->expects( $this->once() )
			->method( 'class_alias' )
			->with( 'My_Class', YOAST_VENDOR_NS_PREFIX . '\My_Class' )
			->will( $this->returnValue( true ) );

		/** @var Dependency_Management $instance */
		$instance->ensure_class_alias( YOAST_VENDOR_NS_PREFIX . '\My_Class' );
	}

	/**
	 * Tests if no alias is created for unrelated class
	 *
	 * @covers \Yoast\YoastSEO\Config\Dependency_Management::ensure_class_alias()
	 */
	public function test_ensure_class_alias_unrelated_class() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Dependency_Management' )
			->setMethods( array( 'prefixed_available', 'class_exists', 'class_alias' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'class_exists' );

		$instance
			->expects( $this->never() )
			->method( 'class_alias' );

		$instance
			->expects( $this->never() )
			->method( 'prefixed_available' );

		/** @var Dependency_Management $instance */
		$instance->ensure_class_alias( 'Unrelated_Class' );
	}

	/**
	 * Tests if alias is not created when prefixed dependencies are present
	 *
	 * @covers \Yoast\YoastSEO\Config\Dependency_Management::ensure_class_alias()
	 */
	public function test_ensure_class_alias_prefix_available() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Dependency_Management' )
			->setMethods( array( 'prefixed_available', 'class_exists', 'class_alias' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'prefixed_available' )
			->will( $this->returnValue( true ) );

		$instance
			->expects( $this->never() )
			->method( 'class_exists' );

		$instance
			->expects( $this->never() )
			->method( 'class_alias' );

		/** @var Dependency_Management $instance */
		$instance->ensure_class_alias( YOAST_VENDOR_NS_PREFIX . '\Some_Class' );
	}

	/**
	 * Tests if class alias is not created when base class does not exist
	 *
	 * @covers \Yoast\YoastSEO\Config\Dependency_Management::ensure_class_alias()
	 */
	public function test_ensure_class_alias_base_class_does_not_exist() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Dependency_Management' )
			->setMethods( array( 'prefixed_available', 'class_exists', 'class_alias' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'prefixed_available' )
			->will( $this->returnValue( false ) );

		$instance
			->expects( $this->once() )
			->method( 'class_exists' )
			->with( 'Some_Class' )
			->will( $this->returnValue( false ) );

		$instance
			->expects( $this->never() )
			->method( 'class_alias' );

		/** @var Dependency_Management $instance */
		$instance->ensure_class_alias( YOAST_VENDOR_NS_PREFIX . '\Some_Class' );
	}

	/**
	 * Tests to make sure the autoloader is registered during initialization
	 *
	 * @covers \Yoast\YoastSEO\Config\Dependency_Management::initialize()
	 */
	public function test_registration_of_autoloader() {
		$instance = new Dependency_Management();
		$instance->initialize();

		$registered_autoloaders = spl_autoload_functions();

		$this->assertContains( array( $instance, 'ensure_class_alias' ), $registered_autoloaders );
	}
}
