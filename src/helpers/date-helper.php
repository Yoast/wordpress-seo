<?php
/**
 * A helper object for dates.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;


/**
 * Class Date_Helper
 */
class Date_Helper {

	/**
	 * The date helper.
	 *
	 * @var \WPSEO_Date_Helper
	 */
	protected $date;

	/**
	 * Date_Helper constructor.
	 *
	 * @codeCoverageIgnore It only sets dependencies.
	 */
	public function __construct() {
		$this->date = new \WPSEO_Date_Helper();
	}

	/**
	 * Convert given date string to the W3C format.
	 *
	 * If $translate is true then the given date and format string will
	 * be passed to date_i18n() for translation.
	 *
	 * @param string $date      Date string to convert.
	 * @param bool   $translate Whether the return date should be translated. Default false.
	 *
	 * @codeCoverageIgnore It just wraps an external function.
	 *
	 * @return string Formatted date string.
	 */
	public function mysql_date_to_w3c_format( $date, $translate = false ) {
		return \mysql2date( DATE_W3C, $date, $translate );
	}

	/**
	 * Formats a given date in UTC TimeZone format.
	 *
	 * @param string $date   String representing the date / time.
	 * @param string $format The format that the passed date should be in.
	 *
	 * @codeCoverageIgnore - We have to write test when this method contains own code.
	 *
	 * @return string The formatted date.
	 */
	public function format( $date, $format = DATE_W3C ) {
		return $this->date->format( $date, $format );
	}
}
