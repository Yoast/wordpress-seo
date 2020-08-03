<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 *
 * @group bla
 */
class WPSEO_Link_Utils_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests whether a URL part is extracted correctly from a URL.
	 *
	 * @covers WPSEO_Link_Utils::get_url_part
	 */
	public function test_get_url_part() {
		$result = WPSEO_Link_Utils::get_url_part( 'http://www.example.com', 'host' );

		$this->assertEquals( $result, 'www.example.com', 'URL Parsed Host does not match www.example.com' );
	}
}
