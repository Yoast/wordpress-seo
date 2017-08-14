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
	public function export( WPSEO_Export_Keywords_Query $keywords_query ) {
		$csv = $this->get_headers( $keywords_query->get_columns() );

		foreach( $keywords_query->get_data() as $result ) {
			$csv .= $this->format( $result, $keywords_query->get_columns() );
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

		if ( in_array( 'post_title', $columns) ) {
			$csv .= ',' . $this->format_csv_column( __( 'post title', 'wordpress-seo' ) );
		}

		if ( in_array( 'post_url', $columns) ) {
			$csv .= ',' . $this->format_csv_column( __( 'post url', 'wordpress-seo' ) );
		}

		if ( in_array( 'seo_score', $columns) ) {
			$csv .= ',' . $this->format_csv_column( __( 'seo score', 'wordpress-seo' ) );
		}

		if ( in_array( 'keywords', $columns) ) {
			$csv .= ',' . $this->format_csv_column( __( 'keyword', 'wordpress-seo' ) );
		}

		if ( in_array( 'keywords_score', $columns) ) {
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
		$keywords = array_key_exists( 'keywords' , $result ) ? $result['keywords'] : array();
		$keywords_score = array_key_exists( 'keywords_score' , $result ) ? $result['keywords_score'] : array();
		$csv = '';

		// Add at least one row plus additional ones if we have more keywords.
		do {
			$csv .= PHP_EOL . $this->format_csv_column( $result['ID'] );

			if ( in_array( 'post_title', $columns ) ) {
				$csv .= ',' . $this->format_csv_column( $result['post_title'] );
			}

			if ( in_array( 'post_url', $columns ) ) {
				$csv .= ',' . $this->format_csv_column( $result['post_url'] );
			}

			if ( in_array( 'seo_score', $columns ) ) {
				$csv .= ',' . $this->format_csv_column( $result['seo_score'] );
			}

			if ( in_array( 'keywords', $columns ) && count( $keywords ) > 0 ) {
				$csv .= ',' . $this->format_csv_column( array_shift( $keywords ) );
			}

			if ( in_array( 'keywords_score', $columns ) && count( $keywords_score ) > 0 ) {
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
		return '"' . str_replace( '"', '""', (string) $value ) . '"';
	}
}
