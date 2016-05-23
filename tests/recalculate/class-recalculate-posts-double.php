<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Recalculate_Posts_Test_Double extends WPSEO_Recalculate_Posts {

	/**
	 * Wraps the protected method so we can access it in our tests.
	 *
	 * @param WP_Post $item
	 *
	 * @return array
	 */
	public function call_item_to_response( $item ) {
		return $this->item_to_response( $item );
	}

}
