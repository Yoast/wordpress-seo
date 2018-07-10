<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Tests WPSEO_Image_Utils
 */
final class WPSEO_Image_Utils_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests getting the full image for an existing attachment.
	 */
	public function test_get_full_image() {
		$attachment = self::factory()->attachment->create();
		update_post_meta(
			$attachment,
			'_wp_attachment_metadata',
			array(
				'width'  => 1000,
				'height' => 1000,
			)
		);

		$this->assertEquals(
			array(
				'width'  => 1000,
				'height' => 1000,
				'url'    => false,
				'path'   => '',
				'size'   => 'full',
				'id'     => $attachment,
				'alt'    => '',
				'pixels' => 1000000,
				'type'   => '',
			),
			WPSEO_Image_Utils::get_image( $attachment, 'full' )
		);
	}

	/**
	 * Tests getting a medium image.
	 */
	public function test_get_medium_image() {
		$attachment = self::factory()->attachment->create();
		update_post_meta(
			$attachment,
			'_wp_attachment_metadata',
			array(
				'width'  => 1000,
				'height' => 1000,
			)
		);

		$this->assertFalse( WPSEO_Image_Utils::get_image( $attachment, 'medium' ) );
	}

	/**
	 * Returns getting the image for an existing attachment.
	 */
	public function test_get_image_for_unexisting_attachment() {
		$this->assertFalse( WPSEO_Image_Utils::get_image( 0, 'full' ) );
	}

	/**
	 * Tests different calls of get_data.
	 *
	 * @dataProvider get_data_provider
	 *
	 * @param mixed   $image         The image data.
	 * @param mixed   $expected      Expected value.
	 * @param integer $attachment_id The attachment id.
	 * @param string  $message       Message to show when test fails.
	 *
	 * @covers WPSEO_Image_Utils::get_data()
	 */
	public function test_get_data( $image, $expected, $attachment_id, $message ) {
		$this->assertEquals(
			$expected,
			WPSEO_Image_Utils::get_data( $image, $attachment_id ),
			$message
		);
	}

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
	 * @param string $message  Description of the tested data.
	 *
	 * @dataProvider data_get_absolute_path
	 */
	public function test_absolute_path( $input, $expected, $message = '' ) {
		$result = WPSEO_Image_Utils::get_absolute_path( $input );

		$this->assertEquals( $expected, $result, $message );
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
			),
		);
	}

	/**
	 * Provided data for the get data test.
	 *
	 * @return array The test data.
	 */
	public function get_data_provider() {
		$attachment_id = self::factory()->attachment->create();
		return array(
			array(
				'image'         => 'This is a string',
				'expected'      => false,
				'attachment_id' => $attachment_id,
				'message'       => 'With a string given as image data',
			),
			array(
				'image'         => array(
					'with' => 'no image',
					'and'  => 'height keys given',
				),
				'expected'      => false,
				'attachment_id' => $attachment_id,
				'message'       => 'An array without the width and height keys',
			),
			array(
				'image'         => array(
					'width'  => '10',
					'height' => '10',
				),
				'expected'      => array(
					'width'  => '10',
					'height' => '10',
					'id'     => $attachment_id,
					'alt'    => '',
					'pixels' => 100,
					'type'   => false,
				),
				'attachment_id' => $attachment_id,
				'message'       => 'With no attachment type given',
			),
			array(
				'image'         => array(
					'width'       => '10',
					'height'      => '10',
					'unnecessary' => 'key',
				),
				'expected'      => array(
					'width'  => '10',
					'height' => '10',
					'id'     => $attachment_id,
					'alt'    => '',
					'pixels' => 100,
					'type'   => false,
				),
				'attachment_id' => $attachment_id,
				'message'       => 'With unwanted keys being stripped',
			),
			array(
				'image'         => array(
					'width'       => 100,
					'height'      => 0,
				),
				'expected'      => false,
				'attachment_id' => $attachment_id,
				'message'       => 'Empty height should not be parsed as valid image',
			),
			array(
				'image'         => array(
					'width'       => 0,
					'height'      => 100,
				),
				'expected'      => false,
				'attachment_id' => $attachment_id,
				'message'       => 'Empty width should not be parsed as valid image',
			),
			array(
				'image'         => array(
					'width'       => '10',
					'height'      => '10',
				),
				'expected'      => array(
					'width'  => '10',
					'height' => '10',
					'id'     => 0,
					'alt'    => '',
					'pixels' => 100,
					'type'   => false,
				),
				'attachment_id' => 0,
				'message'       => 'With unexisting attachment id',
			),
			array(
				'image'         => array(
					'width'       => 'string',
					'height'      => 'string',
				),
				'expected'      => array(
					'width'  => 'string',
					'height' => 'string',
					'id'     => 0,
					'alt'    => '',
					'pixels' => 0,
					'type'   => false,
				),
				'attachment_id' => 0,
				'message'       => 'With height and width not being an integer',
			),
		);
	}
}
