<?php
/**
 * @package WPSEO\Premium\Classes\Export
 */

/**
 * Class WPSEO_Export_Keywords_CSV
 *
 * Exports data as returned by WPSEO_Export_Keywords_Presenter to CSV.
 */
class WPSEO_Export_Keywords_CSV {

	/** @var array The columns that should be presented */
	protected $columns;

	/** @var array Data to be exported */
	protected $data = '';

	/**
	 * WPSEO_Export_Keywords_CSV constructor.
	 *
	 * Supported values for columns are 'title', 'url', 'keywords', 'seo_score' and 'keywords_score'.
	 * Requesting 'keywords_score' will always also return 'keywords'.
	 *
	 * @param array $columns An array of columns that should be presented.
	 */
	public function __construct( array $columns ) {
		$this->columns = array_filter( $columns, 'is_string' );
	}

	/**
	 * Exports the supplied keyword query to a CSV string.
	 *
	 * @return string CSV formatted data.
	 */
	public function export() {

		$csv = $this->get_headers();
		$csv .= $this->data;

		return $csv;
	}

	/**
	 * Adds a row to the data to be exported.
	 *
	 * @param array $row Row to add to the export.
	 *
	 * @return void
	 */
	public function add_row( array $row ) {
		$this->data .= $this->format( $row );
	}

	/**
	 * Returns the CSV headers based on the queried columns.
	 *
	 * @return string The headers in CSV format.
	 */
	protected function get_headers() {
		$header_columns = array(
			'title'          => __( 'title', 'wordpress-seo' ),
			'url'            => __( 'url', 'wordpress-seo' ),
			'seo_score'      => __( 'seo score', 'wordpress-seo' ),
			'keywords'       => __( 'keyword', 'wordpress-seo' ),
			'keywords_score' => __( 'keyword score', 'wordpress-seo' ),
		);

		$csv = $this->sanitize_csv_column( __( 'ID', 'wordpress-seo' ) );

		/** Translators: type represents the post_type of a post or the taxonomy of a term. */
		$csv .= ',' . $this->sanitize_csv_column( __( 'type', 'wordpress-seo' ) );

		foreach ( $this->columns as $column ) {
			if ( array_key_exists( $column, $header_columns ) ) {
				$csv .= ',' . $this->sanitize_csv_column( $header_columns[ $column ] );
			}
		}

		return $csv;
	}

	/**
	 * Formats a WPSEO_Export_Keywords_Query result as a CSV line.
	 * In case of multiple keywords it will return multiple lines.
	 *
	 * @param array $result A result as returned from WPSEO_Export_Keywords_Query::get_data.
	 *
	 * @return string A line of CSV, beginning with EOL.
	 */
	protected function format( array $result ) {
		// If our input is malformed return an empty string.
		if ( ! array_key_exists( 'ID', $result ) || ! array_key_exists( 'type', $result ) ) {
			return '';
		}

		// Ensure we have arrays in the keywords.
		$result['keywords']       = $this->get_array_from_result( $result, 'keywords' );
		$result['keywords_score'] = $this->get_array_from_result( $result, 'keywords_score' );

		$csv = '';

		// Add at least one row plus additional ones if we have more keywords.
		$keywords = max( 1, count( $result['keywords'] ) );
		for ( $keywords_index = 0; $keywords_index < $keywords; $keywords_index++ ) {
			// Add static columns.
			$csv .= PHP_EOL . $this->sanitize_csv_column( $result['ID'] );
			$csv .= ',' . $this->sanitize_csv_column( $result['type'] );

			// Add dynamic columns.
			foreach ( $this->columns as $column ) {
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
	 * @return string CSV formatted column.
	 */
	protected function get_csv_column_from_result( array $result, $key, $keywords_index ) {
		if ( in_array( $key, array( 'title', 'url', 'seo_score' ), true ) ) {
			return $this->get_csv_string_column_from_result( $result, $key );
		}

		if ( in_array( $key, array( 'keywords', 'keywords_score' ), true ) ) {
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
	 * @return array Contents of the key in the object.
	 */
	protected function get_array_from_result( array $result, $key ) {
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
	 * @return string A CSV formatted column.
	 */
	protected function get_csv_string_column_from_result( array $result, $key ) {
		if ( array_key_exists( $key, $result ) ) {
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
	 * @return string A CSV formatted column.
	 */
	protected function get_csv_array_column_from_result( array $result, $key, $index ) {
		// If the array has an element at $index.
		if ( $index < count( $result[ $key ] ) ) {
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
