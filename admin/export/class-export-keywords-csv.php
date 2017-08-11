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
	 * @return string A line of CSV, including EOL.
	 */
	protected function get_headers( $columns ) {
		$csv = __( 'ID' );

		if ( in_array( 'post_title', $columns) ) {
			$csv .= ',' . __( 'post title', 'wordpress-seo' );
		}

		if ( in_array( 'post_url', $columns) ) {
			$csv .= ',' . __( 'post url', 'wordpress-seo' );
		}

		if ( in_array( 'seo_score', $columns) ) {
			$csv .= ',' . __( 'seo score', 'wordpress-seo' );
		}

		if ( in_array( 'keywords', $columns) ) {
			$csv .= ',' . __( 'keyword', 'wordpress-seo' );
		}

		if ( in_array( 'keywords_score', $columns) ) {
			$csv .= ',' . __( 'keyword score', 'wordpress-seo' );
		}

		$csv .= PHP_EOL;

		return $csv;
	}

	/**
	 * Formats a WPSEO_Export_Keywords_Query result as a CSV line.
	 * In case of multiple keywords it will return multiple lines.
	 *
	 * @param array[string]string $result A result as returned from WPSEO_Export_Keywords_Query::get_data.
	 * @param array[int]string $columns The columns as returned from WPSEO_Export_Keywords_Query::get_columns.
	 *
	 * @return string A line of CSV, including EOL.
	 */
	protected function format( $result, $columns ) {
		$keywords = array_key_exists( 'keywords' , $result ) ? $result['keywords'] : array();
		$keywords_score = array_key_exists( 'keywords_score' , $result ) ? $result['keywords_score'] : array();
		$csv = '';

		// Add at least one row plus additional ones if we have more keywords.
		do {
			var_dump( $result );
			echo PHP_EOL;

			$csv .= '"' . addslashes( $result['ID'] ) . '"';

			if ( in_array( 'post_title', $columns ) ) {
				$csv .= ',"' . addslashes( $result['post_title'] ) . '"';
			}

			if ( in_array( 'post_url', $columns ) ) {
				$csv .= ',"' . addslashes( $result['post_url'] ) . '"';
			}

			if ( in_array( 'seo_score', $columns ) ) {
				$csv .= ',"' . addslashes( $result['seo_score'] ) . '"';
			}

			if ( in_array( 'keywords', $columns ) && count( $keywords ) > 0 ) {
				$csv .= ',"' . addslashes( array_shift( $keywords ) ) . '"';
			}

			if ( in_array( 'keywords_score', $columns ) && count( $keywords_score ) > 0 ) {
				$csv .= ',"' . addslashes( array_shift( $keywords_score ) ) . '"';
			}

			$csv .= PHP_EOL;
		} while( count( $keywords ) > 0 );

		return $csv;
	}
}
