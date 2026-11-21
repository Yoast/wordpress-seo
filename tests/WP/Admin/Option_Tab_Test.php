<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use WPSEO_Option_Tab;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Option_Tab_Test extends TestCase {

	/**
	 * Tests that the name is returned properly.
	 *
	 * @covers WPSEO_Option_Tab::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertEquals( 'name', $option_tab->get_name() );
	}

	/**
	 * Tests that the label is returned properly.
	 *
	 * @covers WPSEO_Option_Tab::get_label
	 *
	 * @return void
	 */
	public function test_get_label() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertEquals( 'label', $option_tab->get_label() );
	}

	/**
	 * Tests that the option group is returned properly.
	 *
	 * @covers WPSEO_Option_Tab::get_opt_group
	 *
	 * @return void
	 */
	public function test_get_opt_group() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label', [ 'opt_group' => 'opt_group' ] );

		$this->assertEquals( 'opt_group', $option_tab->get_opt_group() );
	}

	/**
	 * Tests that the option group is empty and does not error when it is not set.
	 *
	 * @covers WPSEO_Option_Tab::get_opt_group
	 *
	 * @return void
	 */
	public function test_get_opt_group_WHEN_opt_group_is_not_set() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertEquals( '', $option_tab->get_opt_group() );
	}

	/**
	 * Tests that the save button argument set to false is detected correctly.
	 *
	 * @covers WPSEO_Option_Tab::has_save_button
	 *
	 * @return void
	 */
	public function test_has_no_save_button() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label', [ 'save_button' => false ] );

		$this->assertFalse( $option_tab->has_save_button() );
	}

	/**
	 * Tests that the has save button defaults to true.
	 *
	 * @covers WPSEO_Option_Tab::has_save_button
	 *
	 * @return void
	 */
	public function test_has_save_button() {
		// By default, we do have a save button.
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertTrue( $option_tab->has_save_button() );
	}
}
