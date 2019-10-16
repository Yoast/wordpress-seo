<?php
/**
 * A helper object for dates.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\Free\Helpers;


/**
 * Class Date_Helper
 */
class Date_Helper {
	/**
	 * Convert given date string to the W3C format.
	 *
	 * If $translate is true then the given date and format string will
	 * be passed to date_i18n() for translation.
	 *
	 * @param string $date      Date string to convert.
	 * @param bool   $translate Whether the return date should be translated. Default false.
	 *
	 * @return string Formatted date string.
	 */
	public function mysql_date_to_w3c_format( $date, $translate = false ) {
		return \mysql2date( DATE_W3C, $date, $translate );
	}
}
