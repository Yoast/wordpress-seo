<?php

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema;
use Yoast\WP\SEO\Presentations\Generators\Schema\Main_Image;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Main_Image_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Generators\Schema\Main_Image
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
	 * @var Schema\Image_Helper
	 */
	private $schema_image;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
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
	 * @var Meta_Tags_Context
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

		$this->instance = new Main_Image(
			$this->image,
			$this->schema_image
		);

		$this->instance->set_id_helper( $this->schema_id );

		$this->meta_tags_context = new Meta_Tags_Context();
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

		Monkey\Functions\expect( 'has_post_thumbnail' )
			->once()
			->with( 1337 )
			->andReturn( false );

		$this->image->expects( 'get_post_content_image' )
			->once()
			->with( 1337 )
			->andReturn( '' );

		$this->assertEquals( false, $this->instance->generate( $this->meta_tags_context ) );
	}
}
