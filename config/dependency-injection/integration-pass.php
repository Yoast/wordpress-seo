<?php

namespace Yoast\WP\Free;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Yoast\WP\Free\WordPress\Integration;

class Integration_Pass implements CompilerPassInterface {
	public function process( ContainerBuilder $container ) {
		if ( ! $container->hasDefinition( Loader::class ) ) {
			return;
		}

		$loader_definition = $container->getDefinition( Loader::class );
		$loader_definition->setArgument( 0, new Reference( 'service_container' ) );

		$definitions = $container->getDefinitions();

		foreach ( $definitions as $definition ) {
			$class = $definition->getClass();

			if ( ! is_subclass_of( $class, Integration::class ) ) {
				continue;
			}

			$loader_definition->addMethodCall( 'register_integration', [ $class ] );
		}
	}
}
