<?php

namespace Yoast\WP\SEO\Dependency_Injection;

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

		/**
		 * We need reflection methods introduced in PHP 7.1 to run this compiler pass.
		 */
		if ( PHP_VERSION_ID < 70100 ) {
			return;
		}

		try {

			// Get all definitions in our container.
			$definitions = $container->getDefinitions();

			/**
			 * We only want to execute for classes that match:
			 * - the class must be defined in our projects. ( e.g. don't process Wordpress code )
			 * - the class must have a constructor with a typed splat argument, e.g.
			 * @example public function __construct( Fruit ...$allFruit )
			 */
			foreach ( $definitions as $definition ) {

				// The goal is to limit the process to classes from our project.
				$definition_class = $definition->getClass();
				if ( ! \class_exists( $definition_class ) ) {
					// Do not process classes outside our project.
					continue;
				}

				// Apply reflection to the class definition, to retrieve the constructor.
				$class_reflection_info = new ReflectionClass( $definition_class );
				$class_constructor     = $class_reflection_info->getConstructor();
				if ( ! $class_constructor ) {
					/*
					 * The class has no constructor (i.e. it only has a default constructor with no arguments).
					 * We do not need to process this class.
					 */
					continue;
				}

				// Get the constructor's last argument.
				// We only care about the last constructor argument; the '...' splat operator is always last.
				$constructor_arguments = $class_constructor->getParameters();
				$splat_argument        = end( $constructor_arguments );

				if ( ! $splat_argument || // No arguments at all
					 ! $splat_argument->isVariadic() ) { // isVariadic means "is it a 'splat' argument".
					// Only continue for splat arguments.
					continue;
				}

				// Needs PHP 7.0.
				$splat_argument_type = $splat_argument->getType();
				// Analyse the type of the splat argument. Needs PHP 7.1.
				if ( ! is_a( $splat_argument_type, ReflectionNamedType::class ) ) {
					// If the argument is not a class, we cannot inject it as a dependency.
					continue;
				}

				// We've found a class that has a splat operator in its constructor!
				echo( "Found a constructor with a splat argument for class " . $definition_class );
				// This is the type of the splat argument:
				$splat_argument_classname = $splat_argument_type->getName();
				echo( "Going to inject all implementations of " . $splat_argument_classname );

				// Find all subclasses of the requested type in our DI definition
				$subclasses_of_splat_type = \array_filter( $definitions,
					function( $other_definition ) use ( $splat_argument_classname, $definition ) {
						if ( $other_definition === $definition ) {
							// Never inject itself to itself
							return false;
						}

						return \is_subclass_of( $other_definition->getClass(), $splat_argument_classname );
					} );

				/*
				 * The constructor needs to be called with a comma separated enumeration of objects.
				 * example:				 function __construct( Fruit ...$allFruit )
				 * actually expands to:  function __construct( Fruit $f1, Fruit $f2, Fruit $f3, Fruit $fn )
				 * We have to start this array at the position of the splat argument, and inject the next
				 * matching type on the next position, and so on, until all matching types have been injected.
				 */
				$argument_index = $splat_argument->getPosition();
				foreach ( $subclasses_of_splat_type as $subclass ) {
					echo ( "Injecting " . $subclass );
					$definition->setArgument( $argument_index, new Reference( $subclass->getClass() ) );

					$argument_index += 1;
				}
			}
		} catch ( \Exception $e ) {
			var_dump( $e );
		}
	}
}
