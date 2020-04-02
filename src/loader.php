<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\WP\SEO
 */

namespace Yoast\WP\SEO;

use Yoast\WP\SEO\Commands\Command_Interface;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class that manages loading integrations if and only if all their conditionals are met.
 */
class Loader {

	/**
	 * The registered integrations.
	 *
	 * @var Integration_Interface[]
	 */
	protected $integrations = [];

	/**
	 * The registered initializers.
	 *
	 * @var Integration_Interface[]
	 */
	protected $initializers = [];

	/**
	 * The registered commands.
	 *
	 * @var Command_Interface[]
	 */
	protected $commands = [];

	/**
	 * The dependency injection container.
	 *
	 * @var \YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface
	 */
	protected $container;

	/**
	 * Loader constructor.
	 *
	 * @param \YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface $container The dependency injection container.
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
	 * Loads all registered classes if their conditionals are met.
	 *
	 * @return void
	 */
	public function load() {
		$this->load_initializers();
		$this->load_integrations();

		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			$this->load_commands();
		}
	}

	/**
	 * Loads all registered commands.
	 *
	 * @return void
	 */
	protected function load_commands() {
		foreach ( $this->commands as $command ) {
			$command = $this->container->get( $command );

			\WP_CLI::add_command( $command->get_name(), [ $command, 'execute' ], $command->get_config() );
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
	protected function load_integrations() {
		foreach ( $this->integrations as $class ) {
			if ( ! $this->conditionals_are_met( $class ) ) {
				continue;
			}

			$this->container->get( $class )->register_hooks();
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
