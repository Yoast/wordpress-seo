<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes\Redirect\Loaders
 */

/**
 * Class for loading redirects from a CSV file and validating them.
 */
class WPSEO_Redirect_CSV_Loader extends WPSEO_Redirect_Abstract_Loader {

	/**
	 * Path of the CSV file to load.
	 *
	 * @var string
	 */
	protected $csv_file;

	/**
	 * WPSEO_Redirect_CSV_Loader constructor.
	 *
	 * @param string $csv_file Path of the CSV file to load.
	 */
	public function __construct( $csv_file ) {
		$this->csv_file = $csv_file;
	}

	/**
	 * Loads all redirects from the CSV file.
	 *
	 * @return WPSEO_Redirect[] The redirects loaded from the CSV file.
	 */
	public function load() {
		$handle = fopen( $this->csv_file, 'r' );

		if ( ! $handle ) {
			return array();
		}

		$redirects = array();
		while ( $item = fgetcsv( $handle, 10000 ) ) {
			if ( ! $this->validate_item( $item ) ) {
				continue;
			}

			$redirects[] = new WPSEO_Redirect( $item[0], $item[1], $item[2], $item[3] );
		}

		return $redirects;
	}

	/**
	 * Checks if a parsed CSV row is has a valid redirect format.
	 * It should have exactly 4 values.
	 * The third value should be a http status code.
	 * The last value should be a redirect format.
	 *
	 * @param array $item The parsed CSV row.
	 *
	 * @return bool Whether or not the parsed CSV row is valid.
	 */
	protected function validate_item( $item ) {
		if ( count( $item ) !== 4 ) {
			return false;
		}

		if ( ! $this->validate_status_code( $item[2] ) ) {
			return false;
		}

		if ( ! $this->validate_format( $item[3] ) ) {
			return false;
		}

		return true;
	}
}
