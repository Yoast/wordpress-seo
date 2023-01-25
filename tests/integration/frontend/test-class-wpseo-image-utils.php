<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Tests WPSEO_Image_Utils.
 */
final class WPSEO_Image_Utils_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests getting the full image for an existing attachment.
	 *
	 * @covers \WPSEO_Image_Utils::get_image
	 */
	public function test_get_full_image() {
		$attachment = self::factory()->attachment->create();
		update_post_meta(
			$attachment,
			'_wp_attachment_metadata',
			[
				'width'  => 1000,
				'height' => 1000,
			]
		);

		$this->assertEquals(
			[
				'width'  => 1000,
				'height' => 1000,
				'url'    => false,
				'path'   => '',
				'size'   => 'full',
				'id'     => $attachment,
				'alt'    => '',
				'pixels' => 1000000,
				'type'   => '',
			],
			WPSEO_Image_Utils::get_image( $attachment, 'full' )
		);
	}

	/**
	 * Tests getting a medium image.
	 *
	 * @covers \WPSEO_Image_Utils::get_image
	 */
	public function test_get_medium_image() {
		$attachment = self::factory()->attachment->create();
		update_post_meta(
			$attachment,
			'_wp_attachment_metadata',
			[
				'width'  => 1000,
				'height' => 1000,
			]
		);

		$this->assertFalse( WPSEO_Image_Utils::get_image( $attachment, 'medium' ) );
	}

	/**
	 * Tests getting a non-existent medium image.
	 *
	 * @covers \WPSEO_Image_Utils::get_image
	 */
	public function test_get_image_for_non_existent_medium_image() {
		$this->assertFalse( WPSEO_Image_Utils::get_image( 0, 'medium' ) );
	}

	/**
	 * Returns getting the image for an existing attachment.
	 *
	 * @covers \WPSEO_Image_Utils::get_image
	 */
	public function test_get_image_for_unexisting_attachment() {
		$this->assertFalse( WPSEO_Image_Utils::get_image( 0, 'full' ) );
	}

	/**
	 * Tests different calls of get_data.
	 *
	 * @dataProvider get_data_provider
	 *
	 * @covers \WPSEO_Image_Utils::get_data
	 *
	 * @param mixed  $image         The image data.
	 * @param mixed  $expected      Expected value.
	 * @param int    $attachment_id The attachment id.
	 * @param string $message       Message to show when test fails.
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
	 * @covers \WPSEO_Image_Utils::filter_usable_dimensions
	 *
	 * @param int    $width       Width of the image.
	 * @param int    $height      Height of the image.
	 * @param bool   $is_usable   If these dimensions are usable or not.
	 * @param string $description Description for the data being tested.
	 */
	public function test_get_usable_dimensions( $width, $height, $is_usable, $description = '' ) {
		$expected = [];
		if ( $is_usable ) {
			$expected[] = [
				'width'  => $width,
				'height' => $height,
			];
		}

		$input = [
			[
				'width'  => $width,
				'height' => $height,
			],
		];

		$requirements = [
			'min_width'  => 200,
			'max_width'  => 2000,
			'min_height' => 200,
			'max_height' => 2000,
			'min_ratio'  => 0.333,
			'max_ratio'  => 3,
		];

		$actual = WPSEO_Image_Utils::filter_usable_dimensions( $requirements, $input );

		$this->assertEquals( $expected, $actual, $description );
	}

	/**
	 * Provides data for the usable dimensions test.
	 *
	 * @return array Data.
	 */
	public function data_get_usable_dimensions() {
		return [
			[ 200, 200, true ],
			[ 200, 199, false ],
			[ 199, 200, false ],
			[ 600, 200, true ],
			[ 601, 200, true ],
			[ 200, 600, true ],
			[ 200, 601, true ],
			[ 2000, 2000, true ],
			[ 2000, 2001, false ],
			[ 2001, 2000, false ],
			[ 1000, 1000, true ],
		];
	}

	/**
	 * Tests if the absolute path is working as expected.
	 *
	 * @dataProvider data_get_absolute_path
	 *
	 * @covers \WPSEO_Image_Utils::get_absolute_path
	 *
	 * @param string $input    Data to use in execution.
	 * @param string $expected Expected result.
	 * @param string $message  Description of the tested data.
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

		return [
			[
				'/a',
				$uploads['basedir'] . '/a',
				'Relative path should receive basedir as prefix.',
			],
			[
				$uploads['basedir'] . '/b',
				$uploads['basedir'] . '/b',
				'Absolute path should be returned as is.',
			],
			[
				'/c' . $uploads['basedir'] . '/d',
				$uploads['basedir'] . '/c' . $uploads['basedir'] . '/d',
				'Relative path with absolute path inside should be prefixed with basedir.',
			],
		];
	}

	/**
	 * Provided data for the get data test.
	 *
	 * @return array The test data.
	 */
	public function get_data_provider() {
		$attachment_id = self::factory()->attachment->create();
		return [
			[
				'image'         => 'This is a string',
				'expected'      => false,
				'attachment_id' => $attachment_id,
				'message'       => 'With a string given as image data',
			],
			[
				'image'         => [
					'with' => 'no image',
					'and'  => 'height keys given',
				],
				'expected'      => false,
				'attachment_id' => $attachment_id,
				'message'       => 'An array without the width and height keys',
			],
			[
				'image'         => [
					'width'  => '10',
					'height' => '10',
				],
				'expected'      => [
					'width'  => '10',
					'height' => '10',
					'id'     => $attachment_id,
					'alt'    => '',
					'pixels' => 100,
					'type'   => false,
				],
				'attachment_id' => $attachment_id,
				'message'       => 'With no attachment type given',
			],
			[
				'image'         => [
					'width'       => '10',
					'height'      => '10',
					'unnecessary' => 'key',
				],
				'expected'      => [
					'width'  => '10',
					'height' => '10',
					'id'     => $attachment_id,
					'alt'    => '',
					'pixels' => 100,
					'type'   => false,
				],
				'attachment_id' => $attachment_id,
				'message'       => 'With unwanted keys being stripped',
			],
			[
				'image'         => [
					'width'       => 100,
					'height'      => 0,
				],
				'expected'      => false,
				'attachment_id' => $attachment_id,
				'message'       => 'Empty height should not be parsed as valid image',
			],
			[
				'image'         => [
					'width'       => 0,
					'height'      => 100,
				],
				'expected'      => false,
				'attachment_id' => $attachment_id,
				'message'       => 'Empty width should not be parsed as valid image',
			],
			[
				'image'         => [
					'width'       => '10',
					'height'      => '10',
				],
				'expected'      => [
					'width'  => '10',
					'height' => '10',
					'id'     => 0,
					'alt'    => '',
					'pixels' => 100,
					'type'   => false,
				],
				'attachment_id' => 0,
				'message'       => 'With unexisting attachment id',
			],
			[
				'image'         => [
					'width'       => 'string',
					'height'      => 'string',
				],
				'expected'      => [
					'width'  => 'string',
					'height' => 'string',
					'id'     => 0,
					'alt'    => '',
					'pixels' => 0,
					'type'   => false,
				],
				'attachment_id' => 0,
				'message'       => 'With height and width not being an integer',
			],
		];
	}
}
