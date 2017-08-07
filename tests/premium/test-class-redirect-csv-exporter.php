<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_Export_CSV
 */
class WPSEO_Redirect_CSV_Exporter_Test extends WPSEO_UnitTestCase {

	/**
	 * Testing if the export method returns CSV containing the redirect.
	 *
	 * @covers WPSEO_Redirect_CSV_Exporter::export
	 */
	public function test_export() {
		$class_instance = new WPSEO_Redirect_CSV_Exporter();

		$this->assertContains(
			"\norigin,target,301,plain\n",
			$class_instance->export(
				array(
					new WPSEO_Redirect( 'origin', 'target', '301', WPSEO_Redirect::FORMAT_PLAIN ),
				)
			)
		);
	}

	/**
	 *
	 * Testing if the export method returns CSV containing only the headers.
	 *
	 * @covers WPSEO_Redirect_Apache_Exporter::export
	 */
	public function test_export_empty() {
		$class_instance = new WPSEO_Redirect_Apache_Exporter();

		// Match any combination of word characters and commas in the headers and a single new-line.
		$this->assertRegExp( '/\A[\w,]+\n\Z/i', $class_instance->export( array() ) );
	}
}
