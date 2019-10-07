<?php

namespace Yoast\WP\Free\Tests\Generators;

use Mockery;
use Yoast\WP\Free\Generators\OG_Image_Generator;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;
use Yoast\WP\Free\Values\Open_Graph\Images;

/**
 * Class OG_Image_Generator_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Generators\OG_Image_Generator
 *
 * @group generators
 * @group opengraph
 * @group opengraph-image
 */
class OG_Image_Generator_Test extends TestCase {

	/**
	 * @var Open_Graph_Image_Helper|Mockery\MockInterface
	 */
	protected $open_graph_image_helper;

	/**
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image_helper;

	/**
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options_helper;

	/**
	 * @var OG_Image_Generator|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Mockery\MockInterface|Images
	 */
	protected $image_container;

	/**
	 * Setup the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->image_helper            = Mockery::mock( Image_Helper::class );
		$this->options_helper          = Mockery::mock( Options_Helper::class );
		$this->open_graph_image_helper = Mockery::mock(
			Open_Graph_Image_Helper::class,
			[ new Url_Helper(), $this->image_helper ]
		);
		$this->image_container        = Mockery::mock( Images::class )->makePartial();

		$this->instance = Mockery::mock(
			OG_Image_Generator::class,
			[ $this->open_graph_image_helper, $this->image_helper, $this->options_helper ]
		)->shouldAllowMockingProtectedMethods()->makePartial();

		$this->instance
			->expects( 'get_image_container' )
			->once()
			->andReturn( $this->image_container );

		$this->indexable = new Indexable();
	}

	/**
	 * Tests the og_image_id set for an indexable.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 */
	public function test_generate_with_image_id_from_indexable() {
		$this->indexable->og_image_id = 1337;

		$this->instance->expects( 'add_for_object_type' )->andReturnNull();
		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image_by_id' )
			->once()
			->with( 1337 );

		$this->instance->generate( $this->indexable );
	}

	/**
	 * Tests the og_image set for an indexable.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 */
	public function test_generate_with_image_url_from_indexable() {
		$expected_image            = 'image.jpg';
		$this->indexable->og_image = $expected_image;

		$this->instance->expects( 'add_for_object_type' )->andReturnNull();
		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image_by_url' )
			->once()
			->with( 'image.jpg' );

		$this->instance->generate( $this->indexable );
	}

	/**
	 * Tests getting the image for a specific object type which isn't unknown to us.
	 *
	 * @covers ::generate
	 * @covers ::add_for_object_type
	 */
	public function test_generate_for_object_type_for_unknown_type() {
		$this->indexable->object_type = 'unknown';

		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnTrue();

		$this->instance->generate( $this->indexable );
	}

	/**
	 * Tests getting the image for a specific object in the case we already have found images.
	 *
	 * @covers ::generate
	 * @covers ::add_for_object_type
	 */
	public function test_generate_for_object_type_when_having_images_already() {
		$this->indexable->object_type = 'post';

		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnTrue();

		$this->instance->generate( $this->indexable );
	}

	/**
	 * Tests getting the attachment image for an attachment that isn't one.
	 *
	 * @covers ::generate
	 * @covers ::add_for_object_type
	 * @covers ::add_for_attachment
	 */
	public function test_generate_with_attachment_no_being_an_attachment() {
		$this->indexable->object_type     = 'post';
		$this->indexable->object_sub_type = 'attachment';

		\Brain\Monkey\Functions\expect( 'wp_attachment_is_image' )
			->once()
			->andReturn( false );

		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnFalse();

		$this->instance->generate( $this->indexable );
	}

	/**
	 * Test getting the attachment image.
	 *
	 * @covers ::generate
	 * @covers ::add_for_object_type
	 * @covers ::add_for_attachment
	 */
	public function test_generate_with_attachment() {
		$this->indexable->object_type     = 'post';
		$this->indexable->object_sub_type = 'attachment';
		$this->indexable->object_id       = 1337;

		\Brain\Monkey\Functions\expect( 'wp_attachment_is_image' )
			->once()
			->andReturn( true );

		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image_by_id' )
			->once()
			->with( 1337 );

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnFalse();

		$this->instance->generate( $this->indexable );
	}

	/**
	 * Tests getting the featured image id for a post.
	 *
	 * @covers ::generate
	 * @covers ::add_for_object_type
	 * @covers ::add_for_post_type
	 */
	public function test_with_featured_image_id() {
		$this->indexable->object_type = 'post';
		$this->indexable->object_id   = 1337;

		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_helper
			->expects( 'get_featured_image_id' )
			->once()
			->with( 1337 )
			->andReturn( 1 );

		$this->image_container
			->expects( 'add_image_by_id' )
			->once()
			->with( 1 )
			->andReturnNull();

		$this->instance->generate( $this->indexable );
	}

	/**
	 * Tests the situation where the content image is used.
	 *
	 * @covers ::generate
	 * @covers ::add_for_object_type
	 * @covers ::add_for_post_type
	 */
	public function test_with_content_image() {
		$this->indexable->object_type = 'post';
		$this->indexable->object_id   = 1337;

		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_helper
			->expects( 'get_featured_image_id' )
			->once()
			->with( 1337 )
			->andReturnFalse();

		$this->image_helper
			->expects( 'get_post_content_image' )
			->once()
			->with( 1337 )
			->andReturn( 'image.jpg' );

		$this->image_container
			->expects( 'add_image_by_url' )
			->with( 'image.jpg' )
			->andReturnNull();


		$this->instance->generate( $this->indexable );
	}

	/**
	 * Tests the situation where the default og image id is given.
	 *
	 * @covers ::generate
	 * @covers ::add_from_default
	 */
	public function test_with_add_from_default_with_image_id() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_for_object_type' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnFalse();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'og_default_image_id', '' )
			->andReturn( 1 );

		$this->image_container
			->expects( 'add_image_by_id' )
			->with( 1 )
			->andReturnNull();

		$this->instance->generate( $this->indexable );
	}

	/**
	 * Tests the situation where the default og image is given.
	 *
	 * @covers ::generate
	 * @covers ::add_from_default
	 */
	public function test_with_add_from_default_with_image_url() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_for_object_type' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnFalse();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'og_default_image_id', '' )
			->andReturnFalse();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'og_default_image', '' )
			->andReturn( 'image.jpg' );

		$this->image_container
			->expects( 'add_image_by_url' )
			->with( 'image.jpg' )
			->andReturnNull();

		$this->instance->generate( $this->indexable );
	}

	/**
	 * Tests the situation where we rely on the default but there are images set already.
	 *
	 * @covers ::generate
	 * @covers ::add_from_default
	 */
	public function test_with_add_from_default_when_having_images_already() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_for_object_type' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnTrue();

		$this->instance->generate( $this->indexable );
	}
}
