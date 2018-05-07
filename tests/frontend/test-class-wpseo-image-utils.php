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
	 * @dataProvider data_get_usable_dimensions
	 */
	public function test_get_usable_dimensions( $width, $height, $inside, $msg = '' ) {
		$expected = array();
		if ( $inside ) {
			$expected[] = array(
				'width' => $width,
				'height' => $height,
			);
		}
		$input = array(
			array(
				'width' => $width,
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

		$this->assertEquals( $expected, $actual, $msg );
	}

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
}
