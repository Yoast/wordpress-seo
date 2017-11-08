<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the utils for the admin.
 */
class WPSEO_Admin_Utils {

	/**
	 * Gets the install URL for the passed plugin slug.
	 *
	 * @param string $slug The slug to create an install link for.
	 *
	 * @return string The install URL. Empty string if the current user doesn't have the proper capabilities.
	 */
	public static function get_install_url( $slug ) {
		if ( ! current_user_can( 'install_plugins' ) ) {
			return '';
		}

		return wp_nonce_url(
			self_admin_url( 'update.php?action=install-plugin&plugin=' . dirname( $slug ) ),
			'install-plugin_' . dirname( $slug )
		);
	}

	/**
	 * Gets the activation URL for the passed plugin slug.
	 *
	 * @param string $slug The slug to create an activation link for.
	 *
	 * @return string The activation URL. Empty string if the current user doesn't have the proper capabilities.
	 */
	public static function get_activation_url( $slug ) {
		if ( ! current_user_can( 'install_plugins' ) ) {
			return '';
		}

		return wp_nonce_url(
			self_admin_url( 'plugins.php?action=activate&plugin_status=all&paged=1&s&plugin=' . $slug ),
			'activate-plugin_' . $slug
		);
	}
}
