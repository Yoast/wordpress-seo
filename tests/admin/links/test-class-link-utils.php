<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 */
class WPSEO_Link_Utils_Test extends WPSEO_UnitTestCase {

	/**
	 * @covers WPSEO_Link_Utils::get_url_part
	 */
	public function test_get_url_part() {
		$result = WPSEO_Link_Utils::get_url_part( 'http://www.example.com', 'host' );

		$this->assertEquals( $result, 'www.example.com', 'URL Parsed Host does not match www.example.com' );
	}
}
