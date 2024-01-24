<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators;

use Brain\Monkey;
use Error;
use Mockery;
use WPSEO_Utils;
use Yoast\WP\SEO\Generators\Open_Graph_Image_Generator;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;
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
final class Open_Graph_Image_Generator_Test extends TestCase {

	/**
	 * Open graph image helper mock.
	 *
	 * @var Open_Graph_Image_Helper|Mockery\MockInterface
	 */
	protected $open_graph_image;

	/**
	 * Image helper mock.
	 *
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image;

	/**
	 * Options helper mock.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options;

	/**
	 * Instance under test.
	 *
	 * @var Open_Graph_Image_Generator|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Indexable mock.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * Images container mock.
	 *
	 * @var Mockery\MockInterface|Images
	 */
	protected $image_container;

	/**
	 * Meta tags context mock.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Mock
	 */
	protected $context;

	/**
	 * Indexable_Presentation mock.
	 *
	 * @var Mockery\MockInterface
	 */
	protected $presentation;

	/**
	 * URL helper mock.
	 *
	 * @var Mockery\MockInterface|Url_Helper
	 */
	protected $url;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

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
			->andReturn( $this->image_container )
			->byDefault();

		$this->indexable             = new Indexable_Mock();
		$this->context               = Mockery::mock( Meta_Tags_Context_Mock::class );
		$this->presentation          = Mockery::mock( Indexable_Presentation::class );
		$this->context->indexable    = $this->indexable;
		$this->context->presentation = $this->presentation;
	}

	/**
	 * Tests the open_graph_image_id set for an indexable where the `wpseo_add_opengraph_images_filter` filter throws an error.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 *
	 * @return void
	 */
	public function test_generate_with_wpseo_add_opengraph_images_filter_throws_an_exception() {
		$this->indexable->open_graph_image_id = 1337;

		Monkey\Filters\expectApplied( 'wpseo_add_opengraph_images' )
			->andThrow( new Error( 'Something went wrong' ) );

		$this->instance->expects( 'add_from_templates' )->andReturnNull();
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
	 *
	 * @return void
	 */
	public function test_generate_with_wpseo_add_opengraph_additional_images_filter_throws_an_exception() {
		$this->indexable->open_graph_image_id = 1337;

		Monkey\Filters\expectApplied( 'wpseo_add_opengraph_additional_images' )
			->andThrow( new Error( 'Something went wrong' ) );

		$this->instance->expects( 'add_from_templates' )->andReturnNull();
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
	 *
	 * @return void
	 */
	public function test_generate_with_image_id_from_indexable() {
		$this->indexable->open_graph_image_id = 1337;

		$this->instance->expects( 'add_from_templates' )->andReturnNull();
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
	 *
	 * @return void
	 */
	public function test_generate_with_image_url_from_indexable() {
		$this->indexable->open_graph_image = 'image.jpg';

		$this->instance->expects( 'add_from_templates' )->andReturnNull();
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
	 *
	 * @return void
	 */
	public function test_generate_with_image_url_from_indexable_with_open_graph_image_meta() {
		$this->indexable->open_graph_image      = 'image.jpg';
		$this->indexable->open_graph_image_meta = WPSEO_Utils::format_json_encode(
			[
				'height' => 1024,
				'width'  => 2048,
				'url'    => 'image.jpg',
			]
		);

		$this->instance->expects( 'add_from_templates' )->andReturnNull();
		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image_by_meta' )
			->once()
			->with( $this->indexable->open_graph_image_meta );

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the situation where the Open Graph image id from the template is given.
	 *
	 * @covers ::generate
	 * @covers ::add_from_templates
	 *
	 * @return void
	 */
	public function test_with_add_from_templates_with_image_id() {
		$this->context->presentation->open_graph_image_id = 100;

		$this->instance->expects( 'add_from_indexable' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->twice()
			->andReturn( false, true );

		$this->image_container
			->expects( 'add_image_by_id' )
			->with( 100 )
			->andReturnNull();

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the situation where the default Open Graph image is given.
	 *
	 * @covers ::generate
	 * @covers ::add_from_templates
	 *
	 * @return void
	 */
	public function test_with_add_from_templates_with_image_url() {
		$this->context->presentation->open_graph_image_id = null;
		$this->context->presentation->open_graph_image    = 'image.jpg';

		$this->instance->expects( 'add_from_indexable' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->twice()
			->andReturn( false, true );

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
	 * @covers ::add_from_templates
	 *
	 * @return void
	 */
	public function test_with_add_from_templates_when_having_images_already() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnTrue();

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the situation where the default Open Graph image id is given.
	 *
	 * @covers ::generate
	 * @covers ::add_from_default
	 *
	 * @return void
	 */
	public function test_with_add_from_default_with_image_id() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_from_templates' )->andReturnNull();

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
	 *
	 * @return void
	 */
	public function test_with_add_from_default_with_image_url() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_from_templates' )->andReturnNull();

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
	 *
	 * @return void
	 */
	public function test_with_add_from_default_when_having_images_already() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();
		$this->instance->expects( 'add_from_templates' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnTrue();

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the situation where we have a template set for the Author Archives.
	 *
	 * @covers ::generate_for_author_archive
	 *
	 * @return void
	 */
	public function test_for_author_archive_with_template() {
		$this->instance
			->expects( 'get_image_container' )
			->once()
			->andReturn( $this->image_container );

		$this->instance
			->expects( 'add_from_templates' )
			->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'generate' )
			->never();

		$this->instance->generate_for_author_archive( $this->context );
	}

	/**
	 * Tests the situation where we don't have a template set for the Author Archives.
	 *
	 * @covers ::generate_for_author_archive
	 *
	 * @return void
	 */
	public function test_for_author_archive_without_template() {
		$this->instance
			->expects( 'get_image_container' )
			->once()
			->andReturn( $this->image_container );

		$this->instance
			->expects( 'add_from_templates' )
			->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnFalse();

		$this->instance
			->expects( 'generate' )
			->once();

		$this->instance->generate_for_author_archive( $this->context );
	}
}
