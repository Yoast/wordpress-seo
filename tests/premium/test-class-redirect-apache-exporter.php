<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_Export_Apache
 */
class WPSEO_Redirect_Apache_Exporter_Test extends WPSEO_UnitTestCase {

	/**
	 * Testing if the export method will be called and returns true
	 *
	 * @covers WPSEO_Redirect_Apache_Exporter::export
	 */
	public function test_export() {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Redirect_Apache_Exporter' )
			->setMethods( array( 'save' ) )
			->getMock();

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
	 * @covers WPSEO_Redirect_Apache_Exporter::export
	 */
	public function test_export_empty() {
		$class_instance = new WPSEO_Redirect_Apache_Exporter();

		$this->assertTrue( $class_instance->export( array() ) );
	}

	/**
	 * Test if formatting will be done correctly
	 *
	 * @covers WPSEO_Redirect_Apache_Exporter::format
	 */
	public function test_format() {
		$class_instance = new WPSEO_Redirect_Apache_Exporter();

		$this->assertEquals(
			'Redirect 301 "/origin" "/target"',
			$class_instance->format( new WPSEO_Redirect( 'origin', 'target', '301', WPSEO_Redirect::FORMAT_PLAIN ) )
		);

		$this->assertEquals(
			'RedirectMatch 301 test([a-z]*) target',
			$class_instance->format( new WPSEO_Redirect( 'test([a-z]*)', 'target', '301', WPSEO_Redirect::FORMAT_REGEX ) )
		);
	}

	/**
	 * Test if formatting will be done correctly
	 *
	 * @covers WPSEO_Redirect_Apache_Exporter::format
	 * @covers WPSEO_Redirect_Apache_Exporter::add_url_slash
	 */
	public function test_format_add_url_slash() {
		$class_instance = new WPSEO_Redirect_Apache_Exporter();

		$this->assertEquals(
			'Redirect 301 "/origin-no-slashes" "/target-no-slashes"',
			$class_instance->format( new WPSEO_Redirect( 'origin-no-slashes', 'target-no-slashes', '301', WPSEO_Redirect::FORMAT_PLAIN ) )
		);

	}

}
