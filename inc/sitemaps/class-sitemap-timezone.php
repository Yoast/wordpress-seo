<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Class WPSEO_Sitemap_Timezone
 */
class WPSEO_Sitemap_Timezone {

	/**
	 * Holds the timezone string value to reuse for performance
	 *
	 * @var string $timezone_string
	 */
	private $timezone_string = '';

	/**
	 * Format arbitrary UTC datetime string to desired form in site's time zone.
	 *
	 * @param string $datetime_string The input datetime string in UTC time zone.
	 * @param string $format          Date format to use.
	 *
	 * @return string
	 */
	public function format_date( $datetime_string, $format = 'c' ) {

		$date_time = $this->get_datetime_with_timezone( $datetime_string );

		if ( is_null( $date_time ) ) {
			return '';
		}

		return $date_time->format( $format );
	}
	/**
	 * Get the datetime object, in site's time zone, if the datetime string was valid
	 *
	 * @param string $datetime_string The datetime string in UTC time zone, that needs to be converted to a DateTime object.
	 *
	 * @return DateTime|null in site's time zone
	 */
	public function get_datetime_with_timezone( $datetime_string ) {

		static $utc_timezone, $local_timezone;

		if ( ! isset( $utc_timezone ) ) {
			$utc_timezone   = new DateTimeZone( 'UTC' );
			$local_timezone = new DateTimeZone( $this->get_timezone_string() );
		}

		if ( ! empty( $datetime_string ) && WPSEO_Utils::is_valid_datetime( $datetime_string ) ) {
			$datetime = new DateTime( $datetime_string, $utc_timezone );
			$datetime->setTimezone( $local_timezone );

			return $datetime;
		}

		return null;
	}

	/**
	 * Returns the timezone string for a site, even if it's set to a UTC offset
	 *
	 * Adapted from http://www.php.net/manual/en/function.timezone-name-from-abbr.php#89155
	 *
	 * @return string valid PHP timezone string
	 */
	private function determine_timezone_string() {

		// If site timezone string exists, return it.
		if ( $timezone = get_option( 'timezone_string' ) ) {
			return $timezone;
		}

		// Get UTC offset, if it isn't set then return UTC.
		if ( 0 === ( $utc_offset = get_option( 'gmt_offset', 0 ) ) ) {
			return 'UTC';
		}

		// Adjust UTC offset from hours to seconds.
		$utc_offset *= HOUR_IN_SECONDS;

		// Attempt to guess the timezone string from the UTC offset.
		$timezone = timezone_name_from_abbr( '', $utc_offset );

		if ( false !== $timezone ) {
			return $timezone;
		}

		// Last try, guess timezone string manually.
		foreach ( timezone_abbreviations_list() as $abbr ) {
			foreach ( $abbr as $city ) {
				if ( $city['offset'] == $utc_offset ) {
					return $city['timezone_id'];
				}
			}
		}

		// Fallback to UTC.
		return 'UTC';
	}

	/**
	 * Returns the correct timezone string
	 *
	 * @return string
	 */
	private function get_timezone_string() {
		if ( '' == $this->timezone_string ) {
			$this->timezone_string = $this->determine_timezone_string();
		}

		return $this->timezone_string;
	}
}
