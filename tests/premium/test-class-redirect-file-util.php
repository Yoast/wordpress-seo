<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_File_Util
 *
 * Class WPSEO_Redirect_File_Util_Test
 */
class WPSEO_Redirect_File_Util_Test extends WPSEO_UnitTestCase {

	/**
	 * Testing if the get dir contains wpseo-redirects.
	 *
	 * @covers WPSEO_Redirect_File_Util::get_dir
	 */
	public function test_get_dir() {
		$this->assertContains( '/wpseo-redirects', WPSEO_Redirect_File_Util::get_dir() );
	}

	/**
	 * Testing if file path contains wpseo-redirects/.redirects.
	 *
	 * @covers WPSEO_Redirect_File_Util::get_file_path
	 */
	public function test_get_file_path() {
		$this->assertContains( '/wpseo-redirects/.redirects', WPSEO_Redirect_File_Util::get_file_path() );
	}

	/**
	 * Check if the upload directory is created.
	 *
	 * @covers WPSEO_Redirect_File_Util::create_upload_dir
	 */
	public function test_create_upload_dir() {
		WPSEO_Redirect_File_Util::create_upload_dir();

		$this->assertTrue( is_dir( WPSEO_Redirect_File_Util::get_dir() ) );
	}

	/**
	 * Check if we can write some data
	 *
	 * @covers WPSEO_Redirect_File_Util::write_file
	 */
	public function test_write_file() {
		WPSEO_Redirect_File_Util::write_file( WPSEO_Redirect_File_Util::get_file_path(), 'This is some test content' );


		$this->assertEquals( 'This is some test content', file_get_contents( WPSEO_Redirect_File_Util::get_file_path() ) );
	}



}
