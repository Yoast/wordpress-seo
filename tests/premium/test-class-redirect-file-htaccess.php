<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_File_Htaccess
 *
 * Class WPSEO_Redirect_File_Htaccess_Test
 */
class WPSEO_Redirect_File_Htaccess_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_File_Apache
	 */
	protected $class_instance;


	/**
	 * Testing if the saving method will be called and returns true
	 *
	 * @covers WPSEO_Redirect_File_Htaccess::generate_content
	 */
	public function test_save() {
		$class_instance = $this->getMock( 'WPSEO_Redirect_File_Htaccess', array( 'write_htaccess_content' ) );

		// Letting write htaccess_content always return true.
		$class_instance
			->method( 'write_htaccess_content' )
			->will( $this->returnValue( true ) );

		$this->assertTrue( $class_instance->save( array( 'test' => array( 'url' => 'more-test', 'type' => 301 ) ), array() ) );
	}

	/**
	 * Testing if the saving method will be called and returns true
	 *
	 * @covers WPSEO_Redirect_File_Htaccess::generate_content
	 */
	public function test_generate_content() {
		$class_instance = $this->getMock( 'WPSEO_Redirect_File_Htaccess', array( 'generate_content', 'write_htaccess_content' ) );
		$class_instance
			->expects( $this->once() )
			->method( 'generate_content' )
			->will( $this->returnValue( true ) );

		// Letting write htaccess_content always return true.
		$class_instance
			->expects( $this->once() )
			->method( 'write_htaccess_content' )
			->will( $this->returnValue( true ) );

		$class_instance->save( array( 'test' => array( 'url' => 'more-test', 'type' => 301 ) ), array() );
	}

}
