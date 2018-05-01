<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Premium_Orphaned_Post_Filter_Double extends WPSEO_Premium_Orphaned_Post_Filter {

	/**
	 * @inheritdoc
	 */
	public function filter_published_posts() {
		return parent::filter_published_posts();
	}
}
