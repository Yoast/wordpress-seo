<?php

namespace Yoast\WP\Free\Tests\Helpers\Open_Graph;

use Mockery;
use Yoast\WP\Free\Helpers\Image_Helper as Base_Image_Helper;
use Yoast\WP\Free\Helpers\Open_Graph\Image_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Image_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Helpers\Open_Graph\Image_Helper
 *
 * @group helpers
 * @group test
 */
class Image_Helper_Test extends TestCase {

	/**
	 * @var Image_Helper|Mockery\Mock
	 */
	protected $instance;

	/**
	 * @var Url_Helper
	 */
	protected $url_helper;

	/**
	 * @var Base_Image_Helper
	 */
	protected $image_helper;

	/**
	 * Setup.
	 */
	public function setUp() {
		$this->url_helper   = Mockery::mock( Url_Helper::class )->makePartial();
		$this->image_helper = Mockery::mock( Base_Image_Helper::class )->makePartial();

		$this->instance = Mockery::mock(
			Image_Helper::class,
			[
				$this->url_helper,
				$this->image_helper,
			]
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		parent::setUp();
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
		$this->url_helper
			->expects( 'get_extension_from_url' )
			->once()
			->with( 'image.jpg' )
			->andReturn( 'jpg' );

		$this->image_helper
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

}
