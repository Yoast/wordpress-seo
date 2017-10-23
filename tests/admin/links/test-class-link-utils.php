<?php

class WPSEO_Link_Utils_Test extends WPSEO_UnitTestCase {
	/**
	 * @covers WPSEO_Link_Utils::get_public_post_types
	 */
	public function test_get_public_post_types() {
		$utils = new WPSEO_Link_Utils();

		$expected = array(
			'post' => 'post',
			'page' => 'page',
		);

		$result = $utils->get_public_post_types();

		$this->assertEquals( $result, $expected, 'Public post types do not match expected list.' );
	}

	/**
	 * @covers WPSEO_Link_Utils::get_url_part
	 */
	public function test_get_url_part() {
		$result = WPSEO_Link_Utils::get_url_part( 'http://www.example.com', 'host' );

		$this->assertEquals( $result, 'www.example.com', 'URL Parsed Host does not match www.example.com' );
	}
}
