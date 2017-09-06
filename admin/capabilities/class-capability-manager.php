<?php

interface WPSEO_Capability_Manager {
	/**
	 * Registers a capability.
	 *
	 * @param string $capability Capability to add.
	 * @param array  $roles      Roles to add the capability to.
	 */
	public function register( $capability, array $roles );

	/**
	 * Adds the registerd capabilities to the system.
	 */
	public function add();

	/**
	 * Removes the registered capabilities from the system
	 */
	public function remove();

	/**
	 * Returns the list of registered capabilities
	 *
	 * @return string[] List of registered capabilities
	 */
	public function get_capabilities();
}
