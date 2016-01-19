<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_File_Nginx
 **/
class WPSEO_Redirect_Nginx_Exporter_Test extends WPSEO_UnitTestCase {

	/**
	 * Testing if the export method will be called and returns true
	 *
	 * @covers WPSEO_Redirect_Nginx_Exporter::export
	 */
	public function test_export() {
		$class_instance = $this->getMock( 'WPSEO_Redirect_Nginx_Exporter', array( 'save' ) );

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
	 * @covers WPSEO_Redirect_Nginx_Exporter::export
	 */
	public function test_export_empty() {
		$class_instance = new WPSEO_Redirect_Nginx_Exporter();

		$this->assertFalse( $class_instance->export( array() ) );
	}

	/**
	 * Test if formatting will be done correctly
	 *
	 * @covers WPSEO_Redirect_Nginx_Exporter::format
	 */
	public function test_format() {
		$class_instance = new WPSEO_Redirect_Nginx_Exporter();

		$this->assertEquals(
			'location /origin { add_header X-Redirect-By "Yoast SEO Premium"; return 301 target; }',
			$class_instance->format( new WPSEO_Redirect( 'origin', 'target', '301', WPSEO_Redirect::FORMAT_PLAIN ) )
		);

		$this->assertEquals(
			'location ~ test([a-z]*) { add_header X-Redirect-By "Yoast SEO Premium"; return 301 target; }',
			$class_instance->format( new WPSEO_Redirect( 'test([a-z]*)', 'target', '301', WPSEO_Redirect::FORMAT_REGEX ) )
		);
	}

	/**
	 * Test if formatting will be done correctly
	 *
	 * @covers WPSEO_Redirect_Nginx_Exporter::format
	 */
	public function test_format_with_filter_to_disable_add_header() {

		add_filter( 'wpseo_add_x_redirect', '__return_false' );

		$class_instance = new WPSEO_Redirect_Nginx_Exporter();

		$this->assertEquals(
			'location /origin {  return 301 target; }',
			$class_instance->format( new WPSEO_Redirect( 'origin', 'target', '301', WPSEO_Redirect::FORMAT_PLAIN ) )
		);

		$this->assertEquals(
			'location ~ test([a-z]*) {  return 301 target; }',
			$class_instance->format( new WPSEO_Redirect( 'test([a-z]*)', 'target', '301', WPSEO_Redirect::FORMAT_REGEX ) )
		);
	}

}
