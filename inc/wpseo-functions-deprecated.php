<?php
/**
 * WPSEO plugin file.
 *
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

/**
 * Adds help tabs.
 *
 * @deprecated 7.6.0
 *
 * @param array $tabs Current help center tabs.
 *
 * @return array List containing all the additional tabs.
 */
function yoast_add_meta_options_help_center_tabs( $tabs ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.6.0', 'WPSEO_Help_Center_Template_Variables_Tab::add_meta_options_help_center_tabs' );

	return $tabs;
}

/**
 * Adds template variables to the help center.
 *
 * @deprecated 7.6.0
 *
 * @return string The content for the template variables tab.
 */
function wpseo_add_template_variables_helpcenter() {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.6.0' );

	return '';
}
