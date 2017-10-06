<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_Export_CSV.
 */
class WPSEO_Redirect_CSV_Exporter_Test extends WPSEO_UnitTestCase {

	private $csvRegex = '/([^,"\n]+|"[^"]*")(,|\n)?+/';

	/**
	 * Reset WPSEO_Redirect_Util::$has_permalink_trailing_slash so it does not interfere in other tests.
	 */
	public function tearDown() {
		WPSEO_Redirect_Util::$has_permalink_trailing_slash = null;
		parent::tearDown();
	}

	/**
	 * Testing if the export method returns CSV containing the redirect.
	 *
	 * @covers WPSEO_Redirect_CSV_Exporter::export
	 */
	public function test_export_with_trailing_slash() {
		WPSEO_Redirect_Util::$has_permalink_trailing_slash = true;

		$class_instance = new WPSEO_Redirect_CSV_Exporter();

		$csv = $class_instance->export(
			array(
				new WPSEO_Redirect( 'origin', 'target', '301', WPSEO_Redirect::FORMAT_PLAIN ),
			)
		);

		$this->expectNumberOfCsvValues( $csv, 8 );

		$lines = explode( "\n", $csv );

		$this->assertCount( 2, $lines );

		$this->assertEquals( '"/origin","/target/","301","plain"', $lines[1] );
	}

	/**
	 * Testing if the export method returns CSV containing the redirect without trailing slash.
	 *
	 * @covers WPSEO_Redirect_CSV_Exporter::export
	 */
	public function test_export_without_trailing_slash() {
		WPSEO_Redirect_Util::$has_permalink_trailing_slash = false;

		$class_instance = new WPSEO_Redirect_CSV_Exporter();

		$csv = $class_instance->export(
			array(
				new WPSEO_Redirect( 'origin', 'target', '301', WPSEO_Redirect::FORMAT_PLAIN ),
			)
		);

		$this->expectNumberOfCsvValues( $csv, 8 );

		$lines = explode( "\n", $csv );

		$this->assertCount( 2, $lines );

		$this->assertEquals( '"/origin","/target","301","plain"', $lines[1] );
	}

	/**
	 * Testing if the export method returns CSV containing only the headers.
	 *
	 * @covers WPSEO_Redirect_CSV_Exporter::export
	 */
	public function test_export_empty() {
		$class_instance = new WPSEO_Redirect_CSV_Exporter();

		$csv = $class_instance->export( array() );

		$this->expectNumberOfCsvValues( $csv, 4 );

		$lines = explode( "\n", $csv );

		$this->assertCount( 1, $lines );

	}

	/**
	 * Testing if the export method returns the expected number of values when dealing with URLs containg commas.
	 *
	 * @covers WPSEO_Redirect_CSV_Exporter::export
	 */
	public function test_export_comma_url() {
		$class_instance = new WPSEO_Redirect_CSV_Exporter();

		$csv = $class_instance->export(
			array(
				new WPSEO_Redirect( 'origin?q=1,2', 'target?q=1,2', '301', WPSEO_Redirect::FORMAT_PLAIN ),
			)
		);

		$this->expectNumberOfCsvValues( $csv, 8 );

		$lines = explode( "\n", $csv );

		$this->assertCount( 2, $lines );

		$this->assertEquals( '"/origin?q=1,2","/target?q=1,2","301","plain"', $lines[1] );
	}

	/**
	 * Testing if the export method returns the expected number of values when dealing with things that aren't redirects.
	 *
	 * @covers WPSEO_Redirect_CSV_Exporter::export
	 */
	public function test_export_wrong_type() {
		$class_instance = new WPSEO_Redirect_CSV_Exporter();

		$csv = $class_instance->export( array( 'random', 'strings', 'and', 'numbers', 2, 3, 4 ) );

		$this->expectNumberOfCsvValues( $csv, 4 );

		$lines = explode( "\n", $csv );

		$this->assertCount( 1, $lines );
	}

	/**
	 * Testing if the export method returns double quotes correctly when dealing with urls containing double quotes.
	 *
	 * @covers WPSEO_Redirect_CSV_Exporter::export
	 */
	public function test_export_quotes() {
		$class_instance = new WPSEO_Redirect_CSV_Exporter();

		$csv = $class_instance->export(
			array(
				new WPSEO_Redirect( 'origin?q="1,2"', 'target?q=1,2', '301', WPSEO_Redirect::FORMAT_PLAIN ),
			)
		);

		$lines = explode( "\n", $csv );

		$this->assertCount( 2, $lines );

		$this->assertEquals( '"/origin?q=""1,2""","/target?q=1,2","301","plain"', $lines[1] );
	}

	public function test_export_regex() {
		$class_instance = new WPSEO_Redirect_CSV_Exporter();

		$csv = $class_instance->export(
			array(
				new WPSEO_Redirect( '\A\d+\Z', 'numbers', '301', WPSEO_Redirect::FORMAT_REGEX ),
			)
		);

		$lines = explode( "\n", $csv );

		$this->assertCount( 2, $lines );

		$this->assertEquals( '"\A\d+\Z","/numbers","301","regex"', $lines[1] );
	}

	/**
	 * Asserts if the CSV string contains the expected number of values.
	 * Currently using a Regex as str_getcsv requires PHP 5.3 while we still support PHP 5.2.
	 *
	 * @param string $csv A string of CSV.
	 * @param int $rows Number of values expected.
	 */
	private function expectNumberOfCsvValues( $csv, $rows ) {
		$this->assertEquals( $rows, preg_match_all( $this->csvRegex, $csv, $matches ) );
	}
}
