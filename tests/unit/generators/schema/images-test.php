<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators\Schema;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Generators\Schema\Images;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Schema\Image;

/**
 * Class Main_Image_Test.
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Images
 */
class Images_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Images
	 */
	protected $instance;

	/**
	 * The schema image helper.
	 *
	 * @var Schema\Image_Helper|Mockery\MockInterface
	 */
	protected $schema_image;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image;

	/**
	 * The schema id helper.
	 *
	 * @var Schema\ID_Helper
	 */
	protected $schema_id;

	/**
	 * The schema context.
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	protected $meta_tags_context;

	/**
	 * Setup the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->schema_image = Mockery::mock( Schema\Image_Helper::class );
		$this->image        = Mockery::mock( Image_Helper::class );
		$this->schema_id    = new Schema\ID_Helper();

		$this->instance = new Images();

		$this->meta_tags_context               = new Meta_Tags_Context_Mock();
		$this->meta_tags_context->indexable    = new Indexable_Mock();
		$this->meta_tags_context->images       = [];
		$this->meta_tags_context->presentation = (object) [
			'open_graph_images' => [],
		];

		$this->instance->context = $this->meta_tags_context;
		$this->instance->helpers = (object) [
			'image'  => $this->image,
			'schema' => (object) [
				'id'    => $this->schema_id,
				'image' => $this->schema_image,
			],
		];
	}

	/**
	 * Tests that generate returns the main image schema based on its ID.
	 *
	 * @covers ::generate
	 */
	public function test_generate_main_image_id() {
		$this->meta_tags_context->canonical     = 'https://example.com/canonical';
		$this->meta_tags_context->id            = 1337;
		$this->meta_tags_context->main_image_id = 1338;

		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.com' );

		$image_id = 'https://example.com/images/image-1338.jpg';

		$image_schema = [
			'@type'      => 'ImageObject',
			'@id'        => $image_id,
			'inLanguage' => 'en_US',
			'url'        => 'image_url',
			'width'      => 111,
			'height'     => 222,
			'caption'    => 'test_image',
		];

		$this->image
			->expects( 'get_attachment_image_url' )
			->with( 1338, 'full' )
			->andReturn( 'https://example.com/images/image-1338.jpg' );

		$this->schema_image->expects( 'generate_from_attachment_id' )
			->once()
			->with( $image_id, $this->meta_tags_context->main_image_id )
			->andReturn( $image_schema );

		self::assertEquals( [ $image_schema ], $this->instance->generate() );
	}

	/**
	 * Tests that generate call generate from url without a featured image but with a content image.
	 *
	 * @covers ::generate
	 */
	public function test_generate_from_url() {
		$this->meta_tags_context->canonical      = 'https://example.com/canonical';
		$this->meta_tags_context->id             = 1337;
		$image_url                               = 'https://example.com/content_image';
		$this->meta_tags_context->main_image_url = $image_url;

		$image_schema = [
			'@type' => 'ImageObject',
			'@id'   => $image_url,
			'url'   => 'image_url',
		];

		$this->schema_image->expects( 'generate_from_url' )
			->once()
			->with( $image_url, $image_url )
			->andReturn( $image_schema );

		self::assertEquals( [ $image_schema ], $this->instance->generate() );
	}

	/**
	 * Tests that generate returns false if no image available.
	 *
	 * @covers ::generate
	 */
	public function test_generate_no_image() {
		$this->meta_tags_context->canonical = 'https://example.com/canonical';
		$this->meta_tags_context->id        = 1337;

		$this->schema_image
			->expects( 'generate_from_attachment_id' )
			->never();

		$this->schema_image
			->expects( 'generate_from_url' )
			->never();

		self::assertEquals( [], $this->instance->generate() );
	}

	/**
	 * Test whether content images are correctly generated in schema.
	 *
	 * @covers ::generate
	 */
	public function test_generate_content_images() {
		$this->meta_tags_context->images = [
			new Image( 'https://example.com/images/image-1.jpg', 1 ),
			new Image( 'https://example.com/images/image-2.jpg', 2 ),
			new Image( 'https://example.com/images/image-3.jpg', 3 ),
		];

		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.com' );

		foreach ( $this->meta_tags_context->images as $image ) {
			$this->schema_image
				->expects( 'generate_from_attachment_id' )
				->with( $image->get_src(), $image->get_id() )
				->andReturn(
					[
						'@type' => 'ImageObject',
						'@id'   => $image->get_src(),
					]
				);
		}

		// Add duplicate and see if it is ignored.
		$this->meta_tags_context->images[] = new Image( 'https://example.com/images/image-1.jpg', 1 );

		$this->assertEquals(
			[
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-1.jpg',
				],
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-2.jpg',
				],
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-3.jpg',
				],
			],
			$this->instance->generate()
		);
	}

	/**
	 * Test whether open graph images are correctly generated in schema.
	 *
	 * @covers ::generate
	 */
	public function test_generate_open_graph_images() {
		$this->meta_tags_context->presentation->open_graph_images = [
			[
				'id'  => 1,
				'url' => 'https://example.com/images/image-1.jpg',
			],
			[
				'id'  => 2,
				'url' => 'https://example.com/images/image-2.jpg',
			],
			[
				'id'  => null,
				'url' => 'https://example.com/images/image-3.jpg',
			],
		];

		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.com' );

		$this->schema_image->expects( 'convert_open_graph_image' )
			->with(
				[
					'id'  => 1,
					'url' => 'https://example.com/images/image-1.jpg',
				]
			)
			->andReturn( new Image( 'https://example.com/images/image-1.jpg', 1 ) );

		$this->schema_image->expects( 'convert_open_graph_image' )
			->with(
				[
					'id'  => 2,
					'url' => 'https://example.com/images/image-2.jpg',
				]
			)
			->andReturn( new Image( 'https://example.com/images/image-2.jpg', 2 ) );

		$this->schema_image->expects( 'convert_open_graph_image' )
			->with(
				[
					'id'  => null,
					'url' => 'https://example.com/images/image-3.jpg',
				]
			)
			->andReturn( new Image( 'https://example.com/images/image-3.jpg', null ) );

		$this->schema_image
			->expects( 'generate_from_attachment_id' )
			->with( 'https://example.com/images/image-1.jpg', 1 )
			->andReturn(
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-1.jpg',
				]
			);

		$this->schema_image
			->expects( 'generate_from_attachment_id' )
			->with( 'https://example.com/images/image-2.jpg', 2 )
			->andReturn(
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-2.jpg',
				]
			);

		$this->schema_image
			->expects( 'generate_from_url' )
			->with( 'https://example.com/images/image-3.jpg', 'https://example.com/images/image-3.jpg' )
			->andReturn(
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-3.jpg',
				]
			);

		$this->assertEquals(
			[
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-1.jpg',
				],
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-2.jpg',
				],
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-3.jpg',
				],
			],
			$this->instance->generate()
		);
	}

	/**
	 * Test whether twitter image is correctly generated in schema.
	 *
	 * @covers ::generate
	 */
	public function test_generate_twitter_image() {
		$this->meta_tags_context->presentation->twitter_image = 'https://example.com/images/image-1.jpg';

		$this->schema_image
			->expects( 'generate_from_url' )
			->with( 'https://example.com/images/image-1.jpg', 'https://example.com/images/image-1.jpg' )
			->andReturn(
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-1.jpg',
				]
			);

		$this->assertEquals(
			[
				[
					'@type' => 'ImageObject',
					'@id'   => 'https://example.com/images/image-1.jpg',
				],
			],
			$this->instance->generate()
		);
	}
}
