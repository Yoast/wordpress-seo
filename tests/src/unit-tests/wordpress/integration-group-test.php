<?php

namespace Yoast\Tests\UnitTests\WordPress;

use Yoast\YoastSEO\WordPress\Integration_Group;

/**
 * Class Database_Migration_Test
 *
 * @group integrations
 *
 * @package Yoast\Tests
 */
class Integration_Group_Test extends \PHPUnit_Framework_TestCase {

	/**
	 * Tests the addition of an integration.
	 *
	 * @covers \Yoast\YoastSEO\WordPress\Integration_Group::add_integration()
	 */
	public function test_add_integrations() {
		$instance = new \Yoast\YoastSEO\WordPress\Integration_Group();

		$integration = $this
			->getMockBuilder( '\Yoast\YoastSEO\WordPress\Integration' )
			->getMock();

		$instance->add_integration( $integration );

		$this->assertAttributeContains( $integration, 'integrations', $instance );
	}

	/**
	 * Tests ensure integration is called on constructor
	 *
	 * @covers \Yoast\YoastSEO\WordPress\Integration_Group::__construct()
	 */
	public function test_construct() {
		$classname = '\Yoast\YoastSEO\WordPress\Integration_Group';
		// make sure only integrations are loaded.
		$instance = $this
			->getMockBuilder( $classname )
			->setMethods( array( 'ensure_integration' ) )
			->disableOriginalConstructor()
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'ensure_integration' )
			->with( $this->equalTo( array( 'a', 'b' ) ) );

		// Trigger the constructor to test the implicit method call.
		$reflected_class = new \ReflectionClass( $classname );
		$constructor     = $reflected_class->getConstructor();
		$constructor->invoke( $instance, array( 'a', 'b' ) );
	}

	/**
	 * Tests to make sure only Integration instances are used in the Integration Group
	 *
	 * @covers \Yoast\YoastSEO\WordPress\Integration_Group::ensure_integration()
	 */
	public function test_ensure_integration() {
		$integration = $this
			->getMockBuilder( '\Yoast\YoastSEO\WordPress\Integration' )
			->getMock();

		$classname = '\Yoast\YoastSEO\WordPress\Integration_Group';

		$instance = $this
			->getMockBuilder( $classname )
			->disableOriginalConstructor()
			->getMock();

		$no_integration = new \stdClass();

		// Trigger the constructor to test the implicit method call.
		$reflected_class = new \ReflectionClass( $classname );
		$constructor     = $reflected_class->getConstructor();
		$constructor->invoke( $instance, array( $integration, $no_integration ) );

		$this->assertAttributeEquals( array( $integration ), 'integrations', $instance );
	}

	/**
	 * Tests that register hooks is called on the integration
	 *
	 * @covers \Yoast\YoastSEO\WordPress\Integration_Group::register_hooks()
	 */
	public function test_register_hooks() {
		$integration = $this
			->getMockBuilder( '\Yoast\YoastSEO\WordPress\Integration' )
			->setMethods( array( 'register_hooks' ) )
			->getMock();

		$integration
			->expects( $this->once() )
			->method( 'register_hooks' );

		$instance = new Integration_Group( array( $integration ) );
		$instance->register_hooks();
	}
}
