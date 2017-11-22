<?php
/**
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
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
	 *
	 * @param int    $score     The decimal score to translate.
	 * @param bool   $css_value Whether to return the i18n translated score or the CSS class value.
	 * @param string $expected  Expected function result.
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
			array( 1, false, 'Needs improvement' ),
			array( 23, false, 'Needs improvement' ),
			array( 40, false, 'Needs improvement' ),
			array( 41, false, 'OK' ),
			array( 55, false, 'OK' ),
			array( 70, false, 'OK' ),
			array( 71, false, 'Good' ),
			array( 83, false, 'Good' ),
			array( 100, false, 'Good' ),
		);
	}

	/**
	 * When current page is not in the list of Yoast SEO Free, is_yoast_seo_free_page should return false.
	 *
	 * @covers WPSEO_Utils::is_yoast_seo_free_page
	 */
	public function test_current_page_not_in_yoast_seo_free_pages() {
		$current_page = '';

		$this->assertFalse( WPSEO_Utils::is_yoast_seo_free_page( $current_page ) );
	}

	/**
	 * When current page is not in the list of Yoast SEO Free, but is a page of one of the plugin' addons,
	 * the function should return false.
	 *
	 * @covers WPSEO_Utils::is_yoast_seo_free_page
	 */
	public function test_current_page_not_in_yoast_seo_free_pages_but_is_yoast_seo_addon_page() {
		$current_page = 'wpseo_news';

		$this->assertFalse( WPSEO_Utils::is_yoast_seo_free_page( $current_page ) );
	}

	/**
	 * When the current page belongs to Yoast SEO Free, the function is_yoast_seo_free_page should return true.
	 *
	 * @covers WPSEO_Utils::is_yoast_seo_free_page
	 */
	public function test_current_page_in_yoast_seo_free_pages() {
		$current_page = 'wpseo_dashboard';

		$this->assertTrue( WPSEO_Utils::is_yoast_seo_free_page( $current_page ) );
	}

	public function test_get_language() {
		$this->assertEquals( 'en', WPSEO_Utils::get_language( '' ) );
		$this->assertEquals( 'en', WPSEO_Utils::get_language( 'a' ) );
		$this->assertEquals( 'nl', WPSEO_Utils::get_language( 'nl_NL' ) );
		$this->assertEquals( 'nl', WPSEO_Utils::get_language( 'nl_XX' ) );
		$this->assertEquals( 'nl', WPSEO_Utils::get_language( 'nl' ) );
	}
}
