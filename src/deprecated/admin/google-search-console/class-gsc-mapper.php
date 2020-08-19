<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Mapper.
 *
 * @deprecated 12.5
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Mapper {

	/**
	 * If there is no platform, just get the first key out of the array and redirect to it.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 *
	 * @return mixed
	 */
	public static function get_current_platform( $platform ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Mapping the platform.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 *
	 * @return mixed
	 */
	public static function platform_to_api( $platform ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Mapping the given platform by value and return its key.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 *
	 * @return string
	 */
	public static function platform_from_api( $platform ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return $platform;
	}

	/**
	 * Mapping the given category by searching for its key.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $category Issue type.
	 *
	 * @return mixed
	 */
	public static function category_to_api( $category ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return $category;
	}

	/**
	 * Mapping the given category by value and return its key.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $category Issue type.
	 *
	 * @return string
	 */
	public static function category_from_api( $category ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return $category;
	}
}
