<?php

namespace Yoast\WP\SEO;

use WP_CLI;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class that manages loading integrations if and only if all their conditionals are met.
 */
class Loader {

	/**
	 * The registered integrations.
	 *
	 * @var string[]
	 */
	protected $integrations = [];

	/**
	 * The registered integrations.
	 *
	 * @var string[]
	 */
	protected $initializers = [];

	/**
	 * The registered routes.
	 *
	 * @var string[]
	 */
	protected $routes = [];

	/**
	 * The registered commands.
	 *
	 * @var string[]
	 */
	protected $commands = [];

	/**
	 * The registered migrations.
	 *
	 * @var string[]
	 */
	protected $migrations = [];

	/**
	 * The dependency injection container.
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * Loader constructor.
	 *
	 * @param ContainerInterface $container The dependency injection container.
	 */
	public function __construct( ContainerInterface $container ) {
		$this->container = $container;
	}

	/**
	 * Registers an integration.
	 *
	 * @param string $class The class name of the integration to be loaded.
	 *
	 * @return void
	 */
	public function register_integration( $class ) {
		$this->integrations[] = $class;
	}

	/**
	 * Registers an initializer.
	 *
	 * @param string $class The class name of the initializer to be loaded.
	 *
	 * @return void
	 */
	public function register_initializer( $class ) {
		$this->initializers[] = $class;
	}

	/**
	 * Registers a route.
	 *
	 * @param string $class The class name of the route to be loaded.
	 *
	 * @return void
	 */
	public function register_route( $class ) {
		$this->routes[] = $class;
	}

	/**
	 * Registers a command.
	 *
	 * @param string $class The class name of the command to be loaded.
	 *
	 * @return void
	 */
	public function register_command( $class ) {
		$this->commands[] = $class;
	}

	/**
	 * Registers a migration.
	 *
	 * @param string $plugin  The plugin the migration belongs to.
	 * @param string $version The version of the migration.
	 * @param string $class   The class name of the migration to be loaded.
	 *
	 * @return void
	 */
	public function register_migration( $plugin, $version, $class ) {
		if ( ! \array_key_exists( $plugin, $this->migrations ) ) {
			$this->migrations[ $plugin ] = [];
		}

		$this->migrations[ $plugin ][ $version ] = $class;
	}

	/**
	 * Loads all registered classes if their conditionals are met.
	 *
	 * @return void
	 */
	public function load() {
		$this->load_initializers();

		if ( ! \did_action( 'init' ) ) {
			\add_action( 'init', [ $this, 'load_integrations' ] );
		}
		else {
			$this->load_integrations();
		}

		\add_action( 'rest_api_init', [ $this, 'load_routes' ] );

		if ( \defined( 'WP_CLI' ) && \WP_CLI ) {
			$this->load_commands();
		}
	}

	/**
	 * Returns all registered migrations.
	 *
	 * @param string $plugin The plugin to get the migrations for.
	 *
	 * @return string[]|false The registered migrations. False if no migrations were registered.
	 */
	public function get_migrations( $plugin ) {
		if ( ! \array_key_exists( $plugin, $this->migrations ) ) {
			return false;
		}

		return $this->migrations[ $plugin ];
	}

	/**
	 * Loads all registered commands.
	 *
	 * @return void
	 */
	protected function load_commands() {
		foreach ( $this->commands as $class ) {
			$command = $this->container->get( $class );

			WP_CLI::add_command( $class::get_namespace(), $command );
		}
	}

	/**
	 * Loads all registered initializers if their conditionals are met.
	 *
	 * @return void
	 */
	protected function load_initializers() {
		foreach ( $this->initializers as $class ) {
			if ( ! $this->conditionals_are_met( $class ) ) {
				continue;
			}

			$this->container->get( $class )->initialize();
		}
	}

	/**
	 * Loads all registered integrations if their conditionals are met.
	 *
	 * @return void
	 */
	public function load_integrations() {
		foreach ( $this->integrations as $class ) {
			if ( ! $this->conditionals_are_met( $class ) ) {
				continue;
			}

			$this->container->get( $class )->register_hooks();
		}
	}

	/**
	 * Loads all registered routes if their conditionals are met.
	 *
	 * @return void
	 */
	public function load_routes() {
		foreach ( $this->routes as $class ) {
			if ( ! $this->conditionals_are_met( $class ) ) {
				continue;
			}

			$this->container->get( $class )->register_routes();
		}
	}

	/**
	 * Checks if all conditionals of a given integration are met.
	 *
	 * @param Loadable_Interface $class The class name of the integration.
	 *
	 * @return bool Whether or not all conditionals of the integration are met.
	 */
	protected function conditionals_are_met( $class ) {
		$conditionals = $class::get_conditionals();
		foreach ( $conditionals as $conditional ) {
			if ( ! $this->container->get( $conditional )->is_met() ) {
				return false;
			}
		}

		return true;
	}
}
