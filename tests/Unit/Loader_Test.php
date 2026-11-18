<?php

namespace Yoast\WP\SEO\Tests\Unit;

use Brain\Monkey;
use Mockery;
use ReflectionMethod;
use WP_CLI;
use Yoast\WP\SEO\Conditionals\Conditional;
use Yoast\WP\SEO\Initializers\Initializer_Interface;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Loader;
use Yoast\WP\SEO\Tests\Unit\Doubles\Conditional_Command_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Unconditional_Command_Double;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Loader_Test
 *
 * @group loader
 *
 * @coversDefaultClass \Yoast\WP\SEO\Loader
 */
final class Loader_Test extends TestCase {

	/**
	 * Tests loading initializers before integrations.
	 *
	 * @covers ::load
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_loading_unconditional_integration() {
		$integration_mock = Mockery::mock( Integration_Interface::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [] );
		$integration_mock->expects( 'register_hooks' )->once();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( \get_class( $integration_mock ) )->andReturn( $integration_mock );

		Monkey\Functions\expect( 'did_action' )
			->with( 'init' )
			->andReturn( 1 );

		$loader = new Loader( $container_mock );
		$loader->register_integration( \get_class( $integration_mock ) );
		$loader->load();
	}

	/**
	 * Tests loading an integration with a met conditional.
	 *
	 * @covers ::__construct
	 * @covers ::register_integration
	 * @covers ::load
	 *
	 * @return void
	 */
	public function test_loading_met_conditional_integration() {
		$conditional_mock = Mockery::mock( Conditional::class );
		$conditional_mock->expects( 'is_met' )->once()->andReturn( true );

		$integration_mock = Mockery::mock( Integration_Interface::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$integration_mock->expects( 'register_hooks' )->once();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->once()->with( \get_class( $integration_mock ) )->andReturn( $integration_mock );

		Monkey\Functions\expect( 'did_action' )
			->with( 'init' )
			->andReturn( 1 );

		$loader = new Loader( $container_mock );
		$loader->register_integration( \get_class( $integration_mock ) );
		$loader->load();
	}

	/**
	 * Tests loading an integration with an unmet conditional.
	 *
	 * @covers ::__construct
	 * @covers ::register_integration
	 * @covers ::load
	 *
	 * @return void
	 */
	public function test_loading_unmet_conditional_integration() {
		$conditional_mock = Mockery::mock( Conditional::class );
		$conditional_mock->expects( 'is_met' )->once()->andReturn( false );

		$integration_mock = Mockery::mock( Integration_Interface::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$integration_mock->expects( 'register_hooks' )->never();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->never()->with( \get_class( $integration_mock ) );

		Monkey\Functions\expect( 'did_action' )
			->with( 'init' )
			->andReturn( 1 );

		$loader = new Loader( $container_mock );
		$loader->register_integration( \get_class( $integration_mock ) );
		$loader->load();
	}

	/**
	 * Tests loading an integration with an conditional that doesn't exist.
	 *
	 * @covers ::__construct
	 * @covers ::register_integration
	 * @covers ::load
	 *
	 * @return void
	 */
	public function test_loading_not_exisisting_conditional_integration() {
		$integration_mock = Mockery::mock( Integration_Interface::class );
		$integration_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$integration_mock->expects( 'register_hooks' )->never();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( null );
		$container_mock->expects( 'get' )->never()->with( \get_class( $integration_mock ) );

		Monkey\Functions\expect( 'did_action' )
			->with( 'init' )
			->andReturn( 1 );

		$loader = new Loader( $container_mock );
		$loader->register_integration( \get_class( $integration_mock ) );
		$loader->load();
	}

	/**
	 * Tests loading an initializer without any conditionals.
	 *
	 * @covers ::__construct
	 * @covers ::register_initializer
	 * @covers ::load
	 *
	 * @return void
	 */
	public function test_loading_unconditional_initializer() {
		$initializer_mock = Mockery::mock( Initializer_Interface::class );
		$initializer_mock->expects( 'get_conditionals' )->once()->andReturn( [] );
		$initializer_mock->expects( 'initialize' )->once();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( \get_class( $initializer_mock ) )->andReturn( $initializer_mock );

		$loader = new Loader( $container_mock );
		$loader->register_initializer( \get_class( $initializer_mock ) );
		$loader->load();
	}

	/**
	 * Tests loading an initializer with a met conditional.
	 *
	 * @covers ::__construct
	 * @covers ::register_initializer
	 * @covers ::load
	 *
	 * @return void
	 */
	public function test_loading_met_conditional_initializer() {
		$conditional_mock = Mockery::mock( Conditional::class );
		$conditional_mock->expects( 'is_met' )->once()->andReturn( true );

		$initializer_mock = Mockery::mock( Initializer_Interface::class );
		$initializer_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$initializer_mock->expects( 'initialize' )->once();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->once()->with( \get_class( $initializer_mock ) )->andReturn( $initializer_mock );

		$loader = new Loader( $container_mock );
		$loader->register_initializer( \get_class( $initializer_mock ) );
		$loader->load();
	}

	/**
	 * Tests loading an initializer with an unmet conditional.
	 *
	 * @covers ::__construct
	 * @covers ::register_initializer
	 * @covers ::load
	 *
	 * @return void
	 */
	public function test_loading_unmet_conditional_initializer() {
		$conditional_mock = Mockery::mock( Conditional::class );
		$conditional_mock->expects( 'is_met' )->once()->andReturn( false );

		$initializer_mock = Mockery::mock( Initializer_Interface::class );
		$initializer_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$initializer_mock->expects( 'initialize' )->never();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->never()->with( \get_class( $initializer_mock ) );

		$loader = new Loader( $container_mock );
		$loader->register_initializer( \get_class( $initializer_mock ) );
		$loader->load();
	}

	/**
	 * Tests loading an initializer with an conditional that doesn't exist.
	 *
	 * @covers ::__construct
	 * @covers ::register_initializer
	 * @covers ::load
	 *
	 * @return void
	 */
	public function test_loading_not_exisisting_conditional_initializer() {
		$initializer_mock = Mockery::mock( Initializer_Interface::class );
		$initializer_mock->expects( 'get_conditionals' )->once()->andReturn( [ 'Conditional_Class' ] );
		$initializer_mock->expects( 'initialize' )->never();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( null );
		$container_mock->expects( 'get' )->never()->with( \get_class( $initializer_mock ) );

		$loader = new Loader( $container_mock );
		$loader->register_initializer( \get_class( $initializer_mock ) );
		$loader->load();
	}

	/**
	 * Tests that a command that does not implement Loadable_Interface is loaded unconditionally.
	 *
	 * @covers ::register_command
	 * @covers ::load_commands
	 *
	 * @return void
	 */
	public function test_loading_command_without_loadable_interface() {
		$command_class    = Unconditional_Command_Double::class;
		$command_instance = new Unconditional_Command_Double();

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( $command_class )->andReturn( $command_instance );

		$cli = Mockery::mock( 'overload:' . WP_CLI::class );
		$cli->expects( 'add_command' )
			->once()
			->with( Unconditional_Command_Double::get_namespace(), $command_instance );

		$loader = new Loader( $container_mock );
		$loader->register_command( $command_class );
		$this->invoke_method( $loader, 'load_commands' );
	}

	/**
	 * Tests that a conditional command is loaded when its conditional is met.
	 *
	 * @covers ::register_command
	 * @covers ::load_commands
	 *
	 * @return void
	 */
	public function test_loading_conditional_command_when_met() {
		$command_class    = Conditional_Command_Double::class;
		$command_instance = new Conditional_Command_Double();

		$conditional_mock = Mockery::mock( Conditional::class );
		$conditional_mock->expects( 'is_met' )->once()->andReturn( true );

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->once()->with( $command_class )->andReturn( $command_instance );

		$cli = Mockery::mock( 'overload:' . WP_CLI::class );
		$cli->expects( 'add_command' )
			->once()
			->with( Conditional_Command_Double::get_namespace(), $command_instance );

		$loader = new Loader( $container_mock );
		$loader->register_command( $command_class );
		$this->invoke_method( $loader, 'load_commands' );
	}

	/**
	 * Tests that a conditional command is skipped when its conditional is not met.
	 *
	 * @covers ::register_command
	 * @covers ::load_commands
	 *
	 * @return void
	 */
	public function test_loading_conditional_command_when_not_met() {
		$command_class = Conditional_Command_Double::class;

		$conditional_mock = Mockery::mock( Conditional::class );
		$conditional_mock->expects( 'is_met' )->once()->andReturn( false );

		$container_mock = Mockery::mock( ContainerInterface::class );
		$container_mock->expects( 'get' )->once()->with( 'Conditional_Class' )->andReturn( $conditional_mock );
		$container_mock->expects( 'get' )->never()->with( $command_class );

		$cli = Mockery::mock( 'overload:' . WP_CLI::class );
		$cli->expects( 'add_command' )->never();

		$loader = new Loader( $container_mock );
		$loader->register_command( $command_class );
		$this->invoke_method( $loader, 'load_commands' );
	}

	/**
	 * Invokes a protected method on an instance.
	 *
	 * @param object $instance    The instance to invoke the method on.
	 * @param string $method_name The name of the method to invoke.
	 *
	 * @return mixed The return value of the invoked method.
	 */
	private function invoke_method( $instance, $method_name ) {
		$reflection = new ReflectionMethod( $instance, $method_name );
		$reflection->setAccessible( true );

		return $reflection->invoke( $instance );
	}
}
