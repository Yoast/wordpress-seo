<?php

namespace Yoast\WP\Lib;

use Exception;
use Yoast\WP\Lib\Dependency_Injection\Container_Registry;
use Yoast\WP\SEO\Loader;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Abstract class to extend for the main class in a plugin.
 */
abstract class Abstract_Main {

	/**
	 * The DI container.
	 *
	 * @var ContainerInterface|null
	 */
	private $container;

	/**
	 * Loads the plugin.
	 *
	 * @throws Exception If loading fails and YOAST_ENVIRONMENT is development.
	 */
	public function load() {
		if ( $this->container ) {
			return;
		}

		try {
			$this->container = $this->get_container();
			Container_Registry::register( $this->get_name(), $this->container );

			if ( ! $this->container ) {
				return;
			}
			if ( ! $this->container->has( Loader::class ) ) {
				return;
			}

			$this->container->get( Loader::class )->load();
		} catch ( Exception $e ) {
			if ( $this->is_development() ) {
				throw $e;
			}
			// Don't crash the entire site, simply don't load.
		}
	}

	/**
	 * Magic getter for retrieving a property.
	 *
	 * @param string $property The property to retrieve.
	 *
	 * @throws Exception When the property doesn't exist.
	 *
	 * @return string The value of the property.
	 */
	public function __get( $property ) {
		$surfaces = $this->get_surfaces();

		if ( isset( $surfaces[ $property ] ) ) {
			$this->{$property} = $this->container->get( $surfaces[ $property ] );

			return $this->{$property};
		}
		throw new Exception( "Property $property does not exist." );
	}

	/**
	 * Checks if the given property exists as a surface.
	 *
	 * @param string $property The property to retrieve.
	 *
	 * @return bool True when property is set.
	 */
	public function __isset( $property ) {
		return isset( $this->surfaces[ $property ] );
	}

	/**
	 * Loads the DI container.
	 *
	 * @throws Exception If something goes wrong generating the DI container.
	 *
	 * @return null|ContainerInterface The DI container.
	 */
	abstract protected function get_container();

	/**
	 * Gets the name of the plugin.
	 *
	 * @return string The name.
	 */
	abstract protected function get_name();

	/**
	 * Gets the surfaces of this plugin.
	 *
	 * @return array A mapping of surface name to the responsible class.
	 */
	abstract protected function get_surfaces();

	/**
	 * Returns whether or not we're in an environment for Yoast development.
	 *
	 * @return bool Whether or not to load in development mode.
	 */
	protected function is_development() {
		return \defined( 'YOAST_ENVIRONMENT' ) && \YOAST_ENVIRONMENT === 'development';
	}
}
