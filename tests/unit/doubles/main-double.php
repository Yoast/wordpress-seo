<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

use Yoast\WP\Lib\Dependency_Injection\Container_Registry;
use Yoast\WP\SEO\Main;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Main_Double.
 */
class Main_Double extends Main {

	/**
	 * Loads the DI container.
	 *
	 * @return ContainerInterface|null The DI container.
	 */
	public function get_container() {
		return parent::get_container();
	}

	/**
	 * Gets the name of the plugin.
	 *
	 * @return string The name.
	 */
	public function get_name() {
		return parent::get_name();
	}

	/**
	 * Loads the plugin.
	 *
	 * Overloaded to prevent the loader from being initialized.
	 *
	 * @return void
	 */
	public function load() {
		if ( $this->container ) {
			return;
		}
		try {
			$this->container = $this->get_container();
			Container_Registry::register( $this->get_name(), $this->container );
		} catch ( \Exception $e ) {
			return;
		}
	}
}
