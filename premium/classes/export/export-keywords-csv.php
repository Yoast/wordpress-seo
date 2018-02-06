<?php
/**
 * WPSEO Premium plugin file.
 *
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
	 * Supported values for columns are 'title', 'url', 'keywords', 'readability_score' and 'keywords_score'.
	 * Requesting 'keywords_score' will always also return 'keywords'.
	 *
	 * @param array $columns An array of columns that should be presented.
	 */
	public function __construct( array $columns ) {
		$this->columns = array_filter( $columns, 'is_string' );
	}

	/**
	 * Echoes the CSV headers
	 */
	public function print_headers() {
		echo $this->get_headers();
	}

	/**
	 * Echoes a formatted row.
	 *
	 * @param array $row Row to add to the export.
	 *
	 * @return void
	 */
	public function print_row( $row ) {
		echo $this->format( $row );
	}

	/**
	 * Returns the CSV headers based on the queried columns.
	 *
	 * @return string The headers in CSV format.
	 */
	protected function get_headers() {
		$header_columns = array(
			'title'             => esc_html__( 'title', 'wordpress-seo-premium' ),
			'url'               => esc_html__( 'url', 'wordpress-seo-premium' ),
			'readability_score' => esc_html__( 'readability score', 'wordpress-seo-premium' ),
			'keywords'          => esc_html__( 'keyword', 'wordpress-seo-premium' ),
			'keywords_score'    => esc_html__( 'keyword score', 'wordpress-seo-premium' ),
			'seo_title'         => esc_html__( 'seo title', 'wordpress-seo-premium' ),
			'meta_description'  => esc_html__( 'meta description', 'wordpress-seo-premium' ),
		);

		$csv  = $this->sanitize_csv_column( esc_html__( 'ID', 'wordpress-seo-premium' ) );
		$csv .= ',' . $this->sanitize_csv_column( esc_html_x( 'type', 'post_type of a post or the taxonomy of a term', 'wordpress-seo-premium' ) );

		foreach ( $this->columns as $column ) {
			if ( array_key_exists( $column, $header_columns ) ) {
				$csv .= ',' . $this->sanitize_csv_column( $header_columns[ $column ] );
			}
		}

		$csv .= PHP_EOL;

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
		for ( $keywords_index = 0; $keywords_index < $keywords; $keywords_index ++ ) {
			// Add static columns.
			$csv .= $this->sanitize_csv_column( $result['ID'] );
			$csv .= ',' . $this->sanitize_csv_column( $result['type'] );

			// Add dynamic columns.
			foreach ( $this->columns as $column ) {
				$csv .= $this->get_csv_column_from_result( $result, $column, $keywords_index );
			}

			$csv .= PHP_EOL;
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
		if ( in_array( $key, array( 'title', 'url', 'seo_title', 'meta_description', 'readability_score' ), true ) ) {
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
		if ( array_key_exists( $key, $result ) && is_array( $result[ $key ] ) ) {
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
		if ( $value === null ) {
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
