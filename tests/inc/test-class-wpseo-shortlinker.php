<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

/**
 * Unit Test Class.
 */
class WPSEO_Shortlinker_Test extends PHPUnit_Framework_TestCase {

	/**
	 * Tests building a shortlink.
	 *
	 * @covers WPSEO_Shortlinker::build_shortlink
	 * @covers WPSEO_Shortlinker::get_filtered_user_role
	 * @covers WPSEO_Shortlinker::get_php_version
	 * @covers WPSEO_Shortlinker::get_software
	 */
	public function test_build_shortlink() {
		$shortlinks = new WPSEO_Shortlinker();

		$shortlink = $shortlinks->build_shortlink( 'http://yoa.st/abcdefg' );

		$this->assertContains( 'php_version', $shortlink );
		$this->assertContains( 'platform_version', $shortlink );
		$this->assertContains( 'software', $shortlink );
	}

	/**
	 * Tests getting a shortlink.
	 *
	 * @covers WPSEO_Shortlinker::get
	 * @covers WPSEO_Shortlinker::get_filtered_user_role
	 * @covers WPSEO_Shortlinker::get_php_version
	 * @covers WPSEO_Shortlinker::get_software
	 */
	public function test_get() {
		$shortlink = WPSEO_Shortlinker::get( 'http://yoa.st/blaat' );

		$this->assertContains( 'php_version', $shortlink );
		$this->assertContains( 'platform_version', $shortlink );
		$this->assertContains( 'software', $shortlink );
	}

	/**
	 * Tests getting a shortlink.
	 *
	 * @covers WPSEO_Shortlinker::show
	 * @covers WPSEO_Shortlinker::get_filtered_user_role
	 * @covers WPSEO_Shortlinker::get_php_version
	 * @covers WPSEO_Shortlinker::get_software
	 */
	public function test_show() {
		ob_start();
		WPSEO_Shortlinker::show( 'http://yoa.st/blaat' );
		$shortlink = ob_get_clean();

		$this->assertContains( 'php_version', $shortlink );
		$this->assertContains( 'platform_version', $shortlink );
		$this->assertContains( 'software', $shortlink );
	}

	/**
	 * Tests getting the encoded query data.
	 *
	 * @covers WPSEO_Shortlinker::get_encoded_query
	 * @covers WPSEO_Shortlinker::collect_additional_shortlink_data
	 */
	public function test_get_encoded_query() {
		$encoded_query = WPSEO_Shortlinker::get_encoded_query();

		$this->assertContains( 'php_version', $encoded_query );
		$this->assertContains( 'platform_version', $encoded_query );
		$this->assertContains( 'software', $encoded_query );
	}

	/**
	 * Tests getting the query params.
	 *
	 * @covers WPSEO_Shortlinker::get_query_params
	 * @covers WPSEO_Shortlinker::collect_additional_shortlink_data
	 */
	public function test_get_query_params() {
		$query_param_keys = array_keys( WPSEO_Shortlinker::get_query_params() );

		$this->assertContains( 'php_version', $query_param_keys );
		$this->assertContains( 'platform_version', $query_param_keys );
		$this->assertContains( 'software', $query_param_keys );
	}
}
