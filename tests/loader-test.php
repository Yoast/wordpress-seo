<?php

namespace Yoast\WP\Free\Tests;

use Yoast\WP\Free\Loader;
use Yoast\WP\Free\Tests\Doubles\Conditional_Double;
use Yoast\WP\Free\Tests\Doubles\Initializer_Double;
use Yoast\WP\Free\Tests\Doubles\Integration_Double;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

class Loader_Test extends TestCase {

	/**
	 * @inheritdoc
	 */
	public function tearDown() {
		Integration_Double::$conditionals = [];
		Initializer_Double::$conditionals = [];

		parent::tearDown();
	}

	/**
	 * Tests loading initializers before integrations.
	 *
	 * @covers \Yoast\WP\Free\Loader::load
	 */
	public function test_loading_initializers_before_integrations() {
		$container = $this->createMock( ContainerInterface::class );

		$loader = $this->getMockBuilder( Loader::class )
					   ->setConstructorArgs( [ $container ] )
					   ->setMethods( [ 'load_initializers', 'load_integrations' ] )
					   ->getMock();

		$loader->expects( $this->at( 0 ) )->method( 'load_initializers' )->with();
		$loader->expects( $this->at( 1 ) )->method( 'load_integrations' )->with();

		$loader->load();
	}

	/**
	 * Tests loading an integration without any conditionals.
	 *
	 * @covers \Yoast\WP\Free\Loader::register_integration
	 * @covers \Yoast\WP\Free\Loader::conditionals_are_met
	 * @covers \Yoast\WP\Free\Loader::load_integrations
	 * @covers \Yoast\WP\Free\Loader::load
	 */
	public function test_loading_unconditional_integration() {
		$integration = new Integration_Double();
		$container   = $this->createMock( ContainerInterface::class );
		$container->expects( $this->once() )->method( 'get' )->with( Integration_Double::class )->willReturn( $integration );

		$loader = new Loader( $container );
		$loader->register_integration( Integration_Double::class );
		$loader->load();

		$this->assertTrue( $integration->is_registered() );
	}

	/**
	 * Tests loading an integration with a met conditional.
	 *
	 * @covers \Yoast\WP\Free\Loader::register_integration
	 * @covers \Yoast\WP\Free\Loader::conditionals_are_met
	 * @covers \Yoast\WP\Free\Loader::load_integrations
	 * @covers \Yoast\WP\Free\Loader::load
	 */
	public function test_loading_met_conditional_integration() {
		$conditional = new Conditional_Double( true );
		Integration_Double::$conditionals = [ Conditional_Double::class ];

		$integration = new Integration_Double();
		$container   = $this->createMock( ContainerInterface::class );
		$container->expects( $this->at( 0 ) )->method( 'get' )->with( Conditional_Double::class )->willReturn( $conditional );
		$container->expects( $this->at( 1 ) )->method( 'get' )->with( Integration_Double::class )->willReturn( $integration );

		$loader = new Loader( $container );
		$loader->register_integration( Integration_Double::class );
		$loader->load();

		$this->assertTrue( $integration->is_registered() );
	}

	/**
	 * Tests loading an integration with an unmet conditional.
	 *
	 * @covers \Yoast\WP\Free\Loader::register_integration
	 * @covers \Yoast\WP\Free\Loader::conditionals_are_met
	 * @covers \Yoast\WP\Free\Loader::load_integrations
	 * @covers \Yoast\WP\Free\Loader::load
	 */
	public function test_loading_unmet_conditional_integration() {
		$conditional = new Conditional_Double( false );
		Integration_Double::$conditionals = [ Conditional_Double::class ];

		$integration = new Integration_Double();
		$container   = $this->createMock( ContainerInterface::class );
		$container->expects( $this->at( 0 ) )->method( 'get' )->with( Conditional_Double::class )->willReturn( $conditional );

		$loader = new Loader( $container );
		$loader->register_integration( Integration_Double::class );
		$loader->load();

		$this->assertFalse( $integration->is_registered() );
	}

	/**
	 * Tests loading an initializer without any conditionals.
	 *
	 * @covers \Yoast\WP\Free\Loader::register_initializer
	 * @covers \Yoast\WP\Free\Loader::conditionals_are_met
	 * @covers \Yoast\WP\Free\Loader::load_initializers
	 * @covers \Yoast\WP\Free\Loader::load
	 */
	public function test_loading_unconditional_initializer() {
		$initializer = new Initializer_Double();
		$container   = $this->createMock( ContainerInterface::class );
		$container->expects( $this->once() )->method( 'get' )->with( Initializer_Double::class )->willReturn( $initializer );

		$loader = new Loader( $container );
		$loader->register_initializer( Initializer_Double::class );
		$loader->load();

		$this->assertTrue( $initializer->is_registered() );
	}

	/**
	 * Tests loading an initializer with a met conditional.
	 *
	 * @covers \Yoast\WP\Free\Loader::register_initializer
	 * @covers \Yoast\WP\Free\Loader::conditionals_are_met
	 * @covers \Yoast\WP\Free\Loader::load_initializers
	 * @covers \Yoast\WP\Free\Loader::load
	 */
	public function test_loading_met_conditional_initializer() {
		$conditional = new Conditional_Double( true );
		Initializer_Double::$conditionals = [ Conditional_Double::class ];

		$initializer = new Initializer_Double();
		$container   = $this->createMock( ContainerInterface::class );
		$container->expects( $this->at( 0 ) )->method( 'get' )->with( Conditional_Double::class )->willReturn( $conditional );
		$container->expects( $this->at( 1 ) )->method( 'get' )->with( Initializer_Double::class )->willReturn( $initializer );

		$loader = new Loader( $container );
		$loader->register_initializer( Initializer_Double::class );
		$loader->load();

		$this->assertTrue( $initializer->is_registered() );
	}

	/**
	 * Tests loading an initializer with an unmet conditional.
	 *
	 * @covers \Yoast\WP\Free\Loader::register_initializer
	 * @covers \Yoast\WP\Free\Loader::conditionals_are_met
	 * @covers \Yoast\WP\Free\Loader::load_initializers
	 * @covers \Yoast\WP\Free\Loader::load
	 */
	public function test_loading_unmet_conditional_initializer() {
		$conditional = new Conditional_Double( false );
		Initializer_Double::$conditionals = [ Conditional_Double::class ];

		$initializer = new Initializer_Double();
		$container   = $this->createMock( ContainerInterface::class );
		$container->expects( $this->at( 0 ) )->method( 'get' )->with( Conditional_Double::class )->willReturn( $conditional );

		$loader = new Loader( $container );
		$loader->register_initializer( Initializer_Double::class );
		$loader->load();

		$this->assertFalse( $initializer->is_registered() );
	}
}
