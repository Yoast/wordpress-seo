<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc\Options
 */

/**
 * Unit Test Class.
 *
 * @group option-social
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
		);
	}

	/**
	 * Mimics a Facebook App ID API response for an invalid ID.
	 */
	public function test_fake_invalid_facebook_api_response_body() {
		/*
		Fake the Facebbok API response from `http://graph.facebook.com/<APP_ID>`.
		Example of response for invalid App ID as of July 2019.
		{
			"error": {
				"message": "(#803) Some of the aliases you requested do not exist: yoastInvalidFBAppID",
				"type": "OAuthException",
				"code": 803,
				"fbtrace_id": "AbXND56LRJ0FDXHfdJUuVIr"
			}
		}
		*/
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
	}

	/**
	 * Tests the Facebook App ID validation method with an invalid ID.
	 *
	 * @covers Yoast_Input_Validation::validate_facebook_app_id
	 */
	public function test_facebook_app_id_is_invalid() {
		add_filter( 'validate_facebook_app_id_api_response_body', array( $this, 'test_fake_invalid_facebook_api_response_body' ) );

		$instance = new WPSEO_Option_Social_Double();
		$clean = array( 'fbadminapp' => '246554168145' );
		$dirty = array( 'fbadminapp' => 'yoastInvalidFBAppID' );

		$instance->validate_facebook_app_id( 'fbadminapp', $dirty, '246554168145', $clean );

		$this->assertEquals( array( 'fbadminapp' => '246554168145' ), $clean );
	}

	/**
	 * Mimics a Facebook App ID API response for a valid ID.
	 */
	public function test_fake_valid_facebook_api_response_body() {
		/*
		Fake the Facebbok API response from `http://graph.facebook.com/<APP_ID>`.
		Example of response for valid App ID as of July 2019.
		{
			"category": "Just For Fun",
			"link": "http://www.ilikealot.com/auth/start/facebook/",
			"name": "Ilikealot",
			"id": "246554168145"
		}
		*/
		return WPSEO_Utils::format_json_encode(
			array(
				'category' => 'Just For Fun',
				'link'     => 'http://www.ilikealot.com/auth/start/facebook/',
				'name'     => 'Ilikealot',
				'id'       => '246554168145',
			)
		);
	}

	/**
	 * Mimics a Facebook App ID API success response code.
	 */
	public function test_fake_valid_facebook_api_response_code() {
		return 200;
	}

	/**
	 * Tests the Facebook App ID validation method with a valid ID.
	 *
	 * @covers Yoast_Input_Validation::validate_facebook_app_id
	 */
	public function test_facebook_app_id_is_valid() {
		add_filter( 'validate_facebook_app_id_api_response_code', array( $this, 'test_fake_valid_facebook_api_response_code' ) );
		add_filter( 'validate_facebook_app_id_api_response_body', array( $this, 'test_fake_valid_facebook_api_response_body' ) );

		$instance = new WPSEO_Option_Social_Double();
		$clean = array( 'fbadminapp' => '' );
		$dirty = array( 'fbadminapp' => '246554168145' );

		$instance->validate_facebook_app_id( 'fbadminapp', $dirty, '', $clean );

		$this->assertEquals( array( 'fbadminapp' => '246554168145' ), $clean );
	}

	/**
	 * Tests that submitting an option with an invalid Facebook App ID adds a WordPress settings error notice.
	 *
	 * @covers WPSEO_Option_Social::validate_facebook_app_id
	 */
	public function test_validate_facebook_app_id_adds_settings_error() {
		global $wp_settings_errors;
		$instance = new WPSEO_Option_Social_Double();
		$clean    = array( 'fbadminapp' => '' );
		$dirty    = array( 'fbadminapp' => 'yoastInvalidFBAppID' );
		$settings_error_added = false;
		$instance->validate_facebook_app_id( 'fbadminapp', $dirty, '', $clean );
		foreach ( $wp_settings_errors as $error ) {
			if ( $error['setting'] === 'yoast_wpseo_social_options' && $error['code'] === 'fbadminapp' ) {
				$settings_error_added = true;
			}
		}
		$this->assertTrue( $settings_error_added );
	}
}
