<?php

namespace Yoast\WP\SEO\Dependency_Injection;

use ReflectionFunctionAbstract;
use ReflectionParameter;
use RuntimeException;
use Symfony\Component\DependencyInjection\Compiler\AbstractRecursivePass;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\LazyProxy\ProxyHelper;
use Yoast\WP\Lib\Dependency_Injection\Container_Registry;
use Yoast\WP\SEO\Loadable_Interface;

/**
 * Inject_From_Registry_Pass class
 */
class Inject_From_Registry_Pass extends AbstractRecursivePass {

	/**
	 * Creates definitions for classes being injected from the container registry.
	 *
	 * @param mixed $value   The value being processed.
	 * @param bool  $is_root Whether or not the value is the root.
	 *
	 * @return mixed The processed value.
	 *
	 * @throws RuntimeException If reflection fails.
	 */
	protected function processValue( $value, $is_root = false ) {
		$value = parent::processValue( $value, $is_root );

		if ( ! $value instanceof Definition || ! $value->isAutowired() || $value->isAbstract() || ! $value->getClass() ) {
			return $value;
		}

		$class_name   = $value->getClass();
		$method_calls = $value->getMethodCalls();
		$constructor  = $this->getConstructor( $value, false );

		if ( $constructor ) {
			\array_unshift( $method_calls, [ $constructor, $value->getArguments() ] );
		}

		foreach ( $method_calls as $method_call ) {
			$this->process_method_call( $method_call, $value );
		}

		if ( \is_subclass_of( $class_name, Loadable_Interface::class ) ) {
			foreach ( $class_name::get_conditionals() as $type ) {
				$this->add_definition( $type );
			}
		}

		return $value;
	}

	/**
	 * Processes a method call of a definition.
	 *
	 * @param array      $method_call The method call, a pair of the method and arguments.
	 * @param Definition $definition  The definition the method belongs to.
	 *
	 * @return void
	 *
	 * @throws RuntimeException If reflection fails.
	 */
	private function process_method_call( $method_call, Definition $definition ) {
		list( $method, $arguments ) = $method_call;

		if ( $method instanceof ReflectionFunctionAbstract ) {
			$reflection_method = $method;
		}
		else {
			$reflection_method = $this->getReflectionMethod( $definition, $method );
		}

		foreach ( $reflection_method->getParameters() as $index => $parameter ) {
			// If an argument already exists skip it.
			if ( \array_key_exists( $index, $arguments ) && $arguments[ $index ] !== '' ) {
				continue;
			}
			$this->process_parameter( $parameter, $reflection_method );
		}
	}

	/**
	 * Processes a parameter of a method call.
	 *
	 * @param ReflectionParameter        $parameter         The parameter.
	 * @param ReflectionFunctionAbstract $reflection_method The method the parameter belongs to.
	 *
	 * @return void
	 */
	private function process_parameter( ReflectionParameter $parameter, ReflectionFunctionAbstract $reflection_method ) {
		$type = ProxyHelper::getTypeHint( $reflection_method, $parameter, true );
		// If there's no type-hint we can't do anything.
		if ( ! $type ) {
			return;
		}

		// If we have a type hint create a definition for it if required.
		$this->add_definition( $type );
	}

	/**
	 * Adds a proxied definition to the container.
	 *
	 * @param string $type The type to add a definition for.
	 *
	 * @return void
	 */
	private function add_definition( $type ) {
		// If the type is already part of the container we do not need to inject is.
		if ( $this->container->has( $type ) ) {
			return;
		}
		$other_container_name = Container_Registry::find( $type );
		if ( ! $other_container_name ) {
			return;
		}

		$definition = new Definition( $type, [ $other_container_name, $type ] );
		$definition->setPublic( true );
		$definition->setFactory( [ Container_Registry::class, 'get' ] );
		$this->container->setDefinition( $type, $definition );
	}
}
