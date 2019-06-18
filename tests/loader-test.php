<?php

namespace Yoast\WP\Free\Tests;

use Yoast\WP\Free\Loader;
use Yoast\WP\Free\Tests\Doubles\Conditional_Double;
use Yoast\WP\Free\Tests\Doubles\Integration_Double;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

class Loader_Test extends TestCase {

	/**
	 * @inheritdoc
	 */
	public function tearDown() {
		Integration_Double::$conditionals = [];

		parent::tearDown();
	}

	/**
	 * Tests loading an integration without any conditionals.
	 *
	 * @covers \Yoast\WP\Free\Loader::register_integration
	 * @covers \Yoast\WP\Free\Loader::conditionals_are_met
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
}
