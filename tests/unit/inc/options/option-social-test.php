<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc\Options;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\Doubles\Inc\Options\Option_Social_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Input_Validation;

/**
 * Unit Test Class.
 *
 * @group option-social
 */
class Option_Social_Test extends TestCase {

	/**
	 * Set up function stubs.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
	}

	/**
	 * Tests validate_option with valid data.
	 *
	 * @dataProvider validate_option_valid_data_provider
	 * @covers       WPSEO_Option_Social::validate_option
	 *
	 * @param string $expected The expected value.
	 * @param array  $dirty    New value for the option.
	 * @param array  $clean    Clean value for the option, normally the defaults.
	 * @param array  $old      Old value of the option.
	 */
	public function test_validate_option_with_valid_data( $expected, $dirty, $clean, $old ) {
		Monkey\Functions\stubs(
			[
				'wp_parse_url' => static function ( $url ) {
					return \parse_url( $url );
				},
			]
		);

		$instance = new Option_Social_Double();

		$this->assertEquals(
			$expected,
			$instance->validate_option( $dirty, $clean, $old )
		);
	}

	/**
	 * Tests validate_option with invalid data.
	 *
	 * @dataProvider validate_option_invalid_data_provider
	 * @covers       WPSEO_Option_Social::validate_option
	 *
	 * @param string $expected  The expected value.
	 * @param array  $dirty     New value for the option.
	 * @param array  $clean     Clean value for the option, normally the defaults.
	 * @param array  $old       Old value of the option.
	 * @param string $slug_name The option key.
	 */
	public function test_validate_option_with_invalid_data( $expected, $dirty, $clean, $old, $slug_name ) {
		$message = "<strong>{$dirty[ $slug_name ]}</strong> does not seem to be a valid url. Please correct.";

		Monkey\Functions\stubs(
			[
				'wp_parse_url' => static function ( $url ) {
					return \parse_url( $url );
				},
			]
		);

		Monkey\Functions\expect( 'add_settings_error' )
			->once()
			->with( 'yoast_wpseo_social_options', $slug_name, $message, 'error' );

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
	 * Tests validate_option with invalid array data.
	 *
	 * @dataProvider validate_option_invalid_array_data_provider
	 * @covers       WPSEO_Option_Social::validate_option
	 *
	 * @param string $expected  The expected value.
	 * @param array  $dirty     New value for the option.
	 * @param array  $clean     Clean value for the option, normally the defaults.
	 * @param array  $old       Old value of the option.
	 * @param string $slug_name The option key.
	 */
	public function test_validate_option_with_invalid_array_data( $expected, $dirty, $clean, $old, $slug_name ) {
		$instance = new Option_Social_Double();

		$this->assertEquals(
			$expected,
			$instance->validate_option( $dirty, $clean, $old )
		);
	}

	/**
	 * Data for the test_validate_option_with_correct_data test.
	 *
	 * @return array The test data.
	 */
	public function validate_option_valid_data_provider() {
		return [
			[
				'expected' => [ 'og_default_image_id' => 'value' ],
				'dirty'    => [],
				'clean'    => [ 'og_default_image_id' => 'value' ],
				'old'      => [],
			],
			[
				'expected' => [ 'og_default_image_id' => '' ],
				'dirty'    => [ 'og_default_image_id' => '' ],
				'clean'    => [ 'og_default_image_id' => '' ],
				'old'      => [],
			],
			[
				'expected' => [ 'og_default_image_id' => 123 ],
				'dirty'    => [ 'og_default_image_id' => '123' ],
				'clean'    => [ 'og_default_image_id' => '' ],
				'old'      => [],
			],
			[
				'expected' => [ 'facebook_site' => 'https://facebook.com/yoast' ],
				'dirty'    => [ 'facebook_site' => 'https://facebook.com/yoast' ],
				'clean'    => [ 'facebook_site' => 'https://facebook.com/yoast' ],
				'old'      => [],
			],
			[
				'expected' => [ 'facebook_site' => 'https://facebook.com/yoastfb' ],
				'dirty'    => [ 'facebook_site' => 'https://facebook.com/yoastfb' ],
				'clean'    => [ 'facebook_site' => 'https://facebook.com/yoast' ],
				'old'      => [],
			],
			[
				'expected' => [
					'other_social_urls' => [
						'https://www.youtube.com/yoast',
						'https://instagram.com/yoast',
					]
				],
				'dirty'    => [
					'other_social_urls' => [
						'https://www.youtube.com/yoast',
						'https://instagram.com/yoast',
					]
				],
				'clean'    => [
					'other_social_urls' => [
						'https://www.youtube.com/yoast',
					]
				],
				'old'      => [
					'other_social_urls' => [],
				],
			],
		];
	}

	/**
	 * Data for the test_validate_option test.
	 *
	 * @return array The test data.
	 */
	public function validate_option_invalid_data_provider() {
		return [
			[
				'expected'  => [ 'facebook_site' => '' ],
				'dirty'     => [ 'facebook_site' => 'invalidurl' ],
				'clean'     => [ 'facebook_site' => '' ],
				'old'       => [],
				'slug_name' => 'facebook_site',
			],
			[
				'expected'  => [ 'facebook_site' => 'https://facebook.com/yoast' ],
				'dirty'     => [ 'facebook_site' => 'invalidurl' ],
				'clean'     => [ 'facebook_site' => 'https://facebook.com/yoast' ],
				'old'       => [ 'facebook_site' => 'https://facebook.com/yoast' ],
				'slug_name' => 'facebook_site',
			],
		];
	}

	/**
	 * Data for the test_validate_option test.
	 *
	 * @return array The test data.
	 */
	public function validate_option_invalid_array_data_provider() {
		return [
			[
				'expected'  => [
					'other_social_urls' => [
						'https://www.youtube.com/yoast',
						'https://instagram.com/yoast',
					]
				],
				'dirty'     => 'not an array',
				'clean'     => [
					'other_social_urls' => [
						'https://www.youtube.com/yoast',
						'https://instagram.com/yoast',
					]
				],
				'old'       => [
					'other_social_urls' => [
						'https://www.youtube.com/yoast',
						'https://instagram.com/yoast',
					]
				],
				'slug_name' => 'other_social_urls',
			],
		];
	}
}
