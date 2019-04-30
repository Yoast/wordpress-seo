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
	 * @covers WPSEO_Option_Social::validate_option()
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
}
