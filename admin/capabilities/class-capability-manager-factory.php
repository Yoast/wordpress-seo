<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

class WPSEO_Capability_Manager_Factory {
	/**
	 * Returns the Manager to use.
	 *
	 * @return WPSEO_Capability_Manager
	 */
	public static function get() {
		static $manager = null;

		if ( null === $manager ) {
			if ( function_exists( 'wpcom_vip_add_role_caps' ) ) {
				$manager = new WPSEO_Capability_Manager_VIP();
			} else {
				$manager = new WPSEO_Capability_Manager_WP();
			}
		}

		return $manager;
	}
}
