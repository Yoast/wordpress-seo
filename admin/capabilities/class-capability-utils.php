<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Capabilities
 */

/**
 * Capability Utils collection.
 */
class WPSEO_Capability_Utils {

	/**
	 * Checks if the user has the proper capabilities.
	 *
	 * @param string $capability Capability to check.
	 *
	 * @return bool True if the user has the proper rights.
	 */
	public static function current_user_can( $capability ) {
		if ( $capability === 'wpseo_manage_options' ) {
			return self::has( $capability );
		}

		return self::has_any( [ 'wpseo_manage_options', $capability ] );
	}

	/**
	 * Checks if the current user has at least one of the supplied capabilities.
	 *
	 * @param array $capabilities Capabilities to check against.
	 *
	 * @return bool True if the user has at least one capability.
	 */
	protected static function has_any( array $capabilities ) {
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
	protected static function has( $capability ) {
		return current_user_can( $capability );
	}
}
