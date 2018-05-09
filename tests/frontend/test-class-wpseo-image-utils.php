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
		update_post_meta( $attachment, '_wp_attachment_metadata', array( 'width' => 1000, 'height' => 1000 ) );

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
				'type'   => ''
			),
			WPSEO_Image_Utils::get_image( $attachment, 'full' )
		);
	}

	/**
	 * Tests getting a medium image.
	 */
	public function test_get_medium_image() {
		$attachment = self::factory()->attachment->create();
		update_post_meta( $attachment, '_wp_attachment_metadata', array( 'width' => 1000, 'height' => 1000 ) );

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

	/**
	 * Provided data for the get data test.
	 *
	 * @return array The test data.
	 */
	public function get_data_provider(  ) {
		$attachment_id = self::factory()->attachment->create();
		return array(
			array(
				'image'         => 'This is a string',
				'expected'      => false,
				'attachment_id' => $attachment_id,
				'message'       => 'With a string given as image data',
			),
			array(
				'image'         => array( 'with' => 'no image', 'and' => 'height keys given' ),
				'expected'      => false,
				'attachment_id' => $attachment_id,
				'message'       => 'An array without the width and height keys',
			),
			array(
				'image'         => array( 'width' => '10', 'height' => '10' ),
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
					'unnecessary' => 'key'
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
