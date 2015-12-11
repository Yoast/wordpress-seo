<?php

class WPSEO_Options_Test extends WPSEO_UnitTestCase {

	public function setUp() {
		parent::setUp();
		WPSEO_Options::get_instance();
	}

	/**
	 * Tests if the get_all function returns an array with at least the indexses associated with the options: wpseo, wpseo-rss and wpseo_internallinks.
	 *
	 * @covers WPSEO_Options::get_all
	 */
	public function test_get_all_HAS_VALID_KEYS() {
		$result = WPSEO_Options::get_all();
		$this->assertArrayHasKey( 'website_name', $result );
		$this->assertArrayHasKey( 'rssbefore', $result );
		$this->assertArrayHasKey( 'breadcrumbs-prefix', $result );
	}


	/**
	 * Test if the get function returns an empty array if you pass an empty array.
	 *
	 * @covers WPSEO_Options::get
	 */
	public function test_get_IS_EMPTY_array() {
		$result = WPSEO_Options::get( array() );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get function returns an empty array if you pass an array with an empty string.
	 *
	 * @covers WPSEO_Options::get
	 */
	public function test_get_IS_EMPTY_array_with_empty_string() {
		$result = WPSEO_Options::get( array( '' ) );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get function returns an empty array if you pass an empty string
	 *
	 * @covers WPSEO_Options::get
	 */
	public function test_get_IS_EMPTY_empty_string() {
		$result = WPSEO_Options::get( '' );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get function returns an empty array if you pass an nonexistent option in an array.
	 *
	 * @covers WPSEO_Options::get
	 */
	public function test_get_IS_EMPTY_invalid_array_single_input() {
		$result = WPSEO_Options::get( array( 'nonexistent_option' ) );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get function returns an empty array if you pass an nonexistent option in a string.
	 *
	 * @covers WPSEO_Options::get
	 */
	public function test_get_IS_EMPTY_invalid_string_single_input() {
		$result = WPSEO_Options::get( 'nonexistent_option' );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get function returns an array containing one of the correct keys when entering an array with a single optionname.
	 *
	 * @covers WPSEO_Options::get
	 */
	public function test_get_IS_VALID_array_single_input() {
		$result = WPSEO_Options::get( array( 'wpseo' ) );
		$this->assertArrayHasKey( 'website_name', $result );
	}

	/**
	 * Test if the get function returns an array containing one of the correct keys when entering a string with a single optionname.
	 *
	 * @covers WPSEO_Options::get
	 */
	public function test_get_IS_VALID_string_single_input() {
		$result = WPSEO_Options::get( 'wpseo' );
		$this->assertArrayHasKey( 'website_name', $result );
	}

	/**
	 * Test if the get function returns an array containing two of the correct keys when entering an array with two optionnames.
	 *
	 * @covers WPSEO_Options::get
	 */
	public function test_get_IS_VALID_array_multiple_input() {
		$result = WPSEO_Options::get( array( 'wpseo_social', 'wpseo_titles' ) );
		$this->assertArrayHasKey( 'opengraph', $result );
		$this->assertArrayHasKey( 'metakey-home-wpseo', $result );
	}
}