<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Unit Test Class.
 * @group test
 */
class WPSEO_Export_Keywords_CSV_Test extends WPSEO_UnitTestCase {

	/**
	 * Include helper class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once WPSEO_TESTS_PATH . 'premium/doubles/export-keywords-csv-double.php';
	}

	/**
	 * Tests the formatting of a row.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::print_row()
	 */
	public function test_format_row() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array() );

		$input = array(
			'ID'   => 1,
			'type' => 'post',
		);

		$this->assertEquals( '"1","post"' . PHP_EOL, $class_instance->return_format( $input ) );
	}

	/**
	 * Tests the format_csv_column function with input of various types.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::sanitize_csv_column
	 */
	public function test_format_csv_column() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array() );

		$this->assertEquals( '"simple value"', $class_instance->return_format_csv_column( 'simple value' ) );
		$this->assertEquals( '"""quotes"""', $class_instance->return_format_csv_column( '"quotes"' ) );
		$this->assertEquals( '"3"', $class_instance->return_format_csv_column( 3 ) );
		$this->assertEquals( '"3.5"', $class_instance->return_format_csv_column( 3.5 ) );
		$this->assertEquals( '"true"', $class_instance->return_format_csv_column( true ) );
		$this->assertEquals( '"new line"', $class_instance->return_format_csv_column( "new\nline" ) );
		$this->assertEquals( '', $class_instance->return_format_csv_column( null ) );
	}

	/**
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_column_from_result()
	 */
	public function test_get_csv_column_from_result() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array() );

		$fake_result = array(
			'ID'    => '0',
			'type'  => 'post',
			'title' => 'fake title',
			'url'   => 'http://www.example.org',
		);

		$this->assertEquals( ',"fake title"', $class_instance->return_get_csv_column_from_result( $fake_result, 'title' ) );
		$this->assertEquals( ',"http://www.example.org"', $class_instance->return_get_csv_column_from_result( $fake_result, 'url' ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( $fake_result, 'key that does not exist' ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( $fake_result, 5 ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( array(), 'key that does not exist' ) );

	}

	/**
	 * Tests the format function with simple input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::format
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_column_from_result
	 * @covers WPSEO_Export_Keywords_CSV::get_array_from_result
	 */
	public function test_format_simple() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array( 'title', 'url' ) );

		$fake_result = array(
			'ID'    => '0',
			'type'  => 'post',
			'title' => 'fake title',
			'url'   => 'http://www.example.org',
		);

		$csv = $class_instance->return_format( $fake_result );

		$this->assertEquals( '"0","post","fake title","http://www.example.org"' . PHP_EOL, $csv );
	}

	/**
	 * Tests the format function with complex input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::format
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_column_from_result
	 * @covers WPSEO_Export_Keywords_CSV::get_array_from_result
	 */
	public function test_format_complex() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array( 'title', 'url', 'readability_score', 'keywords', 'keywords_score', 'seo_title', 'meta_description' ) );

		$fake_result = array(
			'ID'                => '0',
			'type'              => 'post',
			'title'             => 'fake title',
			'url'               => 'http://www.example.org',
			'readability_score' => 'bad',
			'keywords'          => array( 'foo', 'bar', 'baz' ),
			'keywords_score'    => array( 'ok', 'good', 'na' ),
			'seo_title'         => 'fake SEO title',
			'meta_description'  => 'this is a fake meta description',
		);

		$csv = $class_instance->return_format( $fake_result );

		$lines = preg_split( '/' . PHP_EOL . '/', $csv, null, PREG_SPLIT_NO_EMPTY );

		// One line for each keyword.
		$this->assertCount( 3, $lines );
		$this->assertEquals( '"0","post","fake title","http://www.example.org","bad","foo","ok","fake SEO title","this is a fake meta description"',$lines[0] );
		$this->assertEquals( '"0","post","fake title","http://www.example.org","bad","bar","good","fake SEO title","this is a fake meta description"', $lines[1] );
		$this->assertEquals( '"0","post","fake title","http://www.example.org","bad","baz","na","fake SEO title","this is a fake meta description"', $lines[2] );
	}

	/**
	 * Tests the format function with random input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::format
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_column_from_result
	 * @covers WPSEO_Export_Keywords_CSV::get_array_from_result
	 */
	public function test_format_random() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array( 'title', 'url', 'readability_score', 'keywords', 'keywords_score', 'seo_title', 'meta_description' ) );

		$csv = $class_instance->return_format( array() );

		$this->assertEmpty( $csv );

		$csv = $class_instance->return_format( array( 'foo' => 'bar' ) );

		$this->assertEmpty( $csv );
	}

	/**
	 * Tests the format function with null input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::format
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_column_from_result
	 * @covers WPSEO_Export_Keywords_CSV::get_array_from_result
	 */
	public function test_format_null() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array( 'title', 'url', 'readability_score', 'keywords', 'keywords_score', 'seo_title', 'meta_description' ) );

		$fake_result = array(
			'ID'                => '0',
			'type'              => 'post',
			'title'             => null,
			'url'               => null,
			'readability_score' => null,
			'keywords'          => null,
			'keywords_score'    => null,
			'seo_title'         => null,
			'meta_description'  => null,
		);

		$csv = $class_instance->return_format( $fake_result );

		$this->assertEquals( '"0","post",,,,,,,' . PHP_EOL, $csv );
	}

	/**
	 * Tests the format function with bad column input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::format
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_column_from_result
	 * @covers WPSEO_Export_Keywords_CSV::get_array_from_result
	 */
	public function test_format_bad_columns() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array( 'title', 'url', 'foo', 5, true, null ) );

		$fake_result = array(
			'ID'    => '0',
			'type'  => 'post',
			'title' => 'fake title',
			'url'   => 'http://www.example.org',
		);

		$csv = $class_instance->return_format( $fake_result );

		$this->assertEquals( '"0","post","fake title","http://www.example.org"' . PHP_EOL, $csv );
	}

	/**
	 * Tests the get_headers function with expected input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::get_headers
	 */
	public function test_get_headers() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array( 'keywords', 'keywords_score', 'title', 'url', 'readability_score', 'seo_title', 'meta_description' ) );

		$csv = $class_instance->return_get_headers();

		$this->assertEquals( '"ID","type","keyword","keyword score","title","url","readability score","seo title","meta description"' . PHP_EOL, $csv );
	}

	/**
	 * Tests the get_headers function with bad input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::get_headers
	 */
	public function test_get_headers_bad() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array( 'title', 'url', 'foo', 5, true, null ) );

		$csv = $class_instance->return_get_headers();

		$this->assertEquals( '"ID","type","title","url"' . PHP_EOL, $csv );
	}

	/**
	 * Tests the csv formatting method.
	 *
	 * @param array $input          The csv data to test.
	 * @param array $expected_lines The expected lines.
	 *
	 * @dataProvider csv_format_provider
	 *
	 * @covers WPSEO_Export_Keywords_CSV::format
	 */
	public function test_format( $input, array $expected_lines ) {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array( 'title', 'url', 'readability_score', 'keywords', 'keywords_score', 'seo_title', 'meta_description' ) );

		$csv   = $class_instance->return_format( $input );
		$lines = preg_split( '/' . PHP_EOL . '/', $csv, null, PREG_SPLIT_NO_EMPTY );

		$this->assertEquals( $expected_lines, $lines );
	}

	/**
	 * Tests with a valid index.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_array_column_from_result
	 */
	public function test_get_csv_array_column_from_result() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array() );
		$column         = $class_instance->return_get_csv_array_column_from_result(
			array(
				'ID'   => 1,
				'type' => 'post',
				'url'  => array(
					'http://www.example.org/1',
					'http://www.example.org/2',
				),
			),
			'url',
			1
		);

		$this->assertEquals( ',"http://www.example.org/2"', $column );
	}

	/**
	 * Tests with an invalid index.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_array_column_from_result
	 */
	public function test_get_csv_array_column_from_result_invalid_index() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double( array() );

		// The index does not exist.
		$column = $class_instance->return_get_csv_array_column_from_result(
			array(
				'ID'   => 1,
				'type' => 'post',
				'url'  => array(
					'http://www.example.org/1',
					'http://www.example.org/2',
				),
			),
			'url',
			3
		);

		$this->assertEquals( ',', $column );
	}

	/**
	 * Data provider for the test_format method.
	 *
	 * @return array
	 */
	public function csv_format_provider() {
		return array(
			array(
				'input' => array(
					'ID'                => '0',
					'type'              => 'post',
					'title'             => 'fake title',
					'url'               => 'http://www.example.org/fake_title',
					'readability_score' => 'bad',
					'keywords'          => array( 'foo', 'bar', 'baz' ),
					'keywords_score'    => array( 'ok', 'good', 'na' ),
					'seo_title'         => 'fake SEO title',
					'meta_description'  => 'this is a fake meta description',
				),
				'expected' => array(
					'"0","post","fake title","http://www.example.org/fake_title","bad","foo","ok","fake SEO title","this is a fake meta description"',
					'"0","post","fake title","http://www.example.org/fake_title","bad","bar","good","fake SEO title","this is a fake meta description"',
					'"0","post","fake title","http://www.example.org/fake_title","bad","baz","na","fake SEO title","this is a fake meta description"',
				),
			),
			array(
				'input' => array(
					'ID'                => '1',
					'type'              => 'post',
					'title'             => 'another title',
					'url'               => 'http://www.example.org/another_title',
					'readability_score' => 'good',
					'keywords'          => array( 'foo', 'bar' ),
					'keywords_score'    => array( 'bad', 'bad' ),
					'seo_title'         => 'very fake SEO title',
					'meta_description'  => 'this is a very fake meta description',
				),
				'expected' => array(
					'"1","post","another title","http://www.example.org/another_title","good","foo","bad","very fake SEO title","this is a very fake meta description"',
					'"1","post","another title","http://www.example.org/another_title","good","bar","bad","very fake SEO title","this is a very fake meta description"',
				),
			),
			array(
				'input' => array(
					'ID'                => '2',
					'type'              => 'post',
					'title'             => 'last title',
					'url'               => 'http://www.example.org/last_title',
					'readability_score' => 'ok',
					'keywords'          => array( 'last' ),
					'keywords_score'    => array( 'good' ),
					'seo_title'         => 'Another fake SEO title',
					'meta_description'  => 'this is another fake meta description',
				),
				'expected' => array(
					'"2","post","last title","http://www.example.org/last_title","ok","last","good","Another fake SEO title","this is another fake meta description"',
				),

			),

			// Tests the export function with bad input.
			array(
				'input' => array(
					'ID'                => '0',
					'type'              => 'post',
					'title'             => 'fake title',
					'url'               => 'http://www.example.org/fake_title',
					'readability_score' => 'bad',
					'keywords'          => array( 'foo', 'bar', 'baz' ),
					'keywords_score'    => array( 'ok', 'good', 'na' ),
					'seo_title'         => 'fake SEO title',
					'meta_description'  => 'this is a fake meta description',
				),
				'expected' => array(
					'"0","post","fake title","http://www.example.org/fake_title","bad","foo","ok","fake SEO title","this is a fake meta description"',
					'"0","post","fake title","http://www.example.org/fake_title","bad","bar","good","fake SEO title","this is a fake meta description"',
					'"0","post","fake title","http://www.example.org/fake_title","bad","baz","na","fake SEO title","this is a fake meta description"',
				),
			),

			// Tests the export function with bad input.
			array(
				'input' => array(
					'ID'                => '1',
					'type'              => 'post',
					'title'             => 'another title',
					'url'               => 'http://www.example.org/another_title',
					'readability_score' => 50,
					'keywords'          => true,
					'foo'               => 'bar',
					'seo_title'         => null,
					'meta_description'  => null,
				),
				'expected' => array(
					'"1","post","another title","http://www.example.org/another_title","50",,,,',
				),
			),
		);
	}
}
