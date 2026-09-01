<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Initializes the admin bar.
 *
 * @return void
 */
function wpseo_initialize_admin_bar() {
	$admin_bar_menu = new WPSEO_Admin_Bar_Menu();
	$admin_bar_menu->register_hooks();
}
add_action( 'wp_loaded', 'wpseo_initialize_admin_bar' );

/**
 * Allows editing of the meta fields through weblog editors like Marsedit.
 *
 * @param array $required_capabilities Capabilities that must all be true to allow action.
 * @param array $capabilities          Array of capabilities to be checked, unused here.
 * @param array $args                  List of arguments for the specific capabilities to be checked.
 *
 * @return array Filtered capabilities.
 */
function allow_custom_field_edits( $required_capabilities, $capabilities, $args ) {
	if ( ! in_array( $args[0], [ 'edit_post_meta', 'add_post_meta' ], true ) ) {
		return $required_capabilities;
	}

	// If this is provided, it is the post ID.
	if ( empty( $args[2] ) ) {
		return $required_capabilities;
	}

	// If this is provided, it is the custom field.
	if ( empty( $args[3] ) ) {
		return $required_capabilities;
	}

	// If the meta key is not part of the plugin, or the user cannot edit the post, bail.
	if ( strpos( $args[3], WPSEO_Meta::$meta_prefix ) !== 0 || ! current_user_can( 'edit_post', $args[2] ) ) {
		return $required_capabilities;
	}

	// When advanced/schema fields are restricted, do not grant write access to them for users lacking the capability.
	if ( WPSEO_Options::get( 'disableadvanced_meta' ) && ! WPSEO_Capability_Utils::current_user_can( 'wpseo_edit_advanced_metadata' ) ) {
		$field_info = WPSEO_Meta::$fields_index[ $args[3] ] ?? null;
		if ( $field_info && in_array( $field_info['subset'], [ 'advanced', 'schema' ], true ) ) {
			return $required_capabilities;
		}
	}

	$required_capabilities[ $args[0] ] = true;

	return $required_capabilities;
}

add_filter( 'user_has_cap', 'allow_custom_field_edits', 0, 3 );
