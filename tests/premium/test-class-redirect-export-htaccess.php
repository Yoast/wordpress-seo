<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_Export_Htaccess
 */
class WPSEO_Redirect_Export_Htaccess_Test extends WPSEO_UnitTestCase {

	/**
	 * Testing if the export method will be called and returns true
	 *
	 * @covers WPSEO_Redirect_Export_File::export
	 * @covers WPSEO_Redirect_Export_Htaccess::save
	 */
	public function test_export() {
		$class_instance = $this->getMock( 'WPSEO_Redirect_Export_Htaccess', array( 'save' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'save' )
			->will( $this->returnValue( true ) );

		$this->assertTrue(
			$class_instance->export(
				array(
					new WPSEO_Redirect( 'origin', 'target', '301', WPSEO_Redirect::FORMAT_PLAIN ),
				)
			)
		);
	}

	/**
	 *
	 * Testing if the export method will be called and returns true
	 *
	 * @covers WPSEO_Redirect_Export_File::export
	 */
	public function test_export_empty() {
		$class_instance = new WPSEO_Redirect_Export_Htaccess();

		$this->assertFalse( $class_instance->export( array() ) );
	}

	/**
	 * Test if formatting will be done correctly
	 *
	 * @covers WPSEO_Redirect_Export_File::format
	 * @covers WPSEO_Redirect_Export_File::get_format
	 */
	public function test_format() {
		$class_instance = new WPSEO_Redirect_Export_Htaccess();

		$this->assertEquals(
			'Redirect 301 "/origin" "/target"',
			$class_instance->format( new WPSEO_Redirect( 'origin', 'target', '301', WPSEO_Redirect::FORMAT_PLAIN ) )
		);


		$this->assertEquals(
			'RedirectMatch 301 test([a-z]*) /target',
			$class_instance->format( new WPSEO_Redirect( 'test([a-z]*)', 'target', '301', WPSEO_Redirect::FORMAT_REGEX ) )
		);
	}

}
