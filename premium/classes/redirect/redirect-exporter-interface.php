<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents a redirect export
 */
interface WPSEO_Redirect_Exporter {

	/**
	 * Exports an array of redirects.
	 *
	 * @param WPSEO_Redirect[] $redirects The redirects to export.
	 */
	public function export( $redirects );

	/**
	 * Formats a redirect for use in the export.
	 *
	 * @param WPSEO_Redirect $redirect The redirect to format.
	 *
	 * @return mixed
	 */
	public function format( WPSEO_Redirect $redirect );

}
