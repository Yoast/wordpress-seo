<?php
/**
 * @package WPSEO\Admin\Roles
 */

/**
 * Role Manager Factory.
 */
class WPSEO_Role_Manager_Factory {
	/**
	 * Retrieves the Role manager to use.
	 *
	 * @return WPSEO_Role_Manager
	 */
	public static function get() {
		static $manager = null;

		if ( $manager === null ) {
			if ( function_exists( 'wpcom_vip_add_role' ) ) {
				$manager = new WPSEO_Role_Manager_VIP();
			}

			if ( ! function_exists( 'wpcom_vip_add_role' ) ) {
				$manager = new WPSEO_Role_Manager_WP();
			}
		}

		return $manager;
	}
}
