<?php
/**
 * Loads everything.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free;

use YoastSEO_Vendor\ORM;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

class Loader {

	protected $integrations = [];

	protected $container;

	public function __construct( ContainerInterface $container ) {
		$this->container = $container;
	}

	public function register_integration( $class ) {
		$this->integrations[] = $class;
	}

	/**
	 * @param string[] $classes The integration classes to load.
	 */
	public function load() {
		$this->configure_orm();

		foreach( $this->integrations as $class ) {
			$conditionals = $class::get_conditionals();
			foreach( $conditionals as $conditional ) {
				if ( ! $this->container->get( $conditional )->is_met() ) {
					continue 2;
				}
			}

			$this->container->get( $class )->register_hooks();
		}
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
