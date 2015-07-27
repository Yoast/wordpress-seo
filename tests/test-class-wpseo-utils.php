<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Utils_Test extends WPSEO_UnitTestCase {


	/**
	 * @covers WPSEO_Options::grant_access
	 */
	public function test_grant_access() {

		if ( is_multisite() ) {
			// should be true when not running multisite
			$this->assertTrue( WPSEO_Utils::grant_access() );
			return; // stop testing, not multisite
		}

		// admins should return true
		$user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $user_id );
		$this->assertTrue( WPSEO_Utils::grant_access() );

		// todo test for superadmins

		// editors should return false
		// $user_id = $this->factory->user->create( array( 'role' => 'editor' ) );
		// wp_set_current_user( $user_id );
		// $this->assertTrue( WPSEO_Options::grant_access() );
	}

	/**
	* @covers wpseo_is_apache()
	*/
	public function test_wpseo_is_apache() {
		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertTrue( WPSEO_Utils::is_apache() );

		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertFalse( WPSEO_Utils::is_apache() );
	}

	/**
	* @covers test_wpseo_is_nginx()
	*/
	public function test_wpseo_is_nginx() {
		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertTrue( WPSEO_Utils::is_nginx() );

		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertFalse( WPSEO_Utils::is_nginx() );
	}

	/**
	 * @covers WPSEO_Utils::trim_nbsp_from_string()
	 */
	public function test_wpseo_trim_nbsp_from_string() {
		$old_string = ' This is an old string with&nbsp;as spaces.&nbsp;';
		$expected   = 'This is an old string with as spaces.';

		$this->assertEquals( $expected, WPSEO_Utils::trim_nbsp_from_string( $old_string ) );
	}

	/**
	 * Test the datetime with a valid date string
	 *
	 * @covers WPSEO_Utils::is_valid_datetime
	 */
	public function test_is_valid_datetime_WITH_valid_datetime() {
		$this->assertTrue( WPSEO_Utils::is_valid_datetime( '2015-02-25T04:44:44+00:00' ) );
	}

	/**
	 * Test the datetime with an invalid date string
	 *
	 * @covers WPSEO_Utils::is_valid_datetime
	 */
	public function test_is_valid_datetime_WITH_invalid_datetime() {
		$this->assertFalse( WPSEO_Utils::is_valid_datetime( '-0001-11-30T00:00:00+00:00' ) );
	}

	/**
	 * Tests translate_score function
	 *
	 * @dataProvider translate_score_provider
	 * @covers WPSEO_Utils::translate_score()
	 */
	public function test_translate_score( $score, $css_value, $expected ) {
		$this->assertEquals( $expected, WPSEO_Utils::translate_score( $score, $css_value ) );
	}

	/**
	 * Provides test data for test_translate_score
	 *
	 * @return array
	 */
	public function translate_score_provider() {
		return array(
			array( 0, true, 'na' ),
			array( 1, true, 'bad' ),
			array( 20, true, 'bad' ),
			array( 34, true, 'bad' ),
			array( 35, true, 'poor' ),
			array( 49, true, 'poor' ),
			array( 54, true, 'poor' ),
			array( 55, true, 'ok' ),
			array( 60, true, 'ok' ),
			array( 74, true, 'ok' ),
			array( 75, true, 'good' ),
			array( 87, true, 'good' ),
			array( 100, true, 'good' ),
			array( 0, false, 'N/A' ),
			array( 1, false, 'Bad' ),
			array( 20, false, 'Bad' ),
			array( 34, false, 'Bad' ),
			array( 35, false, 'Poor' ),
			array( 49, false, 'Poor' ),
			array( 54, false, 'Poor' ),
			array( 55, false, 'OK' ),
			array( 60, false, 'OK' ),
			array( 74, false, 'OK' ),
			array( 75, false, 'Good' ),
			array( 87, false, 'Good' ),
			array( 100, false, 'Good' ),
		);
	}
}
