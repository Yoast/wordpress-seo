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
	 * Exports an array of redirects.
	 *
	 * @param WPSEO_Redirect[] $redirects The redirects to export.
	 *
	 * @return string
	 */
	public function export( $redirects ) {
		$csv = $this->headers . PHP_EOL;

		if ( ! empty( $redirects ) ) {
			foreach ( $redirects as $redirect ) {
				$csv .= $this->format( $redirect ) . PHP_EOL;
			}
		}

		return $csv;
	}

	/**
	 * Formats a redirect for use in the export.
	 *
	 * @param WPSEO_Redirect $redirect The redirect to format.
	 *
	 * @return string
	 */
	public function format( WPSEO_Redirect $redirect ) {
		return join(',', array(
			(string) $redirect->get_origin(),
			(string) $redirect->get_target(),
			(string) $redirect->get_type(),
			(string) $redirect->get_format()
		));
	}
}
