<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Open_Graph;

use Brain\Monkey;
use Mockery;
use WP;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Image_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Image_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Image_Presenter
 *
 * @group presenters
 * @group open-graph
 * @group open-graph-image
 */
final class Image_Presenter_Test extends TestCase {

	/**
	 * The image presenter instance.
	 *
	 * @var Image_Presenter|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $presentation;

	/**
	 * Setup some mocks.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance     = new Image_Presenter();
		$this->presentation = new Indexable_Presentation();

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests the present when no image is given.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_with_no_set_images() {
		$this->presentation->open_graph_images = [];

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the presentation with a set image.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_with_a_set_image() {
		$this->stubEscapeFunctions();

		$image = [
			'url'    => 'https://example.com/image.jpg',
			'width'  => 100,
			'height' => 100,
		];

		$this->presentation->open_graph_images = [ $image ];

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		Monkey\Functions\expect( 'is_attachment' )
			->once()
			->andReturn( false );

		$this->assertEquals(
			'<meta property="og:image" content="https://example.com/image.jpg" />' . \PHP_EOL . "\t" . '<meta property="og:image:width" content="100" />' . \PHP_EOL . "\t" . '<meta property="og:image:height" content="100" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests the situation where the apply_filters returns a non-string value.
	 *
	 * @covers ::filter
	 *
	 * @return void
	 */
	public function test_filter_wrong_image_url_returned() {
		$image = [ 'url' => 'https://example.com/image.jpg' ];

		$this->presentation->open_graph_images = [ $image ];

		Monkey\Filters\expectApplied( 'wpseo_opengraph_image' )
			->once()
			->with( 'https://example.com/image.jpg', $this->presentation )
			->andReturn( false );

		$this->assertEquals(
			[
				[
					'url'    => 'https://example.com/image.jpg',
					'type'   => '',
					'width'  => '',
					'height' => '',
				],
			],
			$this->instance->get()
		);
	}

	/**
	 * Tests the situation where the apply_filters returns another image.
	 *
	 * @covers ::filter
	 *
	 * @return void
	 */
	public function test_filter() {
		$image = [
			'url'    => 'https://example.com/image.jpg',
			'width'  => '100',
			'height' => '150',
			'type'   => 'jpg',
		];

		$this->presentation->open_graph_images = [ $image ];

		Monkey\Filters\expectApplied( 'wpseo_opengraph_image' )
			->once()
			->with( 'https://example.com/image.jpg', $this->presentation )
			->andReturn( 'https://example.com/filtered_image.jpg' );

		Monkey\Filters\expectApplied( 'wpseo_opengraph_image_width' )
			->once()
			->with( '100', $this->presentation )
			->andReturn( '110' );

		Monkey\Filters\expectApplied( 'wpseo_opengraph_image_height' )
			->once()
			->with( '150', $this->presentation )
			->andReturn( '160' );

		Monkey\Filters\expectApplied( 'wpseo_opengraph_image_type' )
			->once()
			->with( 'jpg', $this->presentation )
			->andReturn( 'png' );

		$this->assertEquals(
			[
				[
					'url'    => 'https://example.com/filtered_image.jpg',
					'width'  => '110',
					'height' => '160',
					'type'   => 'png',
				],
			],
			$this->instance->get()
		);
	}

	/**
	 * Tests the retrieval of the raw value.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$raw_image = [
			'url'    => 'https://example.com/image.jpg',
			'width'  => 100,
			'height' => 100,
			'path'   => 'SECRET',
		];

		$expected_image = [
			'url'    => 'https://example.com/image.jpg',
			'width'  => 100,
			'height' => 100,
			'type'   => '',
		];

		$this->presentation->open_graph_images = [ $raw_image ];

		$this->assertSame( [ $expected_image ], $this->instance->get() );
	}

	/**
	 * Tests the presentation with a set image when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_with_a_set_image_with_class() {
		$this->stubEscapeFunctions();

		$image = [
			'url'    => 'https://example.com/image.jpg',
			'width'  => 100,
			'height' => 100,
		];

		$this->presentation->open_graph_images = [ $image ];

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		Monkey\Functions\expect( 'is_attachment' )
			->once()
			->andReturn( false );

		$this->assertEquals(
			'<meta property="og:image" content="https://example.com/image.jpg" class="yoast-seo-meta-tag" />' . \PHP_EOL . "\t" . '<meta property="og:image:width" content="100" class="yoast-seo-meta-tag" />' . \PHP_EOL . "\t" . '<meta property="og:image:height" content="100" class="yoast-seo-meta-tag" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests the presentation with an attachment page.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_with_attachment_page() {
		$this->stubEscapeFunctions();
		$wp          = Mockery::mock( WP::class );
		$wp->request = 'https://example.com/image';

		$GLOBALS['wp'] = $wp;

		$image = [
			'url'    => 'https://example.com/wp-content/uploads/2022/09/image.jpg',
			'width'  => 100,
			'height' => 100,
		];

		$this->presentation->open_graph_images = [ $image ];

		Monkey\Functions\expect( 'is_admin_bar_showing' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'is_attachment' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'home_url' )
			->with( $wp->request )
			->andReturnFirstArg();

		$this->assertEquals(
			'<meta property="og:image" content="https://example.com/image" class="yoast-seo-meta-tag" />' . \PHP_EOL . "\t" . '<meta property="og:image:width" content="100" class="yoast-seo-meta-tag" />' . \PHP_EOL . "\t" . '<meta property="og:image:height" content="100" class="yoast-seo-meta-tag" />',
			$this->instance->present()
		);
	}
}
