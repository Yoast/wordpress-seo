<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Dependency_Injection
 */

namespace Yoast\WP\Free\Dependency_Injection;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Yoast\WP\Free\Conditionals\Conditional;
use Yoast\WP\Free\Initializers\Initializer_Interface;
use Yoast\WP\Free\Integrations\Integration_Interface;
use Yoast\WP\Free\Loader;
use Yoast\WP\Free\Presenters\Presenter_Interface;

/**
 * A pass is a step in the compilation process of the container.
 *
 * This step will automatically ensure all classes implementing the Integration interface
 * are registered with the Loader class.
 */
class Loader_Pass implements CompilerPassInterface {

	/**
	 * Checks all definitions to ensure all classes implementing the Integration interface
	 * are registered with the Loader class.
	 *
	 * @param \Symfony\Component\DependencyInjection\ContainerBuilder $container The container.
	 */
	public function process( ContainerBuilder $container ) {
		if ( ! $container->hasDefinition( Loader::class ) ) {
			return;
		}

		$loader_definition = $container->getDefinition( Loader::class );
		$definitions = $container->getDefinitions();

		foreach ( $definitions as $definition ) {
			$this->process_definition( $definition, $loader_definition );
		}
	}

	/**
	 * Processes a definition in the container.
	 *
	 * @param \Symfony\Component\DependencyInjection\Definition $definition        The definition to process.
	 * @param \Symfony\Component\DependencyInjection\Definition $loader_definition The loader definition.
	 */
	private function process_definition( Definition $definition, Definition $loader_definition ) {
		$class = $definition->getClass();

		if ( \is_subclass_of( $class, Initializer_Interface::class ) ) {
			$loader_definition->addMethodCall( 'register_initializer', [ $class ] );
		}

		if ( \is_subclass_of( $class, Integration_Interface::class ) ) {
			$loader_definition->addMethodCall( 'register_integration', [ $class ] );
		}
	}
}
