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
		$csv = $this->get_headers() . PHP_EOL;

		if ( ! empty( $redirects ) ) {
			foreach ( $redirects as $redirect ) {
				if ( $redirect instanceof WPSEO_Redirect ) {
					$csv .= $this->format( $redirect ) . PHP_EOL;
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
		return join(',', array(
			// Potentially take into account weird URLs containing commas.
			// NOTE: sanitize_url does not allow double quotes but does allow commas.
			'"' . (string) $redirect->get_origin() . '"',
			'"' . (string) $redirect->get_target() . '"',
			(string) $redirect->get_type(),
			(string) $redirect->get_format()
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
				__( 'Format',  'wordpress-seo-premium' )
			)
		);
	}
}
