<?php

namespace Yoast\WP\SEO\Dependency_Injection;

use Exception;
use ReflectionClass;
use ReflectionNamedType;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

/**
 * A pass is a step in the compilation process of the container.
 *
 * This step will automatically ensure all classes implementing the Integration interface
 * are registered with the Loader class.
 */
class Interface_Injection_Pass implements CompilerPassInterface {

	/**
	 * Checks all definitions to ensure all classes implementing the Integration interface
	 * are registered with the Loader class.
	 *
	 * @param ContainerBuilder $container The container.
	 */
	public function process( ContainerBuilder $container ) {
        try {
        	// all definitions
            $definitions = $container->getDefinitions();
			foreach ( $definitions as $definition ) {

				$definition_class = $definition->getClass();
				if ( ! \class_exists( $definition_class ) ) {
					// do not process classes outside our container
					continue;
				}

				// get the constructor for our class
				$reflection    = new ReflectionClass( $definition_class );
				$constructor   = $reflection->getConstructor();
				if ( ! $constructor ) {
					// no constructor (or default constructor) then we do not need to process this class
					continue;
				}

				// figure out the constructor's parameters
				$parameters     = $constructor->getParameters();
				// we only care about the last constructor parameter; the '...' splat operator is always last
				$last_parameter = end( $parameters );
				if ( ! $last_parameter || ! $last_parameter->isVariadic() ) { // isVariadic means "is it a splat"
					continue;
				}

				/**
				 * @var ReflectionNamedType
				 */
				$type = $last_parameter->getType();
				// figure out the type of that splat parameter
				if ( ! is_a( $type, ReflectionNamedType::class ) ) {
					// if it's not a class, we are not interested
					continue;
				}

				// we've found a class that has a splat operator in its constructor!
				var_dump( "Found class to inject!" );
				var_dump( $definition->getClass() );
				// this is the type of the splat argument:
				$argument_class       = $type->getName();
				var_dump( "Going to inject: " . $argument_class );

				// find all subclasses of the requested type
				$argument_definitions = \array_filter( $definitions, function ( $other_definition ) use( $argument_class, $definition ) {
					if ( $other_definition === $definition ) {
						return false;
					}

					return \is_subclass_of( $other_definition->getClass(), $argument_class );
				} );

				$index = $last_parameter->getPosition();
				foreach ( $argument_definitions as $argument_definition ) {
					$definition->setArgument( $index, new Reference( $argument_definition->getClass() ) );

					$index += 1;
				}
			}
        } catch ( \Exception $e ) {
            var_dump( $e );
        }
	}
}
