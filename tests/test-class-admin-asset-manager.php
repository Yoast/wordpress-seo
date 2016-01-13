<?php

class WPSEO_Admin_Asset_Manager_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests whether the function enqueue_script() enqueues the included script
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_script
	 */
	public function test_enqueue_script() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_script( 'metabox' );
		$this->assertTrue( wp_script_is( $class_instance::PREFIX . 'metabox', 'enqueued' ) );
	}

	/**
	 * Tests whether the function enqueue_style() enqueues the included style
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_style
	 */
	public function test_enqueue_style() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_style( 'metabox-css' );
		$this->assertTrue( wp_style_is( $class_instance::PREFIX . 'metabox-css', 'enqueued' ) );
	}

	/**
	 * Tests whether register_assets calls the functions register_scripts and register_styles
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_assets
	 */
	public function test_register_assets() {
		$class_instance =
			$this
				->getMock( 'WPSEO_Admin_Asset_Manager', array( 'register_scripts', 'register_styles' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'register_scripts' );
		$class_instance
			->expects( $this->once() )
			->method( 'register_styles' );

		$class_instance->register_assets();
	}

}
