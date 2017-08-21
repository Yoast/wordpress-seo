<?php
/**
 * @package WPSEO\Admin\Export
 */

/**
 * Class WPSEO_Export_Keywords_CSV
 *
 * Exports data as returned by WPSEO_Export_Keywords_Presenter to CSV.
 */
class WPSEO_Export_Keywords_CSV {

	/**
	 * Exports the supplied keyword query to a CSV string.
	 *
	 * @param array $data    An array of results from WPSEO_Export_Keywords_Query::get_data.
	 * @param array $columns An array of columns that should be presented.
	 *
	 * @return string A CSV string.
	 */
	public function export( $data, $columns ) {
		$csv = $this->get_headers( $columns );

		foreach ( $data as $result ) {
			$csv .= $this->format( $result, $columns );
		}

		return $csv;
	}

	/**
	 * Returns the CSV headers based on the queried columns.
	 *
	 * @param array $columns The columns as returned from WPSEO_Export_Keywords_Query::get_columns.
	 *
	 * @return string A line of CSV.
	 */
	protected function get_headers( $columns ) {
		$csv = $this->sanitize_csv_column( __( 'ID', 'wordpress-seo' ) );

		if ( in_array( 'post_title', $columns, true ) ) {
			$csv .= ',' . $this->sanitize_csv_column( __( 'post title', 'wordpress-seo' ) );
		}

		if ( in_array( 'post_url', $columns, true ) ) {
			$csv .= ',' . $this->sanitize_csv_column( __( 'post url', 'wordpress-seo' ) );
		}

		if ( in_array( 'seo_score', $columns, true ) ) {
			$csv .= ',' . $this->sanitize_csv_column( __( 'seo score', 'wordpress-seo' ) );
		}

		if ( in_array( 'keywords', $columns, true ) ) {
			$csv .= ',' . $this->sanitize_csv_column( __( 'keyword', 'wordpress-seo' ) );
		}

		if ( in_array( 'keywords_score', $columns, true ) ) {
			$csv .= ',' . $this->sanitize_csv_column( __( 'keyword score', 'wordpress-seo' ) );
		}

		return $csv;
	}

	/**
	 * Formats a WPSEO_Export_Keywords_Query result as a CSV line.
	 * In case of multiple keywords it will return multiple lines.
	 *
	 * @param array $result  A result as returned from WPSEO_Export_Keywords_Query::get_data.
	 * @param array $columns The columns as returned from WPSEO_Export_Keywords_Query::get_columns.
	 *
	 * @return string A line of CSV, beginning with EOL.
	 */
	protected function format( $result, $columns ) {
		// If our input is malformed return an empty string.
		if ( ! is_array( $result ) || ! array_key_exists( 'ID', $result ) ) {
			return '';
		}

		// Ensure we have arrays in the keywords.
		$result['keywords'] = $this->get_array_from_result( $result, 'keywords' );
		$result['keywords_score'] = $this->get_array_from_result( $result, 'keywords_score' );

		$csv = '';

		// Add at least one row plus additional ones if we have more keywords.
		for ( $keywords_index = 0; $keywords_index < max( 1, count( $result['keywords'] ) ); $keywords_index++ ) {
			$csv .= PHP_EOL . $this->sanitize_csv_column( $result['ID'] );

			foreach ( $columns as $column ) {
				if ( ! is_string( $column ) ) {
					continue;
				}
				$csv .= $this->get_csv_column_from_result( $result, $column, $keywords_index );
			}
		}

		return $csv;
	}

	/**
	 * Returns a CSV column, including comma, from the result object based on the specified key
	 *
	 * @param array  $result         The result object.
	 * @param string $key            The key of the value to get the CSV column for.
	 * @param int    $keywords_index The number keyword to output.
	 *
	 * @return string
	 */
	protected function get_csv_column_from_result( $result, $key, $keywords_index ) {
		switch ( $key ) {
			case 'post_title':
			case 'post_url':
			case 'seo_score':
				return $this->get_csv_string_column_from_result( $result, $key );
			case 'keywords':
			case 'keywords_score':
				return $this->get_csv_array_column_from_result( $result, $key, $keywords_index );
		}
		return '';
	}

	/**
	 * Returns an array from the result object.
	 *
	 * @param array  $result The result object.
	 * @param string $key    The key of the array to retrieve.
	 *
	 * @return array
	 */
	protected function get_array_from_result( $result, $key ) {
		if ( array_key_exists( $key , $result ) && is_array( $result[ $key ] ) ) {
			return $result[ $key ];
		}

		return array();
	}

	/**
	 * Returns a CSV column, including comma, from the result object by the specified key.
	 * Expects the value to be a string.
	 *
	 * @param array  $result The result object to get the CSV column from.
	 * @param string $key    The key of the value to get the CSV column for.
	 *
	 * @return string A CSV column including comma.
	 */
	protected function get_csv_string_column_from_result( $result, $key ) {
		if ( is_array( $result ) && is_string( $key ) && array_key_exists( $key, $result ) ) {
			return ',' . $this->sanitize_csv_column( $result[ $key ] );
		}

		return ',';
	}

	/**
	 * Returns a CSV column, including comma, from the result object by the specified key.
	 * Expects the value to be inside an array.
	 *
	 * @param array  $result The result object to get the CSV column from.
	 * @param string $key    The key of the array to get the CSV column for.
	 * @param int    $index  The index of the value in the array.
	 *
	 * @return string
	 */
	protected function get_csv_array_column_from_result( $result, $key, $index ) {
		if ( $index < count( $result[ $key ]  ) ) {
			return ',' . $this->sanitize_csv_column( $result[ $key ][ $index ] );
		}

		return ',';
	}

	/**
	 * Sanitizes a value to be output as a CSV value.
	 *
	 * @param string $value The value to sanitize.
	 *
	 * @return string The sanitized value.
	 */
	protected function sanitize_csv_column( $value ) {
		// Return an empty string if value is null.
		if ( is_null( $value ) ) {
			return '';
		}

		// Convert non-string values to strings.
		if ( ! is_string( $value ) ) {
			$value = var_export( $value, true );
		}

		// Replace all whitespace with spaces because Excel can't deal with newlines and tabs even if escaped.
		$value = preg_replace( '/\s/', ' ', $value );

		// Escape double quotes.
		$value = str_replace( '"', '""', $value );

		// Return the value enclosed in double quotes.
		return '"' . $value . '"';
	}
}
