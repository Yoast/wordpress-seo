<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Capability_Manager_Double extends WPSEO_Abstract_Capability_Manager {

	/**
	 * Adds the registered capabilities to the system.
	 */
	public function add() {

	}

	/**
	 * Removes the registered capabilities from the system
	 */
	public function remove() {

	}

	public function get_registered_capabilities() {
		return $this->capabilities;
	}

	public function filter_roles( $capability, array $roles ) {
		return parent::filter_roles( $capability, $roles );
	}
}
