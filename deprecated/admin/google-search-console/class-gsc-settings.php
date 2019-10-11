<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Settings.
 *
 * @deprecated 11.4
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Settings {

	/**
	 * Clear all data from the database.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @param WPSEO_GSC_Service $service Service class instance.
	 */
	public static function clear_data( WPSEO_GSC_Service $service ) {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Reloading all the issues.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 */
	public static function reload_issues() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * When authorization is successful return true, otherwise false.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public static function validate_authorization() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return null;
	}

	/**
	 * Get the GSC profile.
	 *
	 * @deprecated 11.4
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
