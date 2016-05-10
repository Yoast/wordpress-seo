<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Utils_Test extends WPSEO_UnitTestCase {


	/**
	 * @covers WPSEO_Options::grant_access
	 */
	public function test_grant_access() {

		if ( ! is_multisite() ) { // Should be true when not running multisite.
			$this->assertTrue( WPSEO_Utils::grant_access() );
			return;
		}

		// Admin required by default/option.
		$user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $user_id );
		$this->assertTrue( WPSEO_Utils::grant_access() );

		// Super Admin required by option.
		$options           = get_site_option( 'wpseo_ms' );
		$options['access'] = 'superadmin';
		update_site_option( 'wpseo_ms', $options );
		$this->assertFalse( WPSEO_Utils::grant_access() );

		grant_super_admin( $user_id );
		$this->assertTrue( WPSEO_Utils::grant_access() );

		// Below admin not allowed.
		$user_id = $this->factory->user->create( array( 'role' => 'editor' ) );
		wp_set_current_user( $user_id );
		$this->assertFalse( WPSEO_Utils::grant_access() );
	}

	/**
	 * @covers WPSEO_Utils::is_apache()
	 */
	public function test_wpseo_is_apache() {
		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertTrue( WPSEO_Utils::is_apache() );

		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertFalse( WPSEO_Utils::is_apache() );
	}

	/**
	 * @covers WPSEO_Utils::is_nginx()
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
			array( 23, true, 'bad' ),
			array( 40, true, 'bad' ),
			array( 41, true, 'ok' ),
			array( 55, true, 'ok' ),
			array( 70, true, 'ok' ),
			array( 71, true, 'good' ),
			array( 83, true, 'good' ),
			array( 100, true, 'good' ),
			array( 0, false, 'Not available' ),
			array( 1, false, 'Bad' ),
			array( 23, false, 'Bad' ),
			array( 40, false, 'Bad' ),
			array( 41, false, 'OK' ),
			array( 55, false, 'OK' ),
			array( 70, false, 'OK' ),
			array( 71, false, 'Good' ),
			array( 83, false, 'Good' ),
			array( 100, false, 'Good' ),
		);
	}
}
