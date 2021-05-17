<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators\Schema;

use Mockery;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Generators\Schema\Main_Image;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Main_Image_Test.
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

		$this->instance = new Main_Image();

		$this->meta_tags_context            = new Meta_Tags_Context_Mock();
		$this->meta_tags_context->indexable = new Indexable_Mock();

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

		$image_id = $this->generate_image_id();

		$image_schema = [
			'@type'      => 'ImageObject',
			'@id'        => $image_id,
			'inLanguage' => 'en_US',
			'url'        => 'image_url',
			'width'      => 111,
			'height'     => 222,
			'caption'    => 'test_image',
		];

		$this->schema_image->expects( 'generate_from_attachment_id' )
			->once()
			->with( $image_id, $this->meta_tags_context->main_image_id )
			->andReturn( $image_schema );

		self::assertEquals( $image_schema, $this->instance->generate() );
	}

	/**
	 * Tests that generate call generate from url without a featured image but with a content image.
	 *
	 * @covers ::generate
	 * @covers ::get_social_image
	 * @covers ::get_featured_image
	 * @covers ::get_first_content_image
	 */
	public function test_generate_from_url() {
		$this->meta_tags_context->canonical      = 'https://example.com/canonical';
		$this->meta_tags_context->id             = 1337;
		$image_url                               = 'https://example.com/content_image';
		$this->meta_tags_context->main_image_url = $image_url;

		$image_id     = $this->generate_image_id();
		$image_schema = [
			'@type' => 'ImageObject',
			'@id'   => $image_id,
			'url'   => 'image_url',
		];

		$this->schema_image->expects( 'generate_from_url' )
			->once()
			->with( $image_id, $image_url )
			->andReturn( $image_schema );

		self::assertEquals( $image_schema, $this->instance->generate() );
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

		self::assertFalse( $this->instance->generate() );
	}

	/**
	 * Tests that generate returns the OpenGraph social image when available.
	 *
	 * @covers ::generate
	 * @covers ::get_social_image
	 * @covers ::get_featured_image
	 * @covers ::get_first_content_image
	 */
	public function test_generate_from_open_graph_social_image() {
		$this->meta_tags_context->canonical = 'https://example.com/canonical';
		$this->meta_tags_context->id        = 1337;

		$this->meta_tags_context->indexable->open_graph_image_id     = 4532;
		$this->meta_tags_context->indexable->open_graph_image_source = 'set-by-user';

		$image_id = $this->generate_image_id();

		$image_schema = [
			'@type'      => 'ImageObject',
			'@id'        => 'http://basic.wordpress.test/2021/02/23/hello-world/#primaryimage',
			'inLanguage' => 'en-US',
			'url'        => 'http://basic.wordpress.test/wp-content/uploads/2021/03/og-image.jpg',
			'contentUrl' => 'http://basic.wordpress.test/wp-content/uploads/2021/03/og-image.jpg',
			'width'      => 732,
			'height'     => 248,
		];

		$this->schema_image->expects( 'generate_from_attachment_id' )
			->once()
			->with( $image_id, 4532 )
			->andReturn( $image_schema );

		self::assertEquals( $image_schema, $this->instance->generate() );
	}

	/**
	 * Tests that generate returns the Twitter social image when
	 * an OpenGraph image is not available.
	 *
	 * @covers ::generate
	 * @covers ::get_social_image
	 * @covers ::get_featured_image
	 * @covers ::get_first_content_image
	 */
	public function test_generate_from_twitter_social_image() {
		$this->meta_tags_context->canonical = 'https://example.com/canonical';
		$this->meta_tags_context->id        = 1337;

		$this->meta_tags_context->indexable->twitter_image_id     = 5678;
		$this->meta_tags_context->indexable->twitter_image_source = 'set-by-user';


		$image_id = $this->generate_image_id();

		$image_schema = [
			'@type'      => 'ImageObject',
			'@id'        => 'http://basic.wordpress.test/2021/02/23/hello-world/#primaryimage',
			'inLanguage' => 'en-US',
			'url'        => 'http://basic.wordpress.test/wp-content/uploads/2021/03/twitter-image.jpg',
			'contentUrl' => 'http://basic.wordpress.test/wp-content/uploads/2021/03/twitter-image.jpg',
			'width'      => 732,
			'height'     => 248,
		];

		$this->schema_image->expects( 'generate_from_attachment_id' )
			->once()
			->with( $image_id, 5678 )
			->andReturn( $image_schema );

		self::assertEquals( $image_schema, $this->instance->generate() );
	}

	/**
	 * Tests is needed.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$this->meta_tags_context->indexable->object_type = 'post';

		self::assertTrue( $this->instance->is_needed() );
	}

	/**
	 * Tests is not needed.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed() {
		$this->meta_tags_context->indexable->object_type = 'user';

		self::assertFalse( $this->instance->is_needed() );
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
