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
	 * Test if the get_options function returns an empty array if you pass an empty array.
	 *
	 * @covers WPSEO_Options::get_options
	 */
	public function test_get_options_IS_EMPTY_with_empty_array() {
		$result = WPSEO_Options::get_options(array());
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get_options function returns an empty array if you pass nonexistent options.
	 *
	 * @covers WPSEO_Options::get_options
	 */
	public function test_get_options_IS_EMPTY_with_invalid_option_names() {
		$result = WPSEO_Options::get_options( array('nonexistent_option_one', 'nonexistent_option_two') );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get_options function returns an array containing two of the correct keys when entering an array with two valid optionnames.
	 *
	 * @covers WPSEO_Options::get_options
	 */
	public function test_get_options_HAS_VALID_KEYS_with_valid_option_names() {
		$result = WPSEO_Options::get_options( array( 'wpseo_social', 'wpseo_titles' ) );
		$this->assertArrayHasKey( 'opengraph', $result );
		$this->assertArrayHasKey( 'metakey-home-wpseo', $result );
	}


	/**
	 * Test if the get_option function returns an empty array if you pass null.
	 *
	 * @covers WPSEO_Options::get_option
	 */
	public function test_get_option_IS_EMPTY_with_null() {
		$result = WPSEO_Options::get_option( null );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get_option function returns an empty array if you pass an empty string.
	 *
	 * @covers WPSEO_Options::get_option
	 */
	public function test_get_option_IS_EMPTY_with_empty_string() {
		$result = WPSEO_Options::get_option( '' );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get_option function returns an empty array if you pass an nonexistent option.
	 *
	 * @covers WPSEO_Options::get_option
	 */
	public function test_get_option_IS_EMPTY_with_invalid_option_name() {
		$result = WPSEO_Options::get_option( 'nonexistent_option' );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get_option function returns an array containing one of the correct keys when entering an array with a single valid optionname.
	 *
	 * @covers WPSEO_Options::get_option
	 */
	public function test_get_option_IS_VALID_with_valid_option_name() {
		$result = WPSEO_Options::get_option( 'wpseo'  );
		$this->assertArrayHasKey( 'website_name', $result );
	}
}