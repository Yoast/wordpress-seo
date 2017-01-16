<?php

class WPSEO_Option_Tabs_Test extends WPSEO_UnitTestCase {

	public function test_get_base() {
		$option_tabs = new WPSEO_Option_Tabs( 'base' );

		$this->assertEquals( 'base', $option_tabs->get_base() );
	}

	public function test_add_tab() {

		$option_tabs = new WPSEO_Option_Tabs( 'base' );

		$before = $option_tabs->get_tabs();

		$option_tabs->add_tab( new WPSEO_Option_Tab( 'name', 'label' ) );

		$after = $option_tabs->get_tabs();

		$this->assertTrue( ! empty( $after ) );
	}

	public function test_get_tabs() {
		$option_tab  = new WPSEO_Option_Tab( 'name', 'label' );
		$option_tabs = new WPSEO_Option_Tabs( 'base' );
		$option_tabs->add_tab( $option_tab );

		$this->assertEquals( array( $option_tab ), $option_tabs->get_tabs() );
	}

	public function test_is_active_tab() {
		$option_tab  = new WPSEO_Option_Tab( 'name', 'label' );
		$option_tabs = new WPSEO_Option_Tabs( 'base', 'name' );
		$option_tabs->add_tab( $option_tab );

		$this->assertTrue( $option_tabs->is_active_tab( $option_tab ) );
	}

	public function test_is_active_tab_not_active() {
		$option_tab  = new WPSEO_Option_Tab( 'name', 'label' );
		$option_tabs = new WPSEO_Option_Tabs( 'base', 'inactive_name' );
		$option_tabs->add_tab( $option_tab );

		$this->assertFalse( $option_tabs->is_active_tab( $option_tab ) );
	}

	public function test_get_active_tab_without_any_active_tab_being_set() {
		$option_tabs = new WPSEO_Option_Tabs( 'base' );

		$this->assertNull( $option_tabs->get_active_tab() );
	}

	public function test_get_active_tab() {
		$option_tab  = new WPSEO_Option_Tab( 'name', 'label' );
		$option_tabs = new WPSEO_Option_Tabs( 'base', 'name' );
		$option_tabs->add_tab( $option_tab );

		$this->assertEquals( $option_tab, $option_tabs->get_active_tab() );
	}

	public function test_get_active_tab_WITH_nonexisting_tab_set_as_active() {
		$option_tabs = new WPSEO_Option_Tabs( 'base', 'nonexisting' );

		$this->assertNull( $option_tabs->get_active_tab() );
	}

	public function test_display(  ) {
		$option_tab  = new WPSEO_Option_Tab( 'name', 'label' );
		$option_tabs = new WPSEO_Option_Tabs( 'base', 'name' );
		$option_tabs->add_tab( $option_tab );

		$option_tabs->display( new Yoast_Form() );

		$this->expectOutputContains( '<h2 class="nav-tab-wrapper" id="wpseo-tabs">' );


	}




}
