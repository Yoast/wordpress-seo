<?php
/**
 * Date helper class.
 *
 * @package WPSEO\Internals
 */

/**
 * Class WPSEO_Date_Helper
 *
 * Note: Move this class with namespace to the src/helpers directory and add a class_alias for BC.
 */
class WPSEO_Date_Helper {

	/**
	 * Formats a given date in UTC TimeZone format.
	 *
	 * @param string $date   String representing the date / time.
	 * @param string $format The format that the passed date should be in.
	 *
	 * @return string The formatted date.
	 */
	public function format( $date, $format = DATE_W3C ) {
		$immutable_date = date_create_immutable_from_format( 'Y-m-d H:i:s', $date, new DateTimeZone( 'UTC' ) );

		if ( ! $immutable_date ) {
			return $date;
		}

		return $immutable_date->format( $format );
	}

	/**
	 * Formats a given date in UTC TimeZone format and translate it to the set language.
	 *
	 * @param string $date   String representing the date / time.
	 * @param string $format The format that the passed date should be in.
	 *
	 * @return string The formatted and translated date.
	 */
	public function format_translated( $date, $format = DATE_W3C ) {
		return date_i18n( $format, $this->format( $date, 'U' ) );
	}
}
