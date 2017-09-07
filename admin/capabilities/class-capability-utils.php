<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

class WPSEO_Capability_Utils {
	/**
	 * Checks if the user has the proper capabilities.
	 *
	 * @param string $capability Capability to check.
	 *
	 * @return bool True if the user has the proper rights.
	 */
	public static function can( $capability ) {
		if ( $capability === 'wpseo_manage_options' ) {
			return self::has( $capability );
		}

		return self::has_any( array( 'wpseo_manage_options', $capability ) );
	}

	/**
	 * Checks if the current user has at least one of the supplied capabilities.
	 *
	 * @param array $capabilities Capabilities to check against.
	 *
	 * @return bool True if the user has at least one capability.
	 */
	public static function has_any( array $capabilities ) {
		foreach ( $capabilities as $capability ) {
			if ( self::has( $capability ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Checks if the user has a certain capability.
	 *
	 * @param string $capability Capability to check against.
	 *
	 * @return bool True if the user has the capability.
	 */
	public static function has( $capability ) {
		return current_user_can( $capability );
	}
}
