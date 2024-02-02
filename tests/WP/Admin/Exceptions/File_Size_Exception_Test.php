<?php

namespace Yoast\WP\SEO\Tests\WP\Admin\Exceptions;

use WPSEO_File_Size_Exception;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class File_Size_Exception_Test extends TestCase {

	/**
	 * Tests that the externally hosted error message is as expected.
	 *
	 * @covers WPSEO_File_Size_Exception::externally_hosted
	 *
	 * @return void
	 */
	public function test_externally_hosted_exception() {
		$expected_exception = WPSEO_File_Size_Exception::externally_hosted( 'https://external.im/age.jpg' );

		$this->assertEquals(
			'Cannot get the size of https://external.im/age.jpg because it is hosted externally.',
			$expected_exception->getMessage()
		);
	}

	/**
	 * Tests that the unknown exception error message is as expected.
	 *
	 * @covers WPSEO_File_Size_Exception::unknown_error
	 *
	 * @return void
	 */
	public function test_unknown_error() {
		$expected_exception = WPSEO_File_Size_Exception::unknown_error( 'image.jpg' );

		$this->assertEquals(
			'Cannot get the size of image.jpg because of unknown reasons.',
			$expected_exception->getMessage()
		);
	}
}
