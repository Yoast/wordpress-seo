<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the URL formatter class
 *
 * @group test
 */
class WPSEO_Redirect_Url_Formatter_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests without any subdirectory
	 */
	public function test_without_subdirectory() {
		$formatter = new WPSEO_Redirect_Url_Formatter( '/redirect' );

		$this->assertEquals( '/redirect', $formatter->format_without_subdirectory( 'http://domain.com' ) );
	}

	/**
	 * Tests with a subdirectory in the url.
	 */
	public function test_with_subdirectory_and_subdirectory_present() {
		$formatter = new WPSEO_Redirect_Url_Formatter( '/test/redirect' );

		$this->assertEquals( '/redirect', $formatter->format_without_subdirectory( 'http://domain.com/test/' ) );
	}

	/**
	 * Tests with a subdirectory in the url.
	 */
	public function test_with_subdirectory_and_subdirectory_not_present() {
		$formatter = new WPSEO_Redirect_Url_Formatter( '/testing/redirect' );

		$this->assertEquals( '/testing/redirect', $formatter->format_without_subdirectory( 'http://domain.com/test/' ) );
	}

}
