<?php
namespace Yoast\WP\Free\Tests\Admin\Metabox;

use Yoast\WP\Free\Tests\TestCase;
use WPSEO_Option_Social_Double;
use WPSEO_Option_Social;
use Brain\Monkey;
use Mockery;

/**
 * Unit Test Class.
 */
class WPSEO_Option_Social_Test extends TestCase {

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
		$instance = new WPSEO_Option_Social_Double();

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
		Monkey\Functions\expect( 'add_settings_error' )
			->once()
			->with('yoast_wpseo_social_options', $slug_name, "<strong>{$dirty[ $slug_name ]}</strong> does not seem to be a valid url. Please correct.", 'notice-error' );

		$instance = new WPSEO_Option_Social_Double();

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
				'slug_name' => 'facebook_site'
			),
			array(
				'expected'  => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'dirty'     => array( 'youtube_url' => 'invalidurl' ),
				'clean'     => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'old'       => array( 'youtube_url' => 'https://www.youtube.com/yoast' ),
				'slug_name' => 'youtube_url'
			),
		);
	}

	/**
	 * Tests that submitting an option with an invalid URL adds a WordPress settings error notice.
	 *
	 * @covers WPSEO_Option_Social::validate_url
	 */
	public function test_validate_url_adds_settings_error() {
		$instance = new WPSEO_Option_Social_Double();

		Monkey\Functions\expect( 'add_settings_error' )->once()->with('yoast_wpseo_social_options', 'instagram_url', '<strong>invalidurl</strong> does not seem to be a valid url. Please correct.', 'notice-error');

		$clean = array( 'instagram_url' => '' );
		$dirty = array( 'instagram_url' => 'invalidurl' );

		$instance->validate_url( 'instagram_url', $dirty, '', $clean );
	}

}




