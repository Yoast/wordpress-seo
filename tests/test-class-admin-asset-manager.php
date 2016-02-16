<?php

class WPSEO_Admin_Asset_Manager_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests whether the function enqueue_script() enqueues the included script.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_script
	 */
	public function test_enqueue_script() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_script( 'metabox' );
		$this->assertTrue( wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'enqueued' ) );
	}

	/**
	 * Tests whether the function enqueue_style() enqueues the included style.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_style
	 */
	public function test_enqueue_style() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_style( 'metabox-css' );
		$this->assertTrue( wp_style_is( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox-css', 'enqueued' ) );
	}

	/**
	 * Tests whether enqueue style doesn't enqueue when wrong data is fed.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_style
	 */
	public function test_wrong_enqueue_style() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_style( 'nonexisting' );
		$this->assertFalse( wp_style_is( WPSEO_Admin_Asset_Manager::PREFIX . 'nonexisting', 'enqueued' ) );
	}

	/**
	 * Tests whether register_script can actually register a script based on the required argument.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_script
	 */
	public function test_register_script() {
		$class_instance =
			$this
				->getMock( 'WPSEO_Admin_Asset_Manager', array( 'scripts_to_be_registered' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'scripts_to_be_registered' )
			->will( $this->returnValue(
				array (
					array (
					'name'  =>  'testfile',
					'src'   =>  'testfile',
					'deps'  =>  array()
					)
				)
			) );
		$class_instance->register_assets();
		$this->assertTrue( wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'testfile', 'registered' ) );
	}

	/**
	 * Tests whether register_script only registers the scripts in question.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_script
	 */
	public function test_register_script_only_registers() {
		$class_instance =
			$this
				->getMock( 'WPSEO_Admin_Asset_Manager', array( 'scripts_to_be_registered' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'scripts_to_be_registered' )
			->will( $this->returnValue(
				array (
					array (
						'name'  =>  'nonexisting',
						'src'   =>  'nonexisting',
						'deps'  =>  array()
					)
				)
			) );
		$class_instance->register_assets();
		$this->assertFalse( wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'nonexisting', 'enqueued' ) );
	}



	/**
	 * Tests whether register_style can actually register a style based on the required arguments.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_style
	 */
	public function test_register_style() {
		$class_instance =
			$this
				->getMock( 'WPSEO_Admin_Asset_Manager', array( 'styles_to_be_registered', 'register_style' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'styles_to_be_registered' )
			->will( $this->returnValue(
				array(
					array(
						'name' => 'testfile',
						'src'  => 'testfile',
					),
					array(
						'name'    => 'testfile2',
						'src'     => 'testfile2',
						'deps'    => array( 'dep1' ),
						'version' => 'version1',
					),
				)
			) );
		$class_instance
			->expects( $this->exactly(2) )
			->method( 'register_style' )
			->withConsecutive(
				array( 'testfile', 'testfile' ),
				array( 'testfile2', 'testfile2', array( 'dep1' ), 'version1' )
			);

		$class_instance->register_assets();
	}

	/**
	 * Tests whether register_assets calls the functions register_scripts and register_styles.
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
