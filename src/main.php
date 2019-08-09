<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Loaders
 */

namespace Yoast\WP\Free;

use Yoast\WP\Free\Config\Dependency_Management;
use Yoast\WP\Free\Dependency_Injection\Container_Compiler;
use Yoast\WP\Free\Generated\Cached_Container;

if ( ! \defined( 'WPSEO_VERSION' ) ) {
	\header( 'Status: 403 Forbidden' );
	\header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

class Main {

	/**
	 * Initializes the plugin.
	 */
	public function initialize() {
		$dependency_management = new Dependency_Management();
		$dependency_management->initialize();
		$this->load();
	}

	/**
	 * Loads the plugin.
	 *
	 * @throws \Exception If loading fails and YOAST_ENVIRONMENT is development.
	 */
	public function load() {
		try {
			$container = $this->get_container();

			if ( ! $container ) {
				return;
			}

			$container->get( Loader::class )->load();
		} catch ( \Exception $e ) {
			if ( $this->is_development() ) {
				throw $e;
			}
			// Don't crash the entire site, simply don't load.
			// TODO: Add error notifications here.
		}
	}

	/**
	 * Loads the DI container.
	 *
	 * @return null|Cached_Container The DI container.
	 *
	 * @throws \Exception If something goes wrong generating the DI container.
	 */
	private function get_container() {
		if ( $this->is_development() && \class_exists( '\Yoast\WP\Free\Dependency_Injection\Container_Compiler' ) ) {
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

$main = new Main();
$main->initialize();

