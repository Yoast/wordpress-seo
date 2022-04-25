<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class Yoast_Form_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests setting the form option with a valid option having a `WPSEO_Option` class.
	 *
	 * @covers Yoast_Form::set_option
	 */
	public function test_properties_set_with_valid_option() {
		$form = new Yoast_Form_Double();
		$form->set_option( 'wpseo' );

		$this->assertSame( 'wpseo', $form->option_name );
	}

	/**
	 * Tests setting the form option with an invalid option that does not have a `WPSEO_Option` class.
	 *
	 * @covers Yoast_Form::set_option
	 */
	public function test_properties_set_with_invalid_option() {
		$option_keys = [ 'key1', 'key2', 'key3' ];
		update_option( 'random', array_fill_keys( $option_keys, true ) );

		$form = new Yoast_Form_Double();
		$form->set_option( 'random' );

		$this->assertSame( 'random', $form->option_name );
	}

	/**
	 * Tests whether a control is disabled with a valid option having a `WPSEO_Option` class.
	 *
	 * @covers Yoast_Form::is_control_disabled
	 */
	public function test_is_control_disabled_with_valid_option() {
		$form = new Yoast_Form_Double();
		$form->set_option( 'wpseo' );

		$this->assertFalse( $form->is_control_disabled( 'enable_admin_bar_menu' ) );
	}

	/**
	 * Tests whether a control is disabled with an invalid option that does not have a `WPSEO_Option` class.
	 *
	 * @covers Yoast_Form::is_control_disabled
	 */
	public function test_is_control_disabled_with_invalid_option() {
		$form = new Yoast_Form_Double();
		$form->set_option( 'random' );

		$this->assertFalse( $form->is_control_disabled( 'enable_admin_bar_menu' ) );
	}
}
