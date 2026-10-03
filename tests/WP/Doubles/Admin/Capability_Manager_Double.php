<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Admin;

use WPSEO_Abstract_Capability_Manager;

/**
 * Test Helper Class.
 */
final class Capability_Manager_Double extends WPSEO_Abstract_Capability_Manager {

	/**
	 * Adds the registered capabilities to the system.
	 *
	 * @return void
	 */
	public function add() {}

	/**
	 * Removes the registered capabilities from the system.
	 *
	 * @return void
	 */
	public function remove() {}

	public function get_registered_capabilities() {
		return $this->capabilities;
	}

	public function filter_roles( $capability, array $roles ) {
		return parent::filter_roles( $capability, $roles );
	}
}
