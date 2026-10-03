<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use WPSEO_Options;
use Yoast\WP\SEO\Tests\WP\Doubles\Admin\Yoast_Form_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Yoast_Form_Test extends TestCase {

	/**
	 * Tests setting the form option with a valid option having a `WPSEO_Option` class.
	 *
	 * @covers Yoast_Form::set_option
	 *
	 * @return void
	 */
	public function test_properties_set_with_valid_option() {
		$form = new Yoast_Form_Double();
		$form->set_option( 'wpseo' );

		$option_instance = WPSEO_Options::get_option_instance( 'wpseo' );

		$this->assertSame( 'wpseo', $form->option_name );
		$this->assertSame( $option_instance, $form->get_option_instance() );
	}

	/**
	 * Tests setting the form option with an invalid option that does not have a `WPSEO_Option` class.
	 *
	 * @covers Yoast_Form::set_option
	 *
	 * @return void
	 */
	public function test_properties_set_with_invalid_option() {
		$option_keys = [ 'key1', 'key2', 'key3' ];
		\update_option( 'random', \array_fill_keys( $option_keys, true ) );

		$form = new Yoast_Form_Double();
		$form->set_option( 'random' );

		$this->assertSame( 'random', $form->option_name );
		$this->assertNull( $form->get_option_instance() );
	}

	/**
	 * Tests whether a control is disabled with a valid option having a `WPSEO_Option` class.
	 *
	 * @covers Yoast_Form::is_control_disabled
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_is_control_disabled_with_invalid_option() {
		$form = new Yoast_Form_Double();
		$form->set_option( 'random' );

		$this->assertFalse( $form->is_control_disabled( 'enable_admin_bar_menu' ) );
	}
}
