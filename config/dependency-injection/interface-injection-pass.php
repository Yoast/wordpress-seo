<?php

namespace Yoast\WP\SEO\Dependency_Injection;

use Exception;
use ReflectionClass;
use ReflectionException;
use ReflectionNamedType;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Yoast\WP\SEO\Dependency_Injection\Util\Constructor_Details;

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
	 *
	 * @return void
	 */
	public function process( ContainerBuilder $container ) {
		try {

			// Get all definitions in our container.
			$definitions = $container->getDefinitions();

			/**
			 * We only want to execute for classes that match:
			 * - the class must be defined in our projects. ( e.g. don't process WordPress code )
			 * - the class must have a constructor with a typed splat argument, e.g.
			 *
			 * @example public function __construct( Fruit ...$allFruit )
			 */
			foreach ( $definitions as $definition ) {

				$definition_class = $this->get_variadic_constructor( $definition );
				if ( $definition_class === null ) {
					continue;
				}

				// Find all subclasses of the requested type in our DI definition.
				$subclasses_of_splat_type = $this->get_registered_subclasses_of( $definitions, $definition_class );

				/*
				 * The constructor needs to be called with a comma separated enumeration of objects.
				 * example:              function __construct( Fruit ...$allFruit )
				 * actually expands to:  function __construct( Fruit $f1, Fruit $f2, Fruit $f3, Fruit $fn )
				 * We have to start this array at the position of the splat argument, and inject the next
				 * matching type on the next position, and so on, until all matching types have been injected.
				 */
				$argument_index = $definition_class->splat_argument->getPosition();
				foreach ( $subclasses_of_splat_type as $subclass ) {
					$definition->setArgument( $argument_index, new Reference( $subclass->getClass() ) );
					++$argument_index;
				}
			}
		} catch ( Exception $e ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_var_dump
			\var_dump( $e );
		}
	}

	/**
	 * Analyses a class definition and looks for a constructor with a typed variadic argument
	 *
	 * @example If we had a class Fruit_Basket with this constructor:
	 * __construct(Fruit ...$all_our_fruit), then this method would find it.
	 *
	 * @param Definition $definition The class definition we are inspecting.
	 *
	 * @return Constructor_Details|null
	 *
	 * @throws ReflectionException If the reflection class couldn't be found.
	 */
	private function get_variadic_constructor( $definition ) {
		// Limit the processing to classes from our project.
		$definition_class = $definition->getClass();
		if ( ! \class_exists( $definition_class ) ) {
			return null;
		}

		// Apply reflection to the class definition, to retrieve the constructor.
		$class_reflection_info = new ReflectionClass( $definition_class );
		$class_constructor     = $class_reflection_info->getConstructor();
		if ( ! $class_constructor ) {
			/*
			 * The class has no constructor (i.e. it only has a default constructor, with no arguments).
			 * We do not need to process this class.
			 */
			return null;
		}

		// Get the constructor's last argument.
		// We only care about the last constructor argument; the '...' splat operator is always last.
		$constructor_arguments = $class_constructor->getParameters();
		$splat_argument        = \end( $constructor_arguments );

		// The isVariadic check means "is it a 'splat' argument".
		if ( ! $splat_argument || ! $splat_argument->isVariadic() ) {
			return null;
		}

		$splat_argument_type = $splat_argument->getType();

		// Analyse the type of the splat argument.
		if ( ! \is_a( $splat_argument_type, ReflectionNamedType::class ) ) {
			// If the argument is not a class, we cannot inject it as a dependency.
			return null;
		}

		$result                      = new Constructor_Details();
		$result->target_class_name   = $definition_class;
		$result->constructor         = $class_constructor;
		$result->splat_argument_type = $splat_argument_type->getName();
		$result->splat_argument      = $splat_argument;

		return $result;
	}

	/**
	 * Gets all registered subsclasses for a given definition.
	 *
	 * @param Definition[]        $all_definitions  The list of all definitions in the container.
	 * @param Constructor_Details $definition_class The class we're looking to inject.
	 *
	 * @return Definition[] The definitions that should be injected.
	 */
	private function get_registered_subclasses_of( $all_definitions, Constructor_Details $definition_class ) {
		return \array_filter(
			$all_definitions,
			static function ( $other_definition ) use ( $definition_class ) {
				if ( $other_definition->isDeprecated() ) {
					return false;
				}

				$other_class = $other_definition->getClass();
				if ( $other_class === $definition_class->target_class_name ) {
					// Never inject itself to itself.
					return false;
				}

				return \is_subclass_of( $other_class, $definition_class->splat_argument_type );
			}
		);
	}
}
