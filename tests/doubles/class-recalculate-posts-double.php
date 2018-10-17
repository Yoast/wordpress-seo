<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Recalculate_Posts_Test_Double extends WPSEO_Recalculate_Posts {

	/**
	 * Wraps the protected method so we can access it in our tests.
	 *
	 * @param WP_Post $item The post for which to build the analyzer data.
	 *
	 * @return array
	 */
	public function call_item_to_response( $item ) {
		return $this->item_to_response( $item );
	}
}
