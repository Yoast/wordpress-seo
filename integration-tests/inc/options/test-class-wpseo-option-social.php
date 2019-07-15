<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc\Options
 */

/**
 * Unit Test Class.
 */
class WPSEO_Option_Social_Test extends WPSEO_UnitTestCase {

	/**
	 * @param string $expected The expected value.
	 * @param array  $dirty    New value for the option.
	 * @param array  $clean    Clean value for the option, normally the defaults.
	 * @param array  $old      Old value of the option.
	 *
	 * @dataProvider validate_option_provider
	 *
	 * @covers WPSEO_Option_Social::validate_option
	 * @covers WPSEO_Option_Social::validate_url
	 */
	public function test_validate_option( $expected, $dirty, $clean, $old ) {
		$instance = new WPSEO_Option_Social_Double();

		$this->assertEquals(
			$expected,
			$instance->validate_option( $dirty, $clean, $old )
		);
	}

	/**
	 * Data for the test_validate_option test.
	 *
	 * @return array The test data.
	 */
	public function validate_option_provider() {
		return array(
			array(
				'expected' => array( 'og_default_image_id' => 'value' ),
				'dirty'    => array(),
				'clean'    => array( 'og_default_image_id' => 'value' ),
				'old'      => array(),
			),
			array(
				'expected' => array( 'og_frontpage_image_id' => 'value' ),
				'dirty'    => array(),
				'clean'    => array( 'og_frontpage_image_id' => 'value' ),
				'old'      => array(),
			),
			array(
				'expected' => array( 'og_default_image_id' => '' ),
				'dirty'    => array( 'og_default_image_id' => '' ),
				'clean'    => array( 'og_default_image_id' => '' ),
				'old'      => array(),
			),
			array(
				'expected' => array( 'og_frontpage_image_id' => '' ),
				'dirty'    => array( 'og_frontpage_image_id' => '' ),
				'clean'    => array( 'og_frontpage_image_id' => '' ),
				'old'      => array(),
			),
			array(
				'expected' => array( 'og_default_image_id' => 123 ),
				'dirty'    => array( 'og_default_image_id' => '123' ),
				'clean'    => array( 'og_default_image_id' => '' ),
				'old'      => array(),
			),
			array(
				'expected' => array( 'og_frontpage_image_id' => 0 ),
				'dirty'    => array( 'og_frontpage_image_id' => 'testen' ),
				'clean'    => array( 'og_frontpage_image_id' => '' ),
				'old'      => array(),
			),
			array(
				'expected' => array( 'facebook_site' => '' ),
				'dirty'    => array( 'facebook_site' => 'invalidurl' ),
				'clean'    => array( 'facebook_site' => '' ),
				'old'      => array(),
			),
			array(
				'expected' => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'dirty'    => array( 'youtube_url' => 'invalidurl' ),
				'clean'    => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'old'      => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
			),
			array(
				'expected' => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'dirty'    => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'clean'    => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'old'      => array(),
			),
		);
	}

	/**
	 * Tests that submitting an option with an invalid URL adds a WordPress settings error notice.
	 *
	 * @covers WPSEO_Option_Social::validate_url
	 */
	public function test_validate_url_adds_settings_error() {
		global $wp_settings_errors;

		$instance = new WPSEO_Option_Social_Double();
		$clean    = array( 'instagram_url' => '' );
		$dirty    = array( 'instagram_url' => 'invalidurl' );

		$settings_error_added = false;

		$instance->validate_url( 'instagram_url', $dirty, '', $clean );

		foreach ( $wp_settings_errors as $error ) {
			if ( $error['setting'] === 'yoast_wpseo_social_options' && $error['code'] === 'instagram_url' ) {
				$settings_error_added = true;
			}
		}

		$this->assertTrue( $settings_error_added );
	}
}
