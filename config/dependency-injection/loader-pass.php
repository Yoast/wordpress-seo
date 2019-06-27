<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Dependency_Injection
 */

namespace Yoast\WP\Free\Dependency_Injection;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Yoast\WP\Free\Loader;
use Yoast\WP\Free\WordPress\Initializer;
use Yoast\WP\Free\WordPress\Integration;

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
		$loader_definition->setArgument( 0, new Reference( 'service_container' ) );

		$definitions = $container->getDefinitions();

		foreach ( $definitions as $definition ) {
			$class = $definition->getClass();

			if ( is_subclass_of( $class, Initializer::class ) ) {
				$loader_definition->addMethodCall( 'register_initializer', [ $class ] );
			}

			if ( is_subclass_of( $class, Integration::class ) ) {
				$loader_definition->addMethodCall( 'register_integration', [ $class ] );
			}
		}
	}
}
