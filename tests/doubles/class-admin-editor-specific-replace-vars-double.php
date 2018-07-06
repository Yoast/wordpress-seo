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
	 * Returns the protected editor_specific_replace_vars array.
	 *
	 * @return array The protected editor_specific_replace_vars array.
	 */
	public function get_protected_editor_specific_replace_vars() {
		return parent::editor_specific_replace_vars;
	}

	/**
	 * @inheritdoc
	 */
	public function apply_custom_fields() {
		return parent::apply_custom_fields();
	}

	/**
	 * @inheritdoc
	 */
	public function apply_custom_taxonomies() {
		return parent::apply_custom_taxonomies();
	}

	/**
	 * @inheritdoc
	 */
	public function has_editor_specific_replace_vars( $editor_specific_replacement_variables, $page_type ) {
		return parent::has_editor_specific_replace_vars( $editor_specific_replacement_variables, $page_type );
	}
}
