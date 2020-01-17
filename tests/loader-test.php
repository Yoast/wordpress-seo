<?php

namespace Yoast\WP\SEO\Tests;

use Mockery;
use Yoast\WP\SEO\Conditionals\Conditional;
use Yoast\WP\SEO\Loader;
use Yoast\WP\SEO\WordPress\Initializer;
use Yoast\WP\SEO\WordPress\Integration;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Loader_Test
 *
 * @group loader
 *
 * @coversDefaultClass \Yoast\WP\SEO\Loader
 * @covers ::<!public>
 *
 * @package Yoast\WP\SEO\Tests
 */
class Loader_Test extends TestCase {

	/**
	 * Tests loading initializers before integrations.
	 *
	 * @covers ::load
	 */
	public function test_loading_initializers_before_integrations() {
		$loader_mock = Mockery::mock( Loader::class )->makePartial()
			->shouldAllowMockingProtectedMethods();

		$loader_mock->expects( 'load_initializers' )->once()->ordered();
		$loader_mock->expects( 'load_integrations' )->once()->ordered();

		$loader_mock->load();
	}

	/**
	 * Tests loading an integration without any conditionals.
	 *
	 * @covers ::__construct
	 * @covers ::register_integration
	 * @covers ::load
	 */
	public function test_loading_unconditional_integration() {
		$integration_mock = Mockery::mock( 'alias:Unconditional_Integration', Integration::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [] );
		$integration_mock->expects( 'register_hooks' )->once();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Unconditional_Integration' )->andReturn( $integration_mock );

		$loader = new Loader( $container_mock );
		$loader->register_integration( 'Unconditional_Integration' );
		$loader->load();
	}

	/**
	 * Tests loading an integration with a met conditional.
	 *
	 * @covers ::__construct
	 * @covers ::register_integration
	 * @covers ::load
	 */
	public function test_loading_met_conditional_integration() {
		$conditional_mock = Mockery::mock( Conditional::class );
		$conditional_mock->expects( 'is_met' )->once()->andReturn( true );

		$integration_mock = Mockery::mock( 'alias:Met_Conditional_Integration', Integration::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$integration_mock->expects( 'register_hooks' )->once();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->once()->with( 'Met_Conditional_Integration' )->andReturn( $integration_mock );

		$loader = new Loader( $container_mock );
		$loader->register_integration( 'Met_Conditional_Integration' );
		$loader->load();
	}

	/**
	 * Tests loading an integration with an unmet conditional.
	 *
	 * @covers ::__construct
	 * @covers ::register_integration
	 * @covers ::load
	 */
	public function test_loading_unmet_conditional_integration() {
		$conditional_mock = Mockery::mock( Conditional::class );
		$conditional_mock->expects( 'is_met' )->once()->andReturn( false );

		$integration_mock = Mockery::mock( 'alias:Unmet_Conditional_Integration', Integration::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$integration_mock->expects( 'register_hooks' )->never();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->never()->with( 'Unmet_Conditional_Integration' );

		$loader = new Loader( $container_mock );
		$loader->register_integration( 'Unmet_Conditional_Integration' );
		$loader->load();
	}

	/**
	 * Tests loading an initializer without any conditionals.
	 *
	 * @covers ::__construct
	 * @covers ::register_initializer
	 * @covers ::load
	 */
	public function test_loading_unconditional_initializer() {
		$integration_mock = Mockery::mock( 'alias:Unconditional_Initializer', Initializer::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [] );
		$integration_mock->expects( 'initialize' )->once();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Unconditional_Initializer' )->andReturn( $integration_mock );

		$loader = new Loader( $container_mock );
		$loader->register_initializer( 'Unconditional_Initializer' );
		$loader->load();
	}

	/**
	 * Tests loading an initializer with a met conditional.
	 *
	 * @covers ::__construct
	 * @covers ::register_initializer
	 * @covers ::load
	 */
	public function test_loading_met_conditional_initializer() {
		$conditional_mock = Mockery::mock( Conditional::class );
		$conditional_mock->expects( 'is_met' )->once()->andReturn( true );

		$integration_mock = Mockery::mock( 'alias:Met_Conditional_Initializer', Initializer::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$integration_mock->expects( 'initialize' )->once();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->once()->with( 'Met_Conditional_Initializer' )->andReturn( $integration_mock );

		$loader = new Loader( $container_mock );
		$loader->register_initializer( 'Met_Conditional_Initializer' );
		$loader->load();
	}

	/**
	 * Tests loading an initializer with an unmet conditional.
	 *
	 * @covers ::__construct
	 * @covers ::register_initializer
	 * @covers ::load
	 */
	public function test_loading_unmet_conditional_initializer() {
		$conditional_mock = Mockery::mock( Conditional::class );
		$conditional_mock->expects( 'is_met' )->once()->andReturn( false );

		$integration_mock = Mockery::mock( 'alias:Unmet_Conditional_Initializer', Initializer::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$integration_mock->expects( 'initialize' )->never();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->never()->with( 'Unmet_Conditional_Initializer' );

		$loader = new Loader( $container_mock );
		$loader->register_initializer( 'Unmet_Conditional_Initializer' );
		$loader->load();
	}
}
