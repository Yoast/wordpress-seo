<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Export_Keywords_CSV_Double extends WPSEO_Export_Keywords_CSV {

	/**
	 * Returns the CSV headers based on the queried columns.
	 *
	 * @return string The headers in CSV format.
	 */
	public function return_get_headers() {
		return $this->get_headers();
	}

	/**
	 * Formats a WPSEO_Export_Keywords_Query result as a CSV line.
	 * In case of multiple keywords it will return multiple lines.
	 *
	 * @param array $result A result as returned from WPSEO_Export_Keywords_Query::get_data.
	 *
	 * @return string A line of CSV, beginning with EOL.
	 */
	public function return_format( $result ) {
		return $this->format( $result );
	}

	/**
	 * Sanitizes a value to be output as a CSV value.
	 *
	 * @param string $value The value to sanitize.
	 *
	 * @return string The sanitized value.
	 */
	public function return_format_csv_column( $value ) {
		return $this->sanitize_csv_column( $value );
	}

	/**
	 * Returns a CSV column, including comma, from the result object by the specified key.
	 * Expects the value to be a string.
	 *
	 * @param array  $result The result object to get the CSV column from.
	 * @param string $key    The key of the value to get the CSV column for.
	 *
	 * @return string A CSV formatted column.
	 */
	public function return_get_csv_column_from_result( $result, $key ) {
		return $this->get_csv_string_column_from_result( $result, $key );
	}

	/**
	 * Returns a CSV column, including comma, from the result object by the specified key.
	 * Expects the value to be inside an array.
	 *
	 * @param array  $result The result object to get the CSV column from.
	 * @param string $key    The key of the array to get the CSV column for.
	 * @param int    $index  The index of the value in the array.
	 *
	 * @return string A CSV formatted column.
	 */
	public function return_get_csv_array_column_from_result( $result, $key, $index ) {
		return $this->get_csv_array_column_from_result( $result, $key, $index );
	}
}
