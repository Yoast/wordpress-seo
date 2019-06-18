<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\WP\Free
 */

namespace Yoast\WP\Free;

use YoastSEO_Vendor\ORM;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class that manages loading integrations if and only if all their conditionals are met.
 */
class Loader {

	/**
	 * The registered integrations.
	 *
	 * @var \Yoast\WP\Free\WordPress\Integration[]
	 */
	protected $integrations = [];

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
	 * Loads all registered integrations if their conditionals are met.
	 *
	 * @return void
	 */
	public function load() {
		$this->configure_orm();

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
	 * @param \Yoast\WP\Free\WordPress\Integration $class The class name of the integration.
	 *
	 * @return bool Whether or not all conditionals of the integration are met.
	 */
	protected function conditionals_are_met( $class ) {
		$conditionals = $class::get_conditionals();
		foreach ( $conditionals as $conditional ) {
			if ( ! $this->container->get( $conditional )->is_met() ) {
				// Continue the integrations loop, the integration is not loaded and no further conditionals are checked.
				return false;
			}
		}

		return true;
	}

	/**
	 * Configures the ORM.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	protected function configure_orm() {
		ORM::configure( 'mysql:host=' . \DB_HOST . ';dbname=' . \DB_NAME );
		ORM::configure( 'username', \DB_USER );
		ORM::configure( 'password', \DB_PASSWORD );

		Yoast_Model::$auto_prefix_models = '\\Yoast\\WP\\Free\\Models\\';
	}
}
