<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_File_Handler
 *
 * Class WPSEO_Redirect_File_Handler_Test
 */
class WPSEO_Redirect_File_Handler_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_File_Handler
	 */
	private $class_instance;

	/**
	 * Setting up a mock of the target class we want to test
	 */
	public function setUp() {
		$this->class_instance = $this->getMock( 'WPSEO_Redirect_File_Handler', array( 'save' ), array( false ) );
	}

	/**
	 * Saving the redirects to a file
	 *
	 * @covers WPSEO_Redirect_File_Handler::save
	 */
	public function test_save() {
		$this->class_instance
			->expects( $this->once() )
			->method( 'save' );

		$this->class_instance->save( array() );
	}
}
