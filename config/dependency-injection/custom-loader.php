<?php

namespace Yoast\WP\SEO\Dependency_Injection;

use ReflectionException;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\Config\Resource\GlobResource;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\Exception\InvalidArgumentException;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;

/**
 * This class is mostly a direct copy-paste of the symfony PhpFileLoader class.
 * It's been adapted to allow automatic discovery based on not just PSR-4 but also the Yoast standards.
 */
class Custom_Loader extends PhpFileLoader {

	/**
	 * The class map path.
	 *
	 * @var string
	 */
	private $class_map_path;

	/**
	 * The class map.
	 *
	 * @var array
	 */
	private $class_map;

	/**
	 * Custom_Loader constructor.
	 *
	 * @param ContainerBuilder $container      The ContainerBuilder to load classes for.
	 * @param string           $class_map_path The class map path.
	 */
	public function __construct( ContainerBuilder $container, $class_map_path ) {
		$this->class_map_path = $class_map_path;
		parent::__construct( $container, new FileLocator( __DIR__ . '/../..' ) );
	}

	/**
	 * Transforms a path to a class name using the class map.
	 *
	 * @param string $path The path of the class.
	 *
	 * @return bool|string The classname.
	 */
	private function getClassFromClassMap( $path ) {
		if ( ! $this->class_map ) {
			$this->class_map = require $this->class_map_path;
			$this->class_map = \array_map( [ $this, 'normalize_slashes' ], $this->class_map );
			$this->class_map = \array_flip( $this->class_map );
		}

		if ( isset( $this->class_map[ $path ] ) ) {
			return $this->class_map[ $path ];
		}

		return false;
	}

	/**
	 * Registers a set of classes as services using PSR-4 for discovery.
	 *
	 * @param Definition  $prototype A definition to use as template.
	 * @param string      $namespace The namespace prefix of classes in the scanned directory.
	 * @param string      $resource  The directory to look for classes, glob-patterns allowed.
	 * @param string|null $exclude   A globed path of files to exclude.
	 *
	 * @return void
	 *
	 * @throws InvalidArgumentException If invalid arguments are supplied.
	 */
	public function registerClasses( Definition $prototype, $namespace, $resource, $exclude = null ) {
		if ( \substr( $namespace, -1 ) !== '\\' ) {
			throw new InvalidArgumentException( \sprintf( 'Namespace prefix must end with a "\\": %s.', $namespace ) );
		}
		if ( ! \preg_match( '/^(?:[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*+\\\\)++$/', $namespace ) ) {
			throw new InvalidArgumentException( \sprintf( 'Namespace is not a valid PSR-4 prefix: %s.', $namespace ) );
		}

		$classes = $this->findClasses( $namespace, $resource, $exclude );
		// Prepare for deep cloning.
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize -- Reason: There's no way for user input to get in between serialize and unserialize.
		$serialized_prototype = \serialize( $prototype );
		$interfaces           = [];
		$singly_implemented   = [];

		foreach ( $classes as $class => $error_message ) {
			if ( \interface_exists( $class, false ) ) {
				$interfaces[] = $class;
			}
			else {
				// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_unserialize -- Reason: There's no way for user input to get in between serialize and unserialize.
				$this->setDefinition( $class, $definition = \unserialize( $serialized_prototype ) );
				if ( $error_message !== null ) {
					$definition->addError( $error_message );

					continue;
				}
				foreach ( \class_implements( $class, false ) as $interface ) {
					$singly_implemented[ $interface ] = isset( $singly_implemented[ $interface ] ) ? false : $class;
				}
			}
		}
		foreach ( $interfaces as $interface ) {
			if ( ! empty( $singly_implemented[ $interface ] ) ) {
				$this->container->setAlias( $interface, $singly_implemented[ $interface ] )
					->setPublic( false );
			}
		}
	}

	// phpcs:disable WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase -- excludePattern parameter name must match parent, which is outside of our codebase.

	/**
	 * Finds classes based on a given pattern and exclude pattern.
	 *
	 * @param string $namespace      The namespace prefix of classes in the scanned directory.
	 * @param string $pattern        The directory to look for classes, glob-patterns allowed.
	 * @param string $excludePattern A globed path of files to exclude.
	 *
	 * @return array The found classes.
	 *
	 * @throws InvalidArgumentException If invalid arguments were supplied.
	 */
	private function findClasses( $namespace, $pattern, $excludePattern ) {
		$parameter_bag = $this->container->getParameterBag();

		$exclude_paths  = [];
		$exclude_prefix = null;
		if ( $excludePattern ) {
			$excludePattern = $parameter_bag->unescapeValue( $parameter_bag->resolveValue( $excludePattern ) );
			foreach ( $this->glob( $excludePattern, true, $resource ) as $path => $info ) {
				if ( $exclude_prefix === null ) {
					$exclude_prefix = $resource->getPrefix();
				}

				// Normalize Windows slashes.
				$path                   = $this->normalize_slashes( $path );
				$exclude_paths[ $path ] = true;
			}
		}

		$pattern    = $parameter_bag->unescapeValue( $parameter_bag->resolveValue( $pattern ) );
		$classes    = [];
		$ext_regexp = \defined( 'HHVM_VERSION' ) ? '/\\.(?:php|hh)$/' : '/\\.php$/';
		$prefix_len = null;
		foreach ( $this->glob( $pattern, true, $resource ) as $path => $info ) {
			if ( $prefix_len === null ) {
				$prefix_len = \strlen( $resource->getPrefix() );

				if ( $exclude_prefix && \strpos( $exclude_prefix, $resource->getPrefix() ) !== 0 ) {
					throw new InvalidArgumentException( \sprintf( 'Invalid "exclude" pattern when importing classes for "%s": make sure your "exclude" pattern (%s) is a subset of the "resource" pattern (%s)', $namespace, $excludePattern, $pattern ) );
				}
			}

			// Normalize Windows slashes.
			$path = $this->normalize_slashes( $path );

			if ( isset( $exclude_paths[ $path ] ) ) {
				continue;
			}

			if ( ! \preg_match( $ext_regexp, $path, $m ) || ! $info->isReadable() ) {
				continue;
			}
			$class = $this->getClassFromClassMap( $path );

			if ( ! $class || ! \preg_match( '/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*+(?:\\\\[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*+)*+$/', $class ) ) {
				continue;
			}

			try {
				$r = $this->container->getReflectionClass( $class );
			} catch ( ReflectionException $e ) {
				$classes[ $class ] = \sprintf(
					'While discovering services from namespace "%s", an error was thrown when processing the class "%s": "%s".',
					$namespace,
					$class,
					$e->getMessage()
				);
				continue;
			}
			// Check to make sure the expected class exists.
			if ( ! $r ) {
				throw new InvalidArgumentException( \sprintf( 'Expected to find class "%s" in file "%s" while importing services from resource "%s", but it was not found! Check the namespace prefix used with the resource.', $class, $path, $pattern ) );
			}

			if ( $r->isInstantiable() || $r->isInterface() ) {
				$classes[ $class ] = null;
			}
		}

		// Track only for new & removed files.
		if ( $resource instanceof GlobResource ) {
			$this->container->addResource( $resource );
		}
		else {
			foreach ( $resource as $path ) {
				$this->container->fileExists( $path, false );
			}
		}

		return $classes;
	}

	// phpcs:enable WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase

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
