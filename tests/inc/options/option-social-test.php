<?php

namespace Yoast\WP\Free\Tests\Inc\Options;

use Brain\Monkey;
use WPSEO_Option_Social;
use Yoast\WP\Free\Tests\Doubles\Inc\Options\Option_Social_Double;
use Yoast\WP\Free\Tests\TestCase;
use WPSEO_Utils;
use Yoast_Input_Validation;

/**
 * Unit Test Class.
 *
 * @group option-social
 */
class Option_Social_Test extends TestCase {

	/**
	 * Tests validate_option with valid data.
	 *
	 * @param string $expected The expected value.
	 * @param array  $dirty    New value for the option.
	 * @param array  $clean    Clean value for the option, normally the defaults.
	 * @param array  $old      Old value of the option.
	 *
	 * @dataProvider validate_option_valid_data_provider
	 *
	 * @covers WPSEO_Option_Social::validate_option
	 */
	public function test_validate_option_with_valid_data( $expected, $dirty, $clean, $old ) {
		$instance = new Option_Social_Double();

		$this->assertEquals(
			$expected,
			$instance->validate_option( $dirty, $clean, $old )
		);
	}

	/**
	 * Tests validate_option with invalid data.
	 *
	 * @param string $expected The expected value.
	 * @param array  $dirty    New value for the option.
	 * @param array  $clean    Clean value for the option, normally the defaults.
	 * @param array  $old      Old value of the option.
	 *
	 * @dataProvider validate_option_invalid_data_provider
	 *
	 * @covers WPSEO_Option_Social::validate_option
	 */
	public function test_validate_option_with_invalid_data( $expected, $dirty, $clean, $old, $slug_name ) {
		$message = "<strong>{$dirty[ $slug_name ]}</strong> does not seem to be a valid url. Please correct.";

		Monkey\Functions\expect( 'add_settings_error' )
			->once()
			->with( 'yoast_wpseo_social_options', $slug_name, $message, 'notice-error' );

		$instance = new Option_Social_Double();

		$GLOBALS['wp_settings_errors'] = [
			[
				'setting' => 'yoast_wpseo_social_options',
				'code'    => $slug_name,
				'message' => $message,
				'type'    => 'notice-error',
			],
		];

		Yoast_Input_Validation::add_dirty_value_to_settings_errors( $slug_name, 'Invalid submitted value' );

		$this->assertEquals(
			$expected,
			$instance->validate_option( $dirty, $clean, $old )
		);

		unset( $GLOBALS['wp_settings_errors'] );
	}

