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
final class Image_Helper_Test extends TestCase {

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
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->url   = Mockery::mock( Url_Helper::class )->makePartial();
		$this->image = Mockery::mock( Base_Image_Helper::class )->makePartial();

		$this->instance = new Image_Helper( $this->url, $this->image );
	}

	/**
	 * Tests retrieval of the overridden image size.
	 *
	 * @covers ::get_override_image_size
	 *
	 * @return void
	 */
	public function test_get_override_image_size() {
		Monkey\Filters\expectApplied( 'wpseo_opengraph_image_size' )
			->with( null )
			->once()
			->andReturn( 'full' );

		$this->assertEquals( 'full', $this->instance->get_override_image_size() );
	}

	/**
	 * Tests retrieval of the overridden image size.
	 *
	 * @covers ::get_image_by_id
	 *
	 * @return void
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
	 *
	 * @return void
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

		Monkey\Filters\expectApplied( 'wpseo_opengraph_image_size' )
			->with( null )
			->once()
			->andReturn( 'full' );

		$this->assertEquals( 'image.jpg', $this->instance->get_image_by_id( 1337 ) );
	}

	/**
	 * Tests retrieval of the overridden image size.
	 *
	 * @covers ::get_image_by_id
	 *
	 * @return void
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

		$this->assertEquals( 'image.jpg', $this->instance->get_image_by_id( 1337 ) );
	}
}
