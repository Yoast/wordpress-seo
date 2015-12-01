<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect
 */
class WPSEO_Redirect_Export_Option_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Exporter_Option
	 */
	private $class_instance;

	/**
	 * Setting the class instance with an instanste of the exporter class
	 */
	public function setUp() {
		$this->class_instance = new WPSEO_Redirect_Exporter_Option();
	}

	/**
	 * Delete the options on teardown
	 */
	public function tearDown() {
		delete_option( WPSEO_Redirect_Option::OPTION_PLAIN );

		delete_option( WPSEO_Redirect_Option::OPTION_REGEX );
	}

	/**
	 * Test the exporting of plain redirects
	 *
	 * @covers WPSEO_Redirect_Exporter_Option::export
	 */
	public function test_export_plain() {
		$redirects = array(
			new WPSEO_Redirect( 'plain_origin', 'plain_target', 301, WPSEO_Redirect::FORMAT_PLAIN ),
		);

		$this->class_instance->export( $redirects );

		$plain_redirects  = get_option( WPSEO_Redirect_Option::OPTION_PLAIN );

		$this->assertTrue( array_key_exists( 'plain_origin', $plain_redirects ) );
		$this->assertEquals( 'plain_target', $plain_redirects['plain_origin']['url'] );
		$this->assertEquals( '301', $plain_redirects['plain_origin']['type'] );
	}

	/**
	 * Test the exporting of plain redirects
	 *
	 * @covers WPSEO_Redirect_Exporter_Option::export
	 */
	public function test_export_regex() {
		$redirects = array(
			new WPSEO_Redirect( 'regex_origin', 'regex_target', 301, WPSEO_Redirect::FORMAT_REGEX ),
		);

		$this->class_instance->export( $redirects );

		$regex_redirects  = get_option( WPSEO_Redirect_Option::OPTION_REGEX );

		$this->assertTrue( array_key_exists( 'regex_origin', $regex_redirects ) );
		$this->assertEquals( 'regex_target', $regex_redirects['regex_origin']['url'] );
		$this->assertEquals( '301', $regex_redirects['regex_origin']['type'] );
	}

	/**
	 * Test the formatting of the redirect
	 *
	 * @covers WPSEO_Redirect_Exporter_Option::format
	 */
	public function test_format() {
		$this->assertEquals(
			array( 'url' => 'plain_target', 'type' => 301 ),
			$this->class_instance->format(
				new WPSEO_Redirect( 'plain_origin', 'plain_target', 301, WPSEO_Redirect::FORMAT_PLAIN )
			)
		);

		$this->assertEquals(
			array( 'url' => 'regex_target', 'type' => 301 ),
			$this->class_instance->format(
				new WPSEO_Redirect( 'regex_origin', 'regex_target', 301, WPSEO_Redirect::FORMAT_REGEX )
			)
		);
	}


}
