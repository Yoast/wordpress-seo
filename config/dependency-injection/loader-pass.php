<?php

namespace Yoast\WP\SEO\Dependency_Injection;

use Exception;
use ReflectionClass;
use ReflectionException;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\SEO\Commands\Command_Interface;
use Yoast\WP\SEO\Conditionals\Conditional;
use Yoast\WP\SEO\Initializers\Initializer_Interface;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Loader;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * A pass is a step in the compilation process of the container.
 *
 * This step will automatically ensure all classes implementing the Integration interface
 * are registered with the Loader class.
 */
class Loader_Pass implements CompilerPassInterface {

	/**
	 * Checks all definitions to ensure all classes implementing the Integration interface are registered with the Loader class.
	 *
	 * @param ContainerBuilder $container The container.
	 *
	 * @return void
	 */
	public function process( ContainerBuilder $container ) {
		if ( ! $container->hasDefinition( Loader::class ) ) {
			return;
		}

		$loader_definition = $container->getDefinition( Loader::class );
		$definitions       = $container->getDefinitions();

		foreach ( $definitions as $definition ) {
			if ( $definition->isDeprecated() ) {
				continue;
			}

			$this->process_definition( $definition, $loader_definition );
		}
	}

	/**
	 * Processes a definition in the container.
	 *
	 * @param Definition $definition        The definition to process.
	 * @param Definition $loader_definition The loader definition.
	 *
	 * @return void
	 */
	private function process_definition( Definition $definition, Definition $loader_definition ) {
		$class = $definition->getClass();

		try {
			$reflect = new ReflectionClass( $class );
			$path    = $this->normalize_slashes( $reflect->getFileName() );
			if (
				\strpos( $path, 'src/helpers' ) !== false
				|| \strpos( $path, 'src/actions' ) !== false
				|| \strpos( $path, 'src/builders' ) !== false
				|| \strpos( $path, 'src/config' ) !== false
				|| \strpos( $path, 'src/context' ) !== false
				|| \strpos( $path, 'src/generators' ) !== false
				|| \strpos( $path, 'src/surfaces' ) !== false
				|| \strpos( $path, 'src/integrations' ) !== false
				|| \strpos( $path, 'src/loggers' ) !== false
				|| \strpos( $path, 'src/memoizers' ) !== false
				|| \strpos( $path, 'src/models' ) !== false
				|| \strpos( $path, 'src/presentations' ) !== false
				|| \strpos( $path, 'src/repositories' ) !== false
				|| \strpos( $path, 'src/services' ) !== false
				|| \strpos( $path, 'src/values' ) !== false
				|| \strpos( $path, 'src/wrappers' ) !== false
				|| \strpos( $path, 'src/wordpress' ) !== false
				|| \strpos( $path, 'src/loader' ) !== false
			) {

				$definition->setPublic( true );
			}
		} catch ( Exception $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
			// Catch all for non-existing classes.
		}

		if ( $this->should_make_public( $definition ) ) {
			$definition->setPublic( true );
		}

		if ( \is_subclass_of( $class, Conditional::class ) ) {
			$definition->setPublic( true );
		}

		if ( \is_subclass_of( $class, Initializer_Interface::class ) ) {
			$loader_definition->addMethodCall( 'register_initializer', [ $class ] );
			$definition->setPublic( true );
		}

		if ( \is_subclass_of( $class, Integration_Interface::class ) ) {
			$loader_definition->addMethodCall( 'register_integration', [ $class ] );
			$definition->setPublic( true );
		}

		if ( \is_subclass_of( $class, Route_Interface::class ) ) {
			$loader_definition->addMethodCall( 'register_route', [ $class ] );
			$definition->setPublic( true );
		}

		if ( \is_subclass_of( $class, Command_Interface::class ) ) {
			$loader_definition->addMethodCall( 'register_command', [ $class ] );
			$definition->setPublic( true );
		}

		if ( \is_subclass_of( $class, Migration::class ) ) {
			$reflect = new ReflectionClass( $class );
			$path    = $reflect->getFileName();
			$file    = \basename( $path, '.php' );
			$version = \explode( '_', $file )[0];
			$plugin  = $class::$plugin;
			$loader_definition->addMethodCall( 'register_migration', [ $plugin, $version, $class ] );
			$definition->setPublic( true );
		}
	}

	/**
	 * Checks if a class should be public. A class can be made public in the dependency injection by adding the
	 * `@makePublic` annotation in the doc block.
	 *
	 * @param  Definition $definition The definition to make public.
	 * @return bool
	 */
	private function should_make_public( Definition $definition ): bool {
		$doc_comment = $this->get_method_doc_block( $definition );

		if ( empty( $doc_comment ) ) {
			// If there is no doc comment, assume we should autowire.
			return false;
		}

		return \strpos( $doc_comment, '* @makePublic' ) !== false;
	}

	/**
	 * Retrieves the doc block comment for the given definition.
	 *
	 * @param Definition $definition The definition to parse.
	 *
	 * @return string The doc block.
	 */
	private function get_method_doc_block( Definition $definition ) {
		$classname = $definition->getClass();
		try {
			$reflection_class = new ReflectionClass( $classname );
		} catch ( ReflectionException $exception ) {
			return '';
		}

		/**
		 * The DocComment for the class we're reflecting.
		 *
		 * @var string|false $doc_comment
		 */
		$doc_comment = $reflection_class->getDocComment();

		return ( $doc_comment === false ) ? '' : $doc_comment;
	}

	/**
	 * Normalizes all slashes in a file path to forward slashes.
	 *
	 * @param string $path File path.
	 *
	 * @return string The file path with normalized slashes.
	 */
	private function normalize_slashes( $path ) {
		return \str_replace( '\\', '/', $path );
	}
}
