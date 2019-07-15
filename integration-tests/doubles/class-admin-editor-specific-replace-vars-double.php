<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Admin_Editor_Specific_Replace_Vars_Double extends WPSEO_Admin_Editor_Specific_Replace_Vars {

	/**
	 * @inheritdoc
	 */
	public function add_for_page_types( array $page_types, array $replacement_variables_to_add ) {
		parent::add_for_page_types( $page_types, $replacement_variables_to_add );
	}

	/**
	 * @inheritdoc
	 */
	public function has_for_page_type( $page_type ) {
		return parent::has_for_page_type( $page_type );
	}
}
