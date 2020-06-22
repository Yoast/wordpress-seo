<?php

namespace Yoast\WP\SEO\Tests\Generators;

use Brain\Monkey;
use Error;
use Mockery;
use WPSEO_Utils;
use Yoast\WP\SEO\Generators\Open_Graph_Image_Generator;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Values\Open_Graph\Images;

/**
 * Class Open_Graph_Image_Generator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Open_Graph_Image_Generator
 *
 * @group generators
 * @group open-graph
 * @group open-graph-image
 */
class Open_Graph_Image_Generator_Test extends TestCase {

	/**
	 * @var Open_Graph_Image_Helper|Mockery\MockInterface
	 */
	protected $open_graph_image;

	/**
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image;

	/**
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options;

	/**
	 * @var Open_Graph_Image_Generator|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * @var Mockery\MockInterface|Images
	 */
	protected $image_container;

	/**
	 * @var Mockery\MockInterface|Meta_Tags_Context_Mock
	 */
	protected $context;

	/**
	 * @var Mockery\MockInterface|Url_Helper
	 */
	protected $url;

	/**
	 * Setup the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->image            = Mockery::mock( Image_Helper::class );
		$this->url              = Mockery::mock( Url_Helper::class );
		$this->options          = Mockery::mock( Options_Helper::class );
		$this->open_graph_image = Mockery::mock(
			Open_Graph_Image_Helper::class,
			[ $this->url, $this->image ]
		);
		$this->image_container  = Mockery::mock( Images::class, [ $this->image, $this->url ] )->makePartial();

		$this->instance = Mockery::mock(
			Open_Graph_Image_Generator::class,
			[ $this->open_graph_image, $this->image, $this->options, $this->url ]
		)->shouldAllowMockingProtectedMethods()->makePartial();

		$this->instance
			->expects( 'get_image_container' )
			->twice()
			->andReturn( $this->image_container );

		$this->indexable          = new Indexable_Mock();
		$this->context            = Mockery::mock( Meta_Tags_Context_Mock::class );
		$this->context->indexable = $this->indexable;
	}

	/**
	 * Tests the open_graph_image_id set for an indexable where the `wpseo_add_opengraph_images_filter` filter throws an error.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 */
	public function test_generate_with_wpseo_add_opengraph_images_filter_throws_an_exception() {
		$this->indexable->open_graph_image_id = 1337;

		Monkey\Filters\expectApplied( 'wpseo_add_opengraph_images' )
			->andThrow( new Error( 'Something went wrong' ) );

		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image_by_id' )
			->once()
			->with( 1337 );

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the open_graph_image_id set for an indexable where the `wpseo_add_opengraph_additional_images` filter throws an error.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 */
	public function test_generate_with_wpseo_add_opengraph_additional_images_filter_throws_an_exception() {
		$this->indexable->open_graph_image_id = 1337;

		Monkey\Filters\expectApplied( 'wpseo_add_opengraph_additional_images' )
			->andThrow( new Error( 'Something went wrong' ) );

		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image_by_id' )
			->once()
			->with( 1337 );

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the open_graph_image_id set for an indexable.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 */
	public function test_generate_with_image_id_from_indexable() {
		$this->indexable->open_graph_image_id = 1337;

		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image_by_id' )
			->once()
			->with( 1337 );

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the open_graph_image set for an indexable.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 */
	public function test_generate_with_image_url_from_indexable() {
		$this->indexable->open_graph_image = 'image.jpg';

		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image' )
			->once()
			->with( [ 'url' => 'image.jpg' ] );

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the open_graph_image set for an indexable.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 */
	public function test_generate_with_image_url_from_indexable_with_open_graph_image_meta() {
		$this->indexable->open_graph_image      = 'image.jpg';
		$this->indexable->open_graph_image_meta = WPSEO_Utils::format_json_encode(
			[
				'height' => 1024,
				'width'  => 2048,
			]
		);

		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image' )
			->once()
			->with(
				[
					'height' => 1024,
					'width'  => 2048,
					'url'    => 'image.jpg',
				]
			);

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the situation where the default Open Graph image id is given.
	 *
	 * @covers ::generate
	 * @covers ::add_from_default
	 */
	public function test_with_add_from_default_with_image_id() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnFalse();

		$this->options
			->expects( 'get' )
			->once()
			->with( 'og_default_image_id', '' )
			->andReturn( 1 );

		$this->image_container
			->expects( 'add_image_by_id' )
			->with( 1 )
			->andReturnNull();

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the situation where the default Open Graph image is given.
	 *
	 * @covers ::generate
	 * @covers ::add_from_default
	 */
	public function test_with_add_from_default_with_image_url() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnFalse();

		$this->options
			->expects( 'get' )
			->once()
			->with( 'og_default_image_id', '' )
			->andReturnFalse();

		$this->options
			->expects( 'get' )
			->once()
			->with( 'og_default_image', '' )
			->andReturn( 'image.jpg' );

		$this->image_container
			->expects( 'add_image_by_url' )
			->with( 'image.jpg' )
			->andReturnNull();

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the situation where we rely on the default but there are images set already.
	 *
	 * @covers ::generate
	 * @covers ::add_from_default
	 */
	public function test_with_add_from_default_when_having_images_already() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnTrue();

		$this->instance->generate( $this->context );
	}
}
