<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Admin_Bar_Menu_Double extends WPSEO_Admin_Bar_Menu {

	/**
	 * @inheritdoc
	 */
	public function get_post_focus_keyword( $post ) {
		return parent::get_post_focus_keyword( $post );
	}
}
