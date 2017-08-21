<?php

class WPSEO_Export_Keywords_CSV_Double extends WPSEO_Export_Keywords_CSV {
	public function return_get_headers( $columns ) {
		return $this->get_headers( $columns );
	}

	public function return_format( $result, $columns ) {
		return $this->format( $result, $columns );
	}

	public function return_format_csv_column( $value ) {
		return $this->sanitize_csv_column( $value );
	}

	public function return_get_csv_column_from_result( $result, $key ) {
		return $this->get_csv_string_column_from_result( $result, $key );
	}
}

class WPSEO_Export_Keywords_CSV_Test extends WPSEO_UnitTestCase {
	/**
	 * Tests the format_csv_column function with input of various types.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::sanitize_csv_column
	 */
	public function test_format_csv_column() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$this->assertEquals('"simple value"', $class_instance->return_format_csv_column( 'simple value' ) );
		$this->assertEquals('"""quotes"""', $class_instance->return_format_csv_column( '"quotes"' ) );
		$this->assertEquals('"3"', $class_instance->return_format_csv_column( 3 ) );
		$this->assertEquals('"3.5"', $class_instance->return_format_csv_column( 3.5 ) );
		$this->assertEquals('"true"', $class_instance->return_format_csv_column( true ) );
		$this->assertEquals('"new line"', $class_instance->return_format_csv_column( "new\nline" ) );
		$this->assertEquals('', $class_instance->return_format_csv_column( null ) );
	}

	public function test_get_csv_column_from_result() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$fake_result = array(
			'ID' => '0',
			'post_title' => 'fake title',
			'post_url' => 'http://www.example.org',
		);

		$this->assertEquals( ',"fake title"', $class_instance->return_get_csv_column_from_result( $fake_result, 'post_title' ) );
		$this->assertEquals( ',"http://www.example.org"', $class_instance->return_get_csv_column_from_result( $fake_result, 'post_url' ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( $fake_result, 'key that does not exist' ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( $fake_result, 5 ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( $fake_result, true ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( $fake_result, null ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( 5, 'key that does not exist' ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( 'foo', 'key that does not exist' ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( true, 'key that does not exist' ) );
		$this->assertEquals( ',', $class_instance->return_get_csv_column_from_result( null, 'key that does not exist' ) );

	}

	/**
	 * Tests the format function with simple input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::format
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_column_from_result
	 * @covers WPSEO_Export_Keywords_CSV::get_array_from_result
	 */
	public function test_format_simple() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$fake_result = array(
			'ID' => '0',
			'post_title' => 'fake title',
			'post_url' => 'http://www.example.org',
		);

		$csv = $class_instance->return_format( $fake_result, array( 'post_title', 'post_url' ) );

		$this->assertEquals( "\n\"0\",\"fake title\",\"http://www.example.org\"", $csv );
	}

	/**
	 * Tests the format function with complex input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::format
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_column_from_result
	 * @covers WPSEO_Export_Keywords_CSV::get_array_from_result
	 */
	public function test_format_complex() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$fake_result = array(
			'ID' => '0',
			'post_title' => 'fake title',
			'post_url' => 'http://www.example.org',
			'seo_score' => 'bad',
			'keywords' => array( 'foo', 'bar', 'baz' ),
			'keywords_score' => array( 'ok', 'good', 'na' )
		);

		$csv = $class_instance->return_format( $fake_result, array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ) );

		$lines = preg_split( "/\n/", $csv, null, PREG_SPLIT_NO_EMPTY );

		// One line for each keyword
		$this->assertCount( 3, $lines );
		$this->assertEquals( "\"0\",\"fake title\",\"http://www.example.org\",\"bad\",\"foo\",\"ok\"", $lines[0] );
		$this->assertEquals( "\"0\",\"fake title\",\"http://www.example.org\",\"bad\",\"bar\",\"good\"", $lines[1] );
		$this->assertEquals( "\"0\",\"fake title\",\"http://www.example.org\",\"bad\",\"baz\",\"na\"", $lines[2] );
	}

	/**
	 * Tests the format function with random input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::format
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_column_from_result
	 * @covers WPSEO_Export_Keywords_CSV::get_array_from_result
	 */
	public function test_format_random() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$csv = $class_instance->return_format( 'foo', array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ) );

		$this->assertEmpty( $csv );

		$csv = $class_instance->return_format( 5, array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ) );

		$this->assertEmpty( $csv );

		$csv = $class_instance->return_format( true, array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ) );

		$this->assertEmpty( $csv );

		$csv = $class_instance->return_format( array(), array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ) );

		$this->assertEmpty( $csv );

		$csv = $class_instance->return_format( array( 'foo' => 'bar' ), array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ) );

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
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$fake_result = array(
			'ID' => '0',
			'post_title' => null,
			'post_url' => null,
			'seo_score' => null,
			'keywords' => null,
			'keywords_score' => null
		);

		$csv = $class_instance->return_format( $fake_result, array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ) );

		$this->assertEquals( "\n\"0\",,,,,", $csv );
	}

	/**
	 * Tests the format function with bad column input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::format
	 * @covers WPSEO_Export_Keywords_CSV::get_csv_column_from_result
	 * @covers WPSEO_Export_Keywords_CSV::get_array_from_result
	 */
	public function test_format_bad_columns() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$fake_result = array(
			'ID' => '0',
			'post_title' => 'fake title',
			'post_url' => 'http://www.example.org',
		);

		$csv = $class_instance->return_format( $fake_result, array( 'post_title', 'post_url', 'foo', 5, true, null ) );

		$this->assertEquals( "\n\"0\",\"fake title\",\"http://www.example.org\"", $csv );
	}

	/**
	 * Tests the get_headers function with expected input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::get_headers
	 */
	public function test_get_headers() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$csv = $class_instance->return_get_headers( array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ) );

		$this->assertEquals( '"ID","post title","post url","seo score","keyword","keyword score"', $csv );
	}

	/**
	 * Tests the get_headers function with bad input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::get_headers
	 */
	public function test_get_headers_bad() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$csv = $class_instance->return_get_headers( array( 'post_title', 'post_url', 'foo', 5, true, null ) );

		$this->assertEquals( '"ID","post title","post url"', $csv );
	}

	/**
	 * Tests the export function with expected input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::export
	 */
	public function test_export() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$fake_results = array(
			array(
				'ID' => '0',
				'post_title' => 'fake title',
				'post_url' => 'http://www.example.org/fake_title',
				'seo_score' => 'bad',
				'keywords' => array( 'foo', 'bar', 'baz' ),
				'keywords_score' => array( 'ok', 'good', 'na' )
			),
			array(
				'ID' => '1',
				'post_title' => 'another title',
				'post_url' => 'http://www.example.org/another_title',
				'seo_score' => 'good',
				'keywords' => array( 'foo', 'bar' ),
				'keywords_score' => array( 'bad', 'bad' )
			),
			array(
				'ID' => '2',
				'post_title' => 'last title',
				'post_url' => 'http://www.example.org/last_title',
				'seo_score' => 'ok',
				'keywords' => array( 'last' ),
				'keywords_score' => array( 'good' )
			),
		);

		$csv = $class_instance->export( $fake_results, array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ) );

		$lines = preg_split( "/\n/", $csv, null, PREG_SPLIT_NO_EMPTY );

		$this->assertCount( 7, $lines );

		$this->assertEquals( '"ID","post title","post url","seo score","keyword","keyword score"', $lines[0] );
		$this->assertEquals( "\"0\",\"fake title\",\"http://www.example.org/fake_title\",\"bad\",\"foo\",\"ok\"", $lines[1] );
		$this->assertEquals( "\"0\",\"fake title\",\"http://www.example.org/fake_title\",\"bad\",\"bar\",\"good\"", $lines[2] );
		$this->assertEquals( "\"0\",\"fake title\",\"http://www.example.org/fake_title\",\"bad\",\"baz\",\"na\"", $lines[3] );
		$this->assertEquals( "\"1\",\"another title\",\"http://www.example.org/another_title\",\"good\",\"foo\",\"bad\"", $lines[4] );
		$this->assertEquals( "\"1\",\"another title\",\"http://www.example.org/another_title\",\"good\",\"bar\",\"bad\"", $lines[5] );
		$this->assertEquals( "\"2\",\"last title\",\"http://www.example.org/last_title\",\"ok\",\"last\",\"good\"", $lines[6] );
	}

	/**
	 * Tests the export function with bad input.
	 *
	 * @covers WPSEO_Export_Keywords_CSV::export
	 */
	public function test_export_bad() {
		$class_instance = new WPSEO_Export_Keywords_CSV_Double();

		$fake_results = array(
			array(
				'ID' => '0',
				'post_title' => 'fake title',
				'post_url' => 'http://www.example.org/fake_title',
				'seo_score' => 'bad',
				'keywords' => array( 'foo', 'bar', 'baz' ),
				'keywords_score' => array( 'ok', 'good', 'na' )
			),
			array(
				'ID' => '1',
				'post_title' => 'another title',
				'post_url' => 'http://www.example.org/another_title',
				'seo_score' => 50,
				'keywords' => true,
				'foo' => 'bar',
			),
			5,
			'baz',
			true,
			null,
		);

		$csv = $class_instance->export( $fake_results, array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ) );

		$lines = preg_split( "/\n/", $csv, null, PREG_SPLIT_NO_EMPTY );

		$this->assertCount( 5, $lines );

		$this->assertEquals( '"ID","post title","post url","seo score","keyword","keyword score"', $lines[0] );
		$this->assertEquals( "\"0\",\"fake title\",\"http://www.example.org/fake_title\",\"bad\",\"foo\",\"ok\"", $lines[1] );
		$this->assertEquals( "\"0\",\"fake title\",\"http://www.example.org/fake_title\",\"bad\",\"bar\",\"good\"", $lines[2] );
		$this->assertEquals( "\"0\",\"fake title\",\"http://www.example.org/fake_title\",\"bad\",\"baz\",\"na\"", $lines[3] );
		$this->assertEquals( "\"1\",\"another title\",\"http://www.example.org/another_title\",\"50\",,", $lines[4] );
	}
}
