<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Configuration_Structure_Mock
 */
class WPSEO_Configuration_Structure_Mock extends WPSEO_Configuration_Structure {

	/**
	 * Make add_step public
	 *
	 * @param string $identifier Identifier for this step.
	 * @param string $title      Title to display for this step.
	 * @param array  $fields     Fields to use on the step.
	 * @param bool   $navigation Show navigation buttons.
	 * @param bool   $full_width Wheter the step content is full width or not.
	 */
	public function add_step_mock( $identifier, $title, $fields, $navigation = true, $full_width = false ) {
		$this->add_step( $identifier, $title, $fields, $navigation, $full_width );
	}
}
