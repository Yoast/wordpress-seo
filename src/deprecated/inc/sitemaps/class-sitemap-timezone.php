<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Class WPSEO_Sitemap_Timezone.
 *
 * @deprecated 12.8
 */
class WPSEO_Sitemap_Timezone {

	/**
	 * Format arbitrary UTC datetime string to desired form in site's time zone.
	 *
	 * @deprecated 12.8
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $datetime_string The input datetime string in UTC time zone.
	 * @param string $format          Date format to use.
	 *
	 * @return string
	 */
	public function format_date( $datetime_string, $format = 'c' ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.8', 'Date_Helper::format' );

		return YoastSEO()->helpers->date->format( $format );
	}

	/**
	 * Get the datetime object, in site's time zone, if the datetime string was valid
	 *
	 * @deprecated 12.8
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $datetime_string The datetime string in UTC time zone, that needs
	 *                                to be converted to a DateTime object.
	 *
	 * @return DateTime|null DateTime object in site's time zone.
	 */
	public function get_datetime_with_timezone( $datetime_string ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.8' );

		return null;
	}
}
