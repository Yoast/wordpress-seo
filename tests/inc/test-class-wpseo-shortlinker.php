<?php
/**
 * @package WPSEO\Tests\Inc
 */

class WPSEO_Shortlinker_Test extends PHPUnit_Framework_TestCase {

	public function test_build_shortlink() {
		$shortlinks = new WPSEO_Shortlinker( 'version' );

		$shortlink = $shortlinks->build_shortlink( 'http://yoa.st/abcdefg' );

		$this->assertEquals( 'http://yoa.st/abcdefg?utm_content=version', $shortlink );
	}

	public function test_get() {
		$shortlink = WPSEO_Shortlinker::get( 'http://yoa.st/blaat' );

		$this->assertEquals( 'http://yoa.st/blaat?utm_content=' . WPSEO_VERSION, $shortlink );
	}
}
