<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Exceptions
 */

/**
 * Unit Test Class.
 *
 * @group test
 */
class WPSEO_File_Size_Exception_Test extends WPSEO_UnitTestCase {

	/**
	 * @covers WPSEO_File_Size_Exception::externally_hosted
	 */
	public function test_externally_hosted_exception() {
		$expected_exception = WPSEO_File_Size_Exception::externally_hosted( 'https://external.im/age.jpg' );

		$this->assertEquals(
			'Cannot get the size of https://external.im/age.jpg because it is hosted externally.',
			$expected_exception->getMessage()
		);
	}

	/**
	 * @covers WPSEO_File_Size_Exception::unknown_error
	 */
	public function test_unknown_error() {
		$expected_exception = WPSEO_File_Size_Exception::unknown_error( 'image.jpg' );

		$this->assertEquals(
			'Cannot get the size of image.jpg because of unknown reasons.',
			$expected_exception->getMessage()
		);
	}
}
