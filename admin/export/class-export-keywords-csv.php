<?php
/**
 * @package WPSEO\Admin\Export
 */

class WPSEO_Export_Keywords_CSV {

	/**
	 * Exports the supplied keyword query to a CSV string.
	 *
	 * @param WPSEO_Export_Keywords_Query $keywords_query The query to export to CSV.
	 *
	 * @return string A CSV string.
	 */
	public function export( $data, $columns ) {
		$csv = $this->get_headers( $columns );

		foreach( $data as $result ) {
			$csv .= $this->format( $result, $columns );
		}

		return $csv;
	}

	/**
	 * Returns the CSV headers based on the queried columns.
	 *
	 * @param array[int]string $columns  The columns as returned from WPSEO_Export_Keywords_Query::get_columns.
	 *
	 * @return string A line of CSV.
	 */
	protected function get_headers( $columns ) {
		$csv = $this->format_csv_column( __( 'ID' ) );

		if ( in_array( 'post_title', $columns, true ) ) {
			$csv .= ',' . $this->format_csv_column( __( 'post title', 'wordpress-seo' ) );
		}

		if ( in_array( 'post_url', $columns, true ) ) {
			$csv .= ',' . $this->format_csv_column( __( 'post url', 'wordpress-seo' ) );
		}

		if ( in_array( 'seo_score', $columns, true ) ) {
			$csv .= ',' . $this->format_csv_column( __( 'seo score', 'wordpress-seo' ) );
		}

		if ( in_array( 'keywords', $columns, true ) ) {
			$csv .= ',' . $this->format_csv_column( __( 'keyword', 'wordpress-seo' ) );
		}

		if ( in_array( 'keywords_score', $columns, true ) ) {
			$csv .= ',' . $this->format_csv_column( __( 'keyword score', 'wordpress-seo' ) );
		}

		return $csv;
	}

	/**
	 * Formats a WPSEO_Export_Keywords_Query result as a CSV line.
	 * In case of multiple keywords it will return multiple lines.
	 *
	 * @param array[string]string $result A result as returned from WPSEO_Export_Keywords_Query::get_data.
	 * @param array[int]string $columns The columns as returned from WPSEO_Export_Keywords_Query::get_columns.
	 *
	 * @return string A line of CSV, beginning with EOL.
	 */
	protected function format( $result, $columns ) {
		// If our input is malformed return an empty string.
		if ( ! is_array( $result) || ! array_key_exists( 'ID', $result ) || ! is_int( $result['ID'] ) ) {
			return '';
		}

		$keywords = array();
		if ( array_key_exists( 'keywords' , $result ) && is_array( $result['keywords'] ) ) {
			$keywords = $result['keywords'];
		}
		$keywords_score = array();
		if ( array_key_exists( 'keywords_score' , $result ) && is_array( $result['keywords_score'] ) ) {
			$keywords_score = $result['keywords_score'];
		}

		$csv = '';

		// Add at least one row plus additional ones if we have more keywords.
		do {
			$csv .= PHP_EOL . $this->format_csv_column( $result['ID'] );

			if ( in_array( 'post_title', $columns, true ) && array_key_exists( 'post_title', $result ) ) {
				$csv .= ',' . $this->format_csv_column( $result['post_title'] );
			}

			if ( in_array( 'post_url', $columns, true ) && array_key_exists( 'post_url', $result ) ) {
				$csv .= ',' . $this->format_csv_column( $result['post_url'] );
			}

			if ( in_array( 'seo_score', $columns, true ) && array_key_exists( 'seo_score', $result ) ) {
				$csv .= ',' . $this->format_csv_column( $result['seo_score'] );
			}

			if ( in_array( 'keywords', $columns, true ) ) {
				$csv .= ',' . $this->format_csv_column( array_shift( $keywords ) );
			}

			if ( in_array( 'keywords_score', $columns, true ) ) {
				$csv .= ',' . $this->format_csv_column( array_shift( $keywords_score ) );
			}
		} while( count( $keywords ) > 0 );

		return $csv;
	}

	/**
	 * Surrounds a value with double quotes and escapes existing double quotes.
	 *
	 * @param string $value The value to sanitize.
	 *
	 * @return string The sanitized value.
	 */
	protected function format_csv_column( $value ) {
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
