<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Settings.
 *
 * @deprecated 12.5
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Settings {

	/**
	 * Clear all data from the database.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param WPSEO_GSC_Service $service Service class instance.
	 */
	public static function clear_data( WPSEO_GSC_Service $service ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Reloading all the issues.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 */
	public static function reload_issues() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * When authorization is successful return true, otherwise false.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public static function validate_authorization() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return null;
	}

	/**
	 * Get the GSC profile.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public static function get_profile() {
		// Get option.
		$option = get_option( 'wpseo-gsc', array( 'profile' => '' ) );

		// Set the profile.
		$profile = '';
		if ( ! empty( $option['profile'] ) ) {
			$profile = $option['profile'];
		}

		// Return the profile.
		return trim( $profile, '/' );
	}
}
