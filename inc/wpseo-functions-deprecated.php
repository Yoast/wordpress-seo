<?php
/**
 * @package WPSEO\Deprecated
 */

/**
 * Remove the bulk edit capability from the proper default roles.
 *
 * Contributor is still removed for legacy reasons.
 *
 * @deprecated 5.5
 */
function wpseo_remove_capabilities() {
	_deprecated_function( __FUNCTION__, 'WPSEO 5.5.0', 'WPSEO_Capability_Manager_Factory::get()->remove()' );

	WPSEO_Capability_Manager_Factory::get()->remove();
}

/**
 * Add the bulk edit capability to the proper default roles.
 *
 * @deprecated 5.5.0
 */
function wpseo_add_capabilities() {
	_deprecated_function( __FUNCTION__, 'WPSEO 5.5.0', 'WPSEO_Capability_Manager_Factory::get()->add()' );

	WPSEO_Capability_Manager_Factory::get()->add();
}
