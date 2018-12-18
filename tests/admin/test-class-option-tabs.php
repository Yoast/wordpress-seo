<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class WPSEO_Option_Tabs_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the retrieval of the base.
	 *
	 * @covers WPSEO_Option_Tabs::get_base()
	 */
	public function test_get_base() {
		$option_tabs = new WPSEO_Option_Tabs( 'base' );

		$this->assertEquals( 'base', $option_tabs->get_base() );
	}

	/**
	 * Tests the addition of a new tab.
	 *
	 * @covers WPSEO_Option_Tabs::add_tab()
	 */
	public function test_add_tab() {
		$option_tabs = new WPSEO_Option_Tabs( 'base' );
		$option_tabs->add_tab( new WPSEO_Option_Tab( 'name', 'label' ) );

		$after = $option_tabs->get_tabs();

		$this->assertNotEmpty( $after );
	}

	/**
	 * Tests the retrieval of the tabs.
	 *
	 * @covers WPSEO_Option_Tabs::get_tabs()
	 */
	public function test_get_tabs() {
		$option_tab  = new WPSEO_Option_Tab( 'name', 'label' );
		$option_tabs = new WPSEO_Option_Tabs( 'base' );
		$option_tabs->add_tab( $option_tab );

		$this->assertEquals( array( $option_tab ), $option_tabs->get_tabs() );
	}

	/**
	 * Tests if the given tab is active.
	 *
	 * @covers WPSEO_Option_Tabs::get_active_tab()
	 */
	public function test_is_active_tab() {
		$option_tab  = new WPSEO_Option_Tab( 'name', 'label' );
		$option_tabs = new WPSEO_Option_Tabs( 'base', 'name' );
		$option_tabs->add_tab( $option_tab );

		$this->assertTrue( $option_tabs->is_active_tab( $option_tab ) );
	}

	/**
	 * Tests of the given tab is not active.
	 *
	 * @covers WPSEO_Option_Tabs::is_active_tab()
	 */
	public function test_is_active_tab_not_active() {
		$option_tab  = new WPSEO_Option_Tab( 'name', 'label' );
		$option_tabs = new WPSEO_Option_Tabs( 'base', 'inactive_name' );
		$option_tabs->add_tab( $option_tab );

		$this->assertFalse( $option_tabs->is_active_tab( $option_tab ) );
	}

	/**
	 * Tests retrieval of an active tab without having any tabs.
	 *
	 * @covers WPSEO_Option_Tabs::is_active_tab()
	 */
	public function test_get_active_tab_without_any_active_tab_being_set() {
		$option_tabs = new WPSEO_Option_Tabs( 'base' );

		$this->assertNull( $option_tabs->get_active_tab() );
	}

	/**
	 * Tests the retrieval of the active tab.
	 *
	 * @covers WPSEO_Option_Tabs::get_active_tab()
	 */
	public function test_get_active_tab() {
		$option_tab  = new WPSEO_Option_Tab( 'name', 'label' );
		$option_tabs = new WPSEO_Option_Tabs( 'base', 'name' );
		$option_tabs->add_tab( $option_tab );

		$this->assertEquals( $option_tab, $option_tabs->get_active_tab() );
	}

	/**
	 * Tests the retrieval of the active tab without having any tabs.
	 *
	 * @covers WPSEO_Option_Tabs::get_active_tab()
	 */
	public function test_get_active_tab_WITH_nonexisting_tab_set_as_active() {
		$option_tabs = new WPSEO_Option_Tabs( 'base', 'nonexisting' );

		$this->assertNull( $option_tabs->get_active_tab() );
	}

	/**
	 * Tests the retrieval of the active tab without having a active tab being set
	 *
	 * @covers WPSEO_Option_Tabs::get_active_tab()
	 */
	public function test_get_active_tab_WITH_no_tab_set_as_active() {
		$option_tabs = new WPSEO_Option_Tabs( 'base' );

		$this->assertNull( $option_tabs->get_active_tab() );
	}

	/**
	 * Tests the displaying of the tabs.
	 *
	 * @covers WPSEO_Option_Tabs::display
	 */
	public function test_display() {
		$option_tab  = new WPSEO_Option_Tab( 'name', 'label' );
		$option_tabs = new WPSEO_Option_Tabs( 'base', 'name' );
		$option_tabs->add_tab( $option_tab );

		$option_tabs->display( new Yoast_Form() );

		$this->expectOutputContains( '<h2 class="nav-tab-wrapper" id="wpseo-tabs">' );
	}
}
