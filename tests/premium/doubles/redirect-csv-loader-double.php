<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Test double for testing the result of the match_redirect_regex which is protected in the import manager.
 */
class WPSEO_Redirect_CSV_Loader_Double extends WPSEO_Redirect_CSV_Loader {

	/**
	 * Checks if a parsed CSV row is has a valid redirect format.
	 *
	 * @param array $item The parsed CSV row.
	 *
	 * @return bool Whether or not the parsed CSV row is valid.
	 */
	public function return_validate_item( $item ) {
		return $this->validate_item( $item );
	}

}
