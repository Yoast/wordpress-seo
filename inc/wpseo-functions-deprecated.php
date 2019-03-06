<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Deprecated
 */

/**
 * Adds help tabs.
 *
 * @deprecated 7.6.0
 * @codeCoverageIgnore
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
 * @codeCoverageIgnore
 *
 * @return string The content for the template variables tab.
 */
function wpseo_add_template_variables_helpcenter() {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.6.0' );

	return '';
}
