<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * This exporter class will format the redirects for csv files.
 *
 * Does not implement WPSEO_Redirect_File_Exporter as the CSV is intended to be streamed, not saved.
 */
class WPSEO_Redirect_CSV_Exporter implements WPSEO_Redirect_Exporter {

	/**
	 * Exports an array of redirects to a CSV string.
	 *
	 * @param WPSEO_Redirect[] $redirects The redirects to export.
	 *
	 * @return string CSV string of all exported redirects with headers.
	 */
	public function export( $redirects ) {
		$csv = $this->get_headers();

		if ( ! empty( $redirects ) ) {
			foreach ( $redirects as $redirect ) {
				if ( $redirect instanceof WPSEO_Redirect ) {
					$csv .= PHP_EOL . $this->format( $redirect );
				}
			}
		}

		return $csv;
	}

	/**
	 * Formats a redirect for use in the export, returns a line of CSV.
	 *
	 * @param WPSEO_Redirect $redirect The redirect to format.
	 *
	 * @return string CSV line of the redirect for format.
	 */
	public function format( WPSEO_Redirect $redirect ) {
		$target = $redirect->get_target();
		if ( WPSEO_Redirect_Util::is_relative_url( $target ) ) {
			$target = '/' . $target;
		}
		if ( WPSEO_Redirect_Util::requires_trailing_slash( $target ) ) {
			$target = trailingslashit( $target );
		}

		$origin = $redirect->get_origin();
		if ( $redirect->get_format() === WPSEO_Redirect::FORMAT_PLAIN && WPSEO_Redirect_Util::is_relative_url( $origin ) ) {
			$origin = '/' . $origin;
		}

		return join(',', array(
			$this->format_csv_column( $origin ),
			$this->format_csv_column( $target ),
			$this->format_csv_column( $redirect->get_type() ),
			$this->format_csv_column( $redirect->get_format() ),
		));
	}

	/**
	 * Returns the headers to add to the first line of the generated CSV.
	 *
	 * @return string CSV line of the headers.
	 */
	protected function get_headers() {
		return join( ',',
			array(
				__( 'Origin', 'wordpress-seo-premium' ),
				__( 'Target', 'wordpress-seo-premium' ),
				__( 'Type', 'wordpress-seo-premium' ),
				__( 'Format', 'wordpress-seo-premium' ),
			)
		);
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
