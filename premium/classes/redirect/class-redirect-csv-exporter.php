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


	protected $headers = 'Origin,Target,Type,Format';

	/**
	 * Exports an array of redirects to a CSV string.
	 *
	 * @param WPSEO_Redirect[] $redirects The redirects to export.
	 *
	 * @return string
	 */
	public function export( $redirects ) {
		$csv = $this->headers . PHP_EOL;

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
	 * @return string
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
}
