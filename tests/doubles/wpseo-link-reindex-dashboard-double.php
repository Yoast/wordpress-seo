<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Double for the WPSEO_Link_Reindex_Dashboard class
 */
class WPSEO_Link_Reindex_Dashboard_Double extends WPSEO_Link_Reindex_Dashboard {

	/**
	 * Sets the unprocessed count to test other methods.
	 *
	 * @param mixed $unprocessed
	 *
	 * @return void
	 */
	public function set_unprocessed( $unprocessed ) {
		$this->unprocessed = $unprocessed;
	}
}
