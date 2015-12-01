<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_File_Nginx
 **/
class WPSEO_Redirect_Exporter_Nginx_Test extends WPSEO_UnitTestCase {

	/**
	 * Testing if the export method will be called and returns true
	 *
	 * @covers WPSEO_Redirect_Export_File::export
	 */
	public function test_export() {
		$class_instance = $this->getMock( 'WPSEO_Redirect_Exporter_Nginx', array( 'save' ) );

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
		$class_instance = new WPSEO_Redirect_Exporter_Nginx();

		$this->assertFalse( $class_instance->export( array() ) );
	}

	/**
	 * Test if formatting will be done correctly
	 *
	 * @covers WPSEO_Redirect_Exporter_File::format
	 */
	public function test_format() {
		$class_instance = new WPSEO_Redirect_Exporter_Nginx();

		$this->assertEquals(
			'location target { add_header X-Redirect-By \"Yoast SEO Premium\"; return origin 301; }',
			$class_instance->format( new WPSEO_Redirect( 'origin', 'target', '301', WPSEO_Redirect::FORMAT_PLAIN ) )
		);

		$this->assertEquals(
			'location ~ target { return test([a-z]*) 301; }',
			$class_instance->format( new WPSEO_Redirect( 'test([a-z]*)', 'target', '301', WPSEO_Redirect::FORMAT_REGEX ) )
		);
	}

}
