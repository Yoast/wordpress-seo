<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class WPSEO_Option_Tab_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests that the name is returned properly.
	 *
	 * @covers WPSEO_Option_Tab::get_name
	 */
	public function test_get_name() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertEquals( 'name', $option_tab->get_name() );
	}

	/**
	 * Tests that the label is returned properly.
	 *
	 * @covers WPSEO_Option_Tab::get_label
	 */
	public function test_get_label() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertEquals( 'label', $option_tab->get_label() );
	}

	/**
	 * Tests that the save button argument set to false is detected correctly.
	 *
	 * @covers WPSEO_Option_Tab::has_save_button
	 */
	public function test_has_no_save_button() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label', [ 'save_button' => false ] );

		$this->assertFalse( $option_tab->has_save_button() );
	}

	/**
	 * Tests that the has save button defaults to true.
	 *
	 * @covers WPSEO_Option_Tab::has_save_button
	 */
	public function test_has_save_button() {
		// By default, we do have a save button.
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertTrue( $option_tab->has_save_button() );
	}
}
