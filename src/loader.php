<?php
/**
 * Loads everything.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free;

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
		foreach( $this->integrations as $class ) {
			$conditionals = $class::get_conditionals();
			foreach( $conditionals as $conditional ) {
				if ( ! $this->container->get( $conditional )->is_met() ) {
					continue 2;
				}
			}

			$this->container->get( $class )->register_hooks();
		}
		exit;
	}
}
