<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Open_Graph;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper as Base_Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Image_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper
 *
 * @group helpers
 */
class Image_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Image_Helper|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Represents the url helper.
	 *
	 * @var Url_Helper
	 */
	protected $url;

	/**
	 * Represents the base image helper.
	 *
	 * @var Base_Image_Helper
	 */
	protected $image;

	/**
	 * Setup.
	 */
	public function setUp() {
		parent::setUp();

		$this->url   = Mockery::mock( Url_Helper::class )->makePartial();
		$this->image = Mockery::mock( Base_Image_Helper::class )->makePartial();

		$this->instance = Mockery::mock(
			Image_Helper::class,
			[
				$this->url,
				$this->image,
			]
		)->makePartial();
	}

	/**
	 * Tests the case where the url was missing in the given param.
	 *
	 * @covers ::is_image_url_valid
	 */
	public function test_is_image_url_valid_with_missing_url() {
		$this->assertFalse( $this->instance->is_image_url_valid( [] ) );
	}

	/**
	 * Tests the case where the image is validated the right way (Happy path).
	 *
	 * @covers ::is_image_url_valid
	 */
	public function test_is_image_url_valid() {
		$this->url
			->expects( 'get_extension_from_url' )
			->once()
			->with( 'image.jpg' )
			->andReturn( 'jpg' );

		$this->image
			->expects( 'is_extension_valid' )
			->once()
			->with( 'jpg' )
			->andReturnTrue();

		$this->assertTrue(
			$this->instance->is_image_url_valid(
				[
					'url' => 'image.jpg',
				]
			)
		);
	}

	/**
	 * Tests retrieval of the overridden image size.
	 *
	 * @covers ::get_override_image_size
	 */
	public function test_get_override_image_size() {
		Monkey\Functions\expect( 'apply_filters' )
			->with( 'wpseo_opengraph_image_size', null )
			->once()
			->andReturn( 'full' );

		$this->assertEquals( 'full', $this->instance->get_override_image_size() );
	}

	/**
	 * Tests retrieval of the overridden image size.
	 *
	 * @covers ::get_image_by_id
	 */
	public function test_get_image_by_id_for_invalid_attachment() {
		$this->image
			->expects( 'is_valid_attachment' )
			->with( 1337 )
			->once()
			->andReturnFalse();

		$this->assertFalse( $this->instance->get_image_by_id( 1337 ) );
	}

	/**
	 * Tests retrieval of the overridden image size.
	 *
	 * @covers ::get_image_by_id
	 */
	public function test_get_image_by_id_for_overridden_image_size() {
		$this->image
			->expects( 'is_valid_attachment' )
			->with( 1337 )
			->once()
			->andReturnTrue();

		$this->image
			->expects( 'get_image' )
			->with( 1337, 'full' )
			->once()
			->andReturn( 'image.jpg' );

		$this->instance
			->expects( 'get_override_image_size' )
			->once()
			->andReturn( 'full' );

		$this->assertEquals( 'image.jpg', $this->instance->get_image_by_id( 1337 ) );
	}

	/**
	 * Tests retrieval of the overridden image size.
	 *
	 * @covers ::get_image_by_id
	 */
	public function test_get_image_by_id_with_best_attachment_variation() {
		$this->image
			->expects( 'is_valid_attachment' )
			->with( 1337 )
			->once()
			->andReturnTrue();

		$this->image
			->expects( 'get_best_attachment_variation' )
			->with( 1337 )
			->once()
			->andReturn( 'image.jpg' );

		$this->instance
			->expects( 'get_override_image_size' )
			->once()
			->andReturn( null );

		$this->assertEquals( 'image.jpg', $this->instance->get_image_by_id( 1337 ) );
	}
}
