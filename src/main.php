<?php

namespace Yoast\WP\SEO;

use Exception;
use Yoast\WP\SEO\Dependency_Injection\Container_Compiler;
use Yoast\WP\SEO\Generated\Cached_Container;
use Yoast\WP\SEO\Surfaces\Classes_Surface;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

if ( ! \defined( 'WPSEO_VERSION' ) ) {
	\header( 'Status: 403 Forbidden' );
	\header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Class Main.
 *
 * @property Classes_Surface $classes      The classes surface.
 * @property Meta_Surface    $meta         The meta surface.
 * @property Helpers_Surface $helpers      The helpers surface.
 */
class Main {

	/**
	 * The API namespace constant.
	 *
	 * @var string
	 */
	const API_V1_NAMESPACE = 'yoast/v1';

	/**
	 * The WP CLI namespace constant.
	 *
	 * @var string
	 */
	const WP_CLI_NAMESPACE = 'yoast';

	/**
	 * The DI container.
	 *
	 * @var Cached_Container|null
	 */
	private $container;

	/**
	 * Surface classes that provide our external interface.
	 *
	 * @var string[]
	 */
	private $surfaces = [
		'classes' => Classes_Surface::class,
		'meta'    => Meta_Surface::class,
		'helpers' => Helpers_Surface::class,
	];

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

			if ( ! $this->container ) {
				return;
			}

			$this->container->get( Loader::class )->load();
		} catch ( Exception $e ) {
			if ( $this->is_development() ) {
				throw $e;
			}
			// Don't crash the entire site, simply don't load.
			// TODO: Add error notifications here.
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
		if ( isset( $this->{$property} ) ) {
			$this->{$property} = $this->container->get( $this->surfaces[ $property ] );

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
	 * @return null|Cached_Container The DI container.
	 */
	private function get_container() {
		if ( $this->is_development() && \class_exists( '\Yoast\WP\SEO\Dependency_Injection\Container_Compiler' ) ) {
			// Exception here is unhandled as it will only occur in development.
			Container_Compiler::compile( $this->is_development() );
		}

		if ( \file_exists( __DIR__ . '/generated/container.php' ) ) {
			require_once __DIR__ . '/generated/container.php';

			return new Cached_Container();
		}

		return null;
	}

	/**
	 * Returns whether or not we're in an environment for Yoast development.
	 *
	 * @return bool Whether or not to load in development mode.
	 */
	private function is_development() {
		return \defined( 'YOAST_ENVIRONMENT' ) && \YOAST_ENVIRONMENT === 'development';
	}
}