	/**
	 * Data for the test_validate_option_with_correct_data test.
	 *
	 * @return array The test data.
	 */
	public function validate_option_valid_data_provider() {
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
				'expected' => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'dirty'    => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'clean'    => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'old'      => array(),
			),
			array(
				'expected' => array( 'youtube_url' => 'https://www.youtube.com/yoasttube' ),
				'dirty'    => array( 'youtube_url' => 'https://www.youtube.com/yoasttube' ),
				'clean'    => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'old'      => array(),
			),
		);
	}

	/**
	 * Data for the test_validate_option test.
	 *
	 * @return array The test data.
	 */
	public function validate_option_invalid_data_provider() {
		return array(
			array(
				'expected'  => array( 'facebook_site' => '' ),
				'dirty'     => array( 'facebook_site' => 'invalidurl' ),
				'clean'     => array( 'facebook_site' => '' ),
				'old'       => array(),
				'slug_name' => 'facebook_site',
			),
			array(
				'expected'  => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'dirty'     => array( 'youtube_url' => 'invalidurl' ),
				'clean'     => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'old'       => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'slug_name' => 'youtube_url',
			),
		);
	}

	/**
	 * Tests the Facebook App ID validation method with an invalid ID.
	 *
	 * @covers Yoast_Input_Validation::validate_facebook_app_id
	 */
	public function test_facebook_app_id_is_invalid() {
		Monkey\Functions\stubs( [
			'wp_remote_get' => null,
			'add_settings_error' => null,
			'wp_remote_retrieve_response_code' => function () {
				return 200;
			},
		] );

		// Return an invalid Facebook API response from `http://graph.facebook.com/<APP_ID>` with an invalid ID.
		Monkey\Functions\stubs( [
			'wp_remote_retrieve_body' => function () {
				return WPSEO_Utils::format_json_encode(
					array(
						'error' => array(
							'message'    => '(#803) Some of the aliases you requested do not exist: yoastInvalidFBAppID',
							'type'       => 'OAuthException',
							'code'       => 803,
							'fbtrace_id' => 'AbXND56LRJ0FDXHfdJUuVIr',
						)
					)
				);
			},
		] );

		$GLOBALS['wp_settings_errors'] = [
			[
				'setting' => 'name_of_input_field_with_error',
				'code'    => 'name_of_input_field_with_error',
				'message' => 'This is the error message',
				'type'    => 'error',
			],
		];

		add_filter( 'validate_facebook_app_id_api_response_body', function() {
			return true;
		} );
		$instance = new Option_Social_Double();
		$clean = array( 'fbadminapp' => '246554168145' );
		$dirty = array( 'fbadminapp' => 'yoastInvalidFBAppID' );
		$instance->validate_facebook_app_id( 'fbadminapp', $dirty, '246554168145', $clean );
		$this->assertEquals( array( 'fbadminapp' => '246554168145' ), $clean );

		unset( $GLOBALS['wp_settings_errors'] );
	}

	/**
	 * Tests the Facebook App ID validation method with a valid ID.
	 *
	 * @covers Yoast_Input_Validation::validate_facebook_app_id
	 */
	public function test_facebook_app_id_is_valid() {
		$GLOBALS['wp_settings_errors'] = [];
		$response_code = 200;

		Monkey\Functions\stubs( [
			'wp_remote_get' => null,
			'add_settings_error' => null,
			'wp_remote_retrieve_response_code' => function () use ( $response_code ) {
				return $response_code;
			},
		] );

		// Return an invalid Facebook API response from `http://graph.facebook.com/<APP_ID>` with an invalid ID.
		Monkey\Functions\stubs( [
			'wp_remote_retrieve_body' => function () {
				return WPSEO_Utils::format_json_encode(
					array(
						'category' => 'Just For Fun',
						'link'     => 'http://www.ilikealot.com/auth/start/facebook/',
						'name'     => 'Ilikealot',
						'id'       => '246554168145',
					)
				);
			},
		] );

		add_filter( 'validate_facebook_app_id_api_response_code', function () use ( $response_code ) {
			return $response_code;
		} );
		add_filter( 'validate_facebook_app_id_api_response_body', function() {
			return true;
		});
		$instance = new Option_Social_Double();
		$clean = array( 'fbadminapp' => '' );
		$dirty = array( 'fbadminapp' => '246554168145' );
		$instance->validate_facebook_app_id( 'fbadminapp', $dirty, '', $clean );
		$this->assertEquals( array( 'fbadminapp' => '246554168145' ), $clean );
		unset( $GLOBALS['wp_settings_errors'] );
	}

	/**
	 * Tests that submitting an option with an invalid Facebook App ID adds a WordPress settings error notice.
	 *
	 * @covers WPSEO_Option_Social::validate_facebook_app_id
	 */
	public function test_validate_facebook_app_id_adds_settings_error() {
		Monkey\Functions\stubs( [
			'wp_remote_get' => null,
			'wp_remote_retrieve_response_code' => function () {
				return 200;
			},
		] );

		// Return an invalid Facebook API response from `http://graph.facebook.com/<APP_ID>` with an invalid ID.
		Monkey\Functions\stubs( [
			'wp_remote_retrieve_body' => function () {
				return WPSEO_Utils::format_json_encode(
					array(
						'error' => array(
							'message'    => '(#803) Some of the aliases you requested do not exist: yoastInvalidFBAppID',
							'type'       => 'OAuthException',
							'code'       => 803,
							'fbtrace_id' => 'AbXND56LRJ0FDXHfdJUuVIr',
						)
					)
				);
			},
		] );

		$instance = new Option_Social_Double();
		$clean    = array( 'fbadminapp' => '' );
		$dirty    = array( 'fbadminapp' => 'yoastInvalidFBAppID' );

		$GLOBALS['wp_settings_errors'] = [[
			'setting' => 'yoast_wpseo_social_options',
			'code'    => 'fbadminapp',
			'message' =>'<strong>yoastInvalidFBAppID</strong> does not seem to be a valid Facebook App ID. Please correct.',
			'type'    => 'notice-error',
		]];

		Monkey\Functions\expect( 'add_settings_error' )
			->once()
			->with( 'yoast_wpseo_social_options', 'fbadminapp', '<strong>yoastInvalidFBAppID</strong> does not seem to be a valid Facebook App ID. Please correct.', 'notice-error' );

		$instance->validate_facebook_app_id( 'fbadminapp', $dirty, '', $clean );

		unset( $GLOBALS['wp_settings_errors'] );
	}
}
