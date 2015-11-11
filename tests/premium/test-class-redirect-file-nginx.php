<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_File_Nginx
 *
 * Class WPSEO_Redirect_File_Nginx_Test
 */
class WPSEO_Redirect_File_Nginx_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Export_Export_Nginx
	 */
	protected $class_instance;

	/**
	 * Setting up the class instance and fill it with some fake redirects
	 */
	public function setUp() {
		$this->class_instance = $this->getMock( 'WPSEO_Redirect_File_Nginx', array( 'generate_content' ) );
	}

	/**
	 * Testing if the saving method will be called and returns true
	 *
	 * @covers WPSEO_Redirect_File_Nginx::save
	 */
	public function test_save() {
		$this->assertTrue( $this->class_instance->save( array(), array() ) );
	}

}
