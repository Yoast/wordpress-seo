<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Tests WPSEO_Image_Utils
 */
final class WPSEO_Image_Utils_Test extends PHPUnit_Framework_TestCase {
	/**
	 * Tests the usable dimensions method.
	 *
	 * @dataProvider data_get_usable_dimensions
	 *
	 * @param int     $width       Width of the image.
	 * @param int     $height      Height of the image.
	 * @param boolean $is_usable   If these dimensions are usable or not.
	 * @param string  $description Description for the data being tested.
	 */
	public function test_get_usable_dimensions( $width, $height, $is_usable, $description = '' ) {
		$expected = array();
		if ( $is_usable ) {
			$expected[] = array(
				'width'  => $width,
				'height' => $height,
			);
		}

		$input = array(
			array(
				'width'  => $width,
				'height' => $height,
			),
		);

		$requirements = array(
			'min_width'  => 200,
			'max_width'  => 2000,
			'min_height' => 200,
			'max_height' => 2000,
			'min_ratio'  => 0.333,
			'max_ratio'  => 3,
		);

		$actual = WPSEO_Image_Utils::filter_usable_dimensions( $requirements, $input );

		$this->assertEquals( $expected, $actual, $description );
	}

	/**
	 * Provides data for the usable dimensions test.
	 *
	 * @return array Data.
	 */
	public function data_get_usable_dimensions() {
		return array(
			array( 200, 200, true ),
			array( 200, 199, false ),
			array( 199, 200, false ),
			array( 600, 200, true ),
			array( 601, 200, true ),
			array( 200, 600, true ),
			array( 200, 601, true ),
			array( 2000, 2000, true ),
			array( 2000, 2001, false ),
			array( 2001, 2000, false ),
			array( 1000, 1000, true ),
		);
	}

	/**
	 * Tests if the absolute path is working as expected.
	 *
	 * @param string $input    Data to use in execution.
	 * @param string $expected Expected result.
	 * @param string $reason   Description of the tested data.
	 *
	 * @dataProvider data_get_absolute_path
	 */
	public function test_absolute_path( $input, $expected, $reason = '' ) {
		$result = WPSEO_Image_Utils::get_absolute_path( $input );

		$this->assertEquals( $expected, $result, $reason );
	}

	/**
	 * Provides data for the absolute path test.
	 *
	 * @return array Data.
	 */
	public function data_get_absolute_path() {
		$uploads = wp_get_upload_dir();

		return array(
			array(
				'/a',
				$uploads['basedir'] . '/a',
				'Relative path should receive basedir as prefix.',
			),
			array(
				$uploads['basedir'] . '/b',
				$uploads['basedir'] . '/b',
				'Absolute path should be returned as is.',
			),
			array(
				'/c' . $uploads['basedir'] . '/d',
				$uploads['basedir'] . '/c' . $uploads['basedir'] . '/d',
				'Relative path with absolute path inside should be prefixed with basedir.',
			)
		);
	}
}
