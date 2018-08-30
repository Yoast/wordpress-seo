<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Capabilities
 */

/**
 * Capability Manager Factory.
 */
class WPSEO_Capability_Manager_Factory {

	/**
	 * Returns the Manager to use.
	 *
	 * @return WPSEO_Capability_Manager Manager to use.
	 */
	public static function get() {
		static $manager = null;

		if ( $manager === null ) {
			if ( function_exists( 'wpcom_vip_add_role_caps' ) ) {
				$manager = new WPSEO_Capability_Manager_VIP();
			}

			if ( ! function_exists( 'wpcom_vip_add_role_caps' ) ) {
				$manager = new WPSEO_Capability_Manager_WP();
			}
		}

		return $manager;
	}
}
