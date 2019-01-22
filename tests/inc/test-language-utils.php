<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

/**
 * Unit Test Class.
 */
class WPSEO_Language_Utils_Test extends PHPUnit_Framework_TestCase {

	/**
	 * Test the get_language function with no argument
	 *
	 * @covers WPSEO_Language_Utils::get_language()
	 */
	public function test_get_language_no_argument() {
		$language = WPSEO_Language_Utils::get_language();

		$this->assertEquals( 'en', $language );
	}

	/**
	 * Test the get_language with the en_GB argument.
	 *
	 * @covers WPSEO_Language_Utils::get_language()
	 */
	public function test_get_language_english() {
		$language = WPSEO_Language_Utils::get_language( 'en_GB' );

		$this->assertEquals( 'en', $language );
	}

	public function test_get_language() {
		$this->assertEquals( 'en', WPSEO_Language_Utils::get_language( '' ) );
		$this->assertEquals( 'en', WPSEO_Language_Utils::get_language( 'a' ) );
		$this->assertEquals( 'nl', WPSEO_Language_Utils::get_language( 'nl_NL' ) );
		$this->assertEquals( 'nl', WPSEO_Language_Utils::get_language( 'nl_XX' ) );
		$this->assertEquals( 'nl', WPSEO_Language_Utils::get_language( 'nl' ) );
		$this->assertEquals( 'haw', WPSEO_Language_Utils::get_language( 'haw_US' ) );
		$this->assertEquals( 'rhg', WPSEO_Language_Utils::get_language( 'rhg' ) );
		$this->assertEquals( 'en', WPSEO_Language_Utils::get_language( 'xxxx' ) );
		$this->assertEquals( 'en', WPSEO_Language_Utils::get_language( 'xxxx_XX' ) );
		$this->assertEquals( 'en', WPSEO_Language_Utils::get_language( '_XX' ) );
	}
}
