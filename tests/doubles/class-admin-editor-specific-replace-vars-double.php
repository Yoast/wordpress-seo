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
		return $this->replacement_variables;
	}
}
