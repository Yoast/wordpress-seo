<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Unit Test Class.
 */
class WPSEO_Shortlinker_Test extends TestCase {

	/**
	 * Tests building a shortlink.
	 *
	 * @covers WPSEO_Shortlinker::build_shortlink
	 * @covers WPSEO_Shortlinker::get_php_version
	 * @covers WPSEO_Shortlinker::get_software
	 */
	public function test_build_shortlink() {
		$shortlinks = new WPSEO_Shortlinker();

		$shortlink = $shortlinks->build_shortlink( 'http://yoa.st/abcdefg' );

		$this->assertStringContainsString( 'php_version', $shortlink );
		$this->assertStringContainsString( 'platform_version', $shortlink );
		$this->assertStringContainsString( 'software', $shortlink );
	}

	/**
	 * Tests building a shortlink with page.
	 *
	 * @covers WPSEO_Shortlinker::build_shortlink
	 * @covers WPSEO_Shortlinker::collect_additional_shortlink_data
	 */
	public function test_build_shortlink_page_set() {
		$_GET['page'] = 'wpseo_dashboard';
		$shortlinks   = new WPSEO_Shortlinker();

		$shortlink = $shortlinks->build_shortlink( 'http://yoa.st/abcdefg' );

		$this->assertStringContainsString( 'screen', $shortlink );
	}

	/**
	 * Tests building a shortlink with page set to null.
	 *
	 * @covers WPSEO_Shortlinker::build_shortlink
	 * @covers WPSEO_Shortlinker::collect_additional_shortlink_data
	 */
	public function test_build_shortlink_page_set_to_null() {
		$_GET['page'] = null;
		$shortlinks   = new WPSEO_Shortlinker();

		$shortlink = $shortlinks->build_shortlink( 'http://yoa.st/abcdefg' );

		$this->assertStringNotContainsString( 'screen', $shortlink );
	}

	/**
	 * Tests building a shortlink with page set to something else than a string.
	 *
	 * @covers WPSEO_Shortlinker::build_shortlink
	 * @covers WPSEO_Shortlinker::collect_additional_shortlink_data
	 */
	public function test_build_shortlink_page_set_to_int() {
		$_GET['page'] = 13;
		$shortlinks   = new WPSEO_Shortlinker();

		$shortlink = $shortlinks->build_shortlink( 'http://yoa.st/abcdefg' );

		$this->assertStringNotContainsString( 'screen', $shortlink );
	}

	/**
	 * Tests getting a shortlink.
	 *
	 * @covers WPSEO_Shortlinker::get
	 * @covers WPSEO_Shortlinker::get_php_version
	 * @covers WPSEO_Shortlinker::get_software
	 */
	public function test_get() {
		$shortlink = WPSEO_Shortlinker::get( 'http://yoa.st/blaat' );

		$this->assertStringContainsString( 'php_version', $shortlink );
		$this->assertStringContainsString( 'platform_version', $shortlink );
		$this->assertStringContainsString( 'software', $shortlink );
	}

	/**
	 * Tests getting a shortlink.
	 *
	 * @dataProvider data_show
	 *
	 * @covers WPSEO_Shortlinker::show
	 * @covers WPSEO_Shortlinker::get_php_version
	 * @covers WPSEO_Shortlinker::get_software
	 *
	 * @param string $expected_output Substring expected to be found in the actual output.
	 */
	public function test_show( $expected_output ) {
		WPSEO_Shortlinker::show( 'http://yoa.st/blaat' );

		$this->expectOutputContains( $expected_output );
	}

	/**
	 * Data provider for the `test_show()` test.
	 *
	 * @return array
	 */
	public function data_show() {
		return [
			[ 'php_version' ],
			[ 'platform_version' ],
			[ 'software' ],
		];
	}

	/**
	 * Tests getting the query params.
	 *
	 * @covers WPSEO_Shortlinker::get_query_params
	 * @covers WPSEO_Shortlinker::collect_additional_shortlink_data
	 */
	public function test_get_query_params() {
		$query_param_keys = array_keys( WPSEO_Shortlinker::get_query_params() );

		$this->assertContains( 'php_version', $query_param_keys );
		$this->assertContains( 'platform_version', $query_param_keys );
		$this->assertContains( 'software', $query_param_keys );
	}
}
