<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Generators\Schema
 */

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Generators\Schema\Main_Image;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema;
use Yoast\WP\SEO\Tests\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Main_Image_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Main_Image
 */
class Main_Image_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Main_Image
	 */
	private $instance;

	/**
	 * The schema image helper.
	 *
	 * @var Schema\Image_Helper|Mockery\MockInterface
	 */
	private $schema_image;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper|Mockery\MockInterface
	 */
	private $image;

	/**
	 * The schema id helper.
	 *
	 * @var Schema\ID_Helper
	 */
	private $schema_id;

	/**
	 * The schema context.
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	private $meta_tags_context;

	/**
	 * Setup the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->schema_image = Mockery::mock( Schema\Image_Helper::class );
		$this->image        = Mockery::mock( Image_Helper::class );
		$this->schema_id    = new Schema\ID_Helper();

		$this->instance = new Main_Image();

		$this->meta_tags_context            = new Meta_Tags_Context_Mock();
		$this->meta_tags_context->indexable = new Indexable_Mock();

		$this->instance->context = $this->meta_tags_context;
		$this->instance->helpers = (object) [
			'image'  => $this->image,
			'schema' => (object) [
				'id'      => $this->schema_id,
				'image'   => $this->schema_image,
			],
		];
	}

	/**
	 * Tests that generate returns the featured image schema.
	 *
	 * @covers ::generate
	 * @covers ::get_featured_image
	 */
	public function test_generate_featured_image() {
		$this->meta_tags_context->canonical = 'https://example.com/canonical';
		$this->meta_tags_context->id        = 1337;

		$image_id     = $this->generate_image_id();
		$image_schema = [
			'@type'      => 'ImageObject',
			'@id'        => $image_id,
			'inLanguage' => 'en_US',
			'url'        => 'image_url',
			'width'      => 111,
			'height'     => 222,
			'caption'    => 'test_image',
		];

		// In the `get_featured_image` method.
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->once()
			->with( 1337 )
			->andReturn( true );
		Monkey\Functions\expect( 'get_post_thumbnail_id' )
			->once()
			->with( 1337 )
			->andReturn( true );
		$this->schema_image->expects( 'generate_from_attachment_id' )
			->once()
			->with( $image_id, 1337 )
			->andReturn( $image_schema );

		$this->assertEquals( $image_schema, $this->instance->generate() );
		$this->assertTrue( $this->meta_tags_context->has_image );
	}

	/**
	 * Tests that generate call generate from url without a featured image but with a content image.
	 *
	 * @covers ::generate
	 * @covers ::get_featured_image
	 * @covers ::get_first_content_image
	 */
	public function test_generate_from_url() {
		$this->meta_tags_context->canonical = 'https://example.com/canonical';
		$this->meta_tags_context->id        = 1337;

		$image_id     = $this->generate_image_id();
		$image_url    = 'https://example.com/content_image';
		$image_schema = [
			'@type' => 'ImageObject',
			'@id'   => $image_id,
			'url'   => 'image_url',
		];

		// In the `get_featured_image` method.
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->once()
			->with( 1337 )
			->andReturn( false );

		// In the `get_first_content_image` method.
		$this->image->expects( 'get_post_content_image' )
			->once()
			->with( 1337 )
			->andReturn( $image_url );
		$this->schema_image->expects( 'generate_from_url' )
			->once()
			->with( $image_id, $image_url )
			->andReturn( $image_schema );

		$this->assertEquals( $image_schema, $this->instance->generate() );
		$this->assertTrue( $this->meta_tags_context->has_image );
	}

	/**
	 * Tests that generate returns null if no image available.
	 *
	 * @covers ::generate
	 * @covers ::get_featured_image
	 * @covers ::get_first_content_image
	 */
	public function test_generate_no_image() {
		$this->meta_tags_context->canonical = 'https://example.com/canonical';
		$this->meta_tags_context->id        = 1337;

		// In the `get_featured_image` method.
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->once()
			->with( 1337 )
			->andReturn( false );

		// In the `get_first_content_image` method.
		$this->image->expects( 'get_post_content_image' )
			->once()
			->with( 1337 )
			->andReturn( '' );

		$this->assertFalse( $this->instance->generate() );
	}

	/**
	 * Tests is needed.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$this->meta_tags_context->indexable->object_type = 'post';

		$this->assertTrue( $this->instance->is_needed() );
	}

	/**
	 * Tests is not needed.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed() {
		$this->meta_tags_context->indexable->object_type = 'user';

		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Generates the image id as the main image class would.
	 *
	 * @return string The image id.
	 */
	protected function generate_image_id() {
		return $this->meta_tags_context->canonical . Schema_IDs::PRIMARY_IMAGE_HASH;
	}
}
