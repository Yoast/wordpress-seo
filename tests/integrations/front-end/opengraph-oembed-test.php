<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Tests\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Integrations\Front_End\OpenGraph_OEmbed;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\OpenGraph_OEmbed
 *
 * @group integrations
 * @group front-end
 */
class OpenGraph_OEmbed_Test extends TestCase {

	/**
	 * The meta helper.
	 *
	 * @var Mockery\MockInterface|Meta_Helper
	 */
	protected $meta;

	/**
	 * The image helper.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * The instance to test against.
	 *
	 * @var Mockery\MockInterface|OpenGraph_OEmbed
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->meta     = Mockery::mock( Meta_Helper::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
		$this->image    = Mockery::mock( Image_Helper::class );
		$this->instance = Mockery::mock( OpenGraph_OEmbed::class, [ $this->meta, $this->image ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests the addition of the data with no opengraph title set.
	 *
	 * @covers ::set_oembed_data
	 * @covers ::set_title
	 */
	public function test_set_oembed_data_with_no_opengraph_title_set() {
		$post = (object) [ 'ID' => 1337 ];

		$this->meta
			->expects( 'get_value' )
			->once()
			->with( 'opengraph-title', 1337 )
			->andReturnNull();

		$this->instance
			->expects( 'set_image' )
			->once()
			->with( [], 1337 )
			->andReturnUsing( static function( $data ) {
				return $data;
			}  );

		$this->assertEquals( [], $this->instance->set_oembed_data( [], $post ) );
	}

	/**
	 * Tests the addition of the data with no opengraph title set.
	 *
	 * @covers ::set_oembed_data
	 * @covers ::set_title
	 */
	public function test_set_oembed_data_with_opengraph_title_set() {
		$post = (object) [ 'ID' => 1337 ];

		$this->meta
			->expects( 'get_value' )
			->once()
			->with( 'opengraph-title', 1337 )
			->andReturn( 'Open Graph title' );

		$this->instance
			->expects( 'set_image' )
			->once()
			->with( [ 'title' => 'Open Graph title' ], 1337 )
			->andReturnUsing( static function( $data ) {
				return $data;
			}  );

		$this->assertEquals( [ 'title' => 'Open Graph title' ], $this->instance->set_oembed_data( [], $post ) );
	}

	/**
	 * Tests the addition of the data with the opengraph image set.
	 *
	 * @covers ::set_oembed_data
	 * @covers ::set_image
	 * @covers ::get_image
	 */
	public function test_set_oembed_data_with_no_opengraph_image_set() {
		$post = (object) [ 'ID' => 1337 ];

		$this->instance
			->expects( 'set_title' )
			->once()
			->with( [], 1337 )
			->andReturn( [] );

		$this->meta
			->expects( 'get_value' )
			->once()
			->with( 'opengraph-image-id', 1337 )
			->andReturnNull();

		$this->meta
			->expects( 'get_value' )
			->once()
			->with( 'opengraph-image', 1337 )
			->andReturnNull();

		$this->assertEquals( [], $this->instance->set_oembed_data( [], $post ) );
	}

	/**
	 * Tests the addition of the data with the opengraph image set.
	 *
	 * @covers ::set_oembed_data
	 * @covers ::set_image
	 * @covers ::get_image
	 */
	public function test_set_oembed_data_with_opengraph_image_set() {
		$post = (object) [ 'ID' => 1337 ];

		$this->instance
			->expects( 'set_title' )
			->once()
			->with( [], 1337 )
			->andReturn( [] );

		$this->meta
			->expects( 'get_value' )
			->once()
			->with( 'opengraph-image-id', 1337 )
			->andReturnNull();

		$this->meta
			->expects( 'get_value' )
			->once()
			->with( 'opengraph-image', 1337 )
			->andReturn( 'image.jpg' );

		$this->image
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'image.jpg' )
			->andReturnFalse();

		$this->assertEquals( [ 'thumbnail_url' => 'image.jpg' ], $this->instance->set_oembed_data( [], $post ) );
	}

	/**
	 * Tests the addition of the data with the opengraph image id set.
	 *
	 * @covers ::set_oembed_data
	 * @covers ::set_image
	 * @covers ::get_image
	 * @covers ::set_image_meta_data
	 */
	public function test_set_oembed_data_with_opengraph_image_id_set() {
		$post = (object) [ 'ID' => 1337 ];

		$this->instance
			->expects( 'set_title' )
			->once()
			->with( [], 1337 )
			->andReturn( [] );

		$this->meta
			->expects( 'get_value' )
			->once()
			->with( 'opengraph-image-id', 1337 )
			->andReturn( 707 );

		$this->meta
			->expects( 'get_value' )
			->never()
			->with( 'opengraph-image', 1337 );

		$this->image
			->expects( 'get_attachment_image_source' )
			->once()
			->with( 707 )
			->andReturn( 'image.jpg' );

		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->with( 707 )
			->andReturn(
				[
					'height' => 500,
					'width' => 500,
				]
			);

		$this->assertEquals(
			[
				'thumbnail_url'    => 'image.jpg',
				'thumbnail_height' => 500,
				'thumbnail_width'  => 500,
			],
			$this->instance->set_oembed_data( [], $post )
		);
	}
}
