<?php

namespace Yoast\WP\SEO\Tests\Unit;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Conditional;
use Yoast\WP\SEO\Initializers\Initializer_Interface;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Loader;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Loader_Test
 *
 * @group loader
 *
 * @coversDefaultClass \Yoast\WP\SEO\Loader
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

		Monkey\Functions\expect( 'did_action' )
			->with( 'init' )
			->andReturn( 1 );

		$loader_mock->expects( 'load_initializers' )->once()->ordered();
		$loader_mock->expects( 'load_integrations' )->once()->ordered();

		$loader_mock->load();
	}

	/**
	 * Tests load_initializers with load_integrations set as a hook.
	 *
	 * @covers ::load
	 */
	public function test_loading_integrations_set_as_hook() {
		$loader_mock = Mockery::mock( Loader::class )->makePartial()
			->shouldAllowMockingProtectedMethods();

		Monkey\Functions\expect( 'did_action' )
			->with( 'init' )
			->andReturn( 0 );

		Monkey\Actions\expectAdded( 'init' )
			->with( [ $loader_mock, 'load_integrations' ] );

		$loader_mock->expects( 'load_initializers' )->once()->ordered();
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
		$integration_mock = Mockery::mock( 'alias:Unconditional_Integration', Integration_Interface::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [] );
		$integration_mock->expects( 'register_hooks' )->once();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Unconditional_Integration' )->andReturn( $integration_mock );

		Monkey\Functions\expect( 'did_action' )
			->with( 'init' )
			->andReturn( 1 );

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

		$integration_mock = Mockery::mock( 'alias:Met_Conditional_Integration', Integration_Interface::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$integration_mock->expects( 'register_hooks' )->once();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->once()->with( 'Met_Conditional_Integration' )->andReturn( $integration_mock );

		Monkey\Functions\expect( 'did_action' )
			->with( 'init' )
			->andReturn( 1 );

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

		$integration_mock = Mockery::mock( 'alias:Unmet_Conditional_Integration', Integration_Interface::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$integration_mock->expects( 'register_hooks' )->never();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->never()->with( 'Unmet_Conditional_Integration' );

		Monkey\Functions\expect( 'did_action' )
			->with( 'init' )
			->andReturn( 1 );

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
		$integration_mock = Mockery::mock( 'alias:Unconditional_Initializer', Initializer_Interface::class );
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

		$integration_mock = Mockery::mock( 'alias:Met_Conditional_Initializer', Initializer_Interface::class );
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

		$integration_mock = Mockery::mock( 'alias:Unmet_Conditional_Initializer', Initializer_Interface::class );
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
