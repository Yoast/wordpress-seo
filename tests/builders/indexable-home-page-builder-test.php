<?php

namespace Yoast\WP\SEO\Tests\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Author_Builder
 * @covers ::<!public>
 */
class Indexable_Home_Page_Builder_Test extends TestCase {

	/**
	 * Indexable mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Indexable
	 */
	private $indexable_mock;

	/**
	 * Options helper mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Options_Helper
	 */
	private $options_mock;

	/**
	 * Mock meta-data of an image.
	 *
	 * @var array
	 */
	private $image_meta_mock = [
		'width'  => 640,
		'height' => 480,
		'url'    => 'home_og_image',
		'path'   => 'home_og_image',
		'size'   => 'full',
		'id'     => 6,
		'alt'    => '',
		'pixels' => 307200,
		'type'   => 'image\/jpeg',
	];

	/**
	 * URL helper mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Url_Helper
	 */
	private $url_mock;

	/**
	 * Open Graph image helper mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Open_Graph_Image_Helper
	 */
	private $open_graph_image_mock;

	/**
	 * Image helper mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Image_Helper
	 */
	private $image_mock;

	/**
	 * Twitter image helper mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Twitter_Image_Helper
	 */
	private $twitter_image_mock;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		// Setup the options mock.
		$this->options_mock = Mockery::mock( Options_Helper::class );
		$this->options_mock->expects( 'get' )->with( 'title-home-wpseo' )->andReturn( 'home_title' );
		$this->options_mock->expects( 'get' )->with( 'breadcrumbs-home' )->andReturn( 'home_breadcrumb_title' );
		$this->options_mock->expects( 'get' )->with( 'og_frontpage_title' )->andReturn( 'home_og_title' );
		$this->options_mock->expects( 'get' )->with( 'og_frontpage_desc' )->andReturn( 'home_og_description' );
		$this->options_mock->expects( 'get' )->with( 'og_frontpage_image' )->andReturn( 'home_og_image' );
		$this->options_mock->expects( 'get' )->with( 'og_frontpage_image_id' )->andReturn( 1337 );

		// Setup the Indexable mock and its ORM layer.
		$this->indexable_mock      = Mockery::mock( Indexable::class );
		$this->indexable_mock->orm = Mockery::mock( ORM::class );

		// Mock Indexable ORM setters.
		$this->indexable_mock->orm->expects( 'set' )->with( 'object_type', 'home-page' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'title', 'home_title' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'breadcrumb_title', 'home_breadcrumb_title' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://permalink' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', false );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_title', 'home_og_title' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image', 'home_og_image' )->twice();
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_source', 'set-by-user' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_id', 1337 );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_description', 'home_og_description' );

		// Mock offsetExists.
		$this->indexable_mock->orm->expects( 'offsetExists' )->with( 'description' )->andReturn( true );

		// Mock Indexable ORM getters.
		$this->indexable_mock->orm->expects( 'get' )->with( 'description' )->andReturn( 'home_meta_description' );
		$this->indexable_mock->orm->expects( 'get' )->with( 'open_graph_image' )->andReturn( 'home_og_image' );
		$this->indexable_mock->orm->expects( 'get' )->with( 'open_graph_image_id' )->andReturn( 1337 )->twice();

		// Mock URL helper.
		$this->url_mock = Mockery::mock( Url_Helper::class );
		$this->url_mock->expects( 'home' )->once()->with()->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'blog_public' )->andReturn( '1' );

		// Mock Open Graph image helper.
		$this->open_graph_image_mock = Mockery::mock( Open_Graph_Image_Helper::class );

		// Mock main image helper.
		$this->image_mock = Mockery::mock( Image_Helper::class );

		// Mock twitter image helper.
		$this->twitter_image_mock = Mockery::mock( Twitter_Image_Helper::class );
	}

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		// Provide stubs.
		$image_meta_mock_json = \wp_json_encode( $this->image_meta_mock );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_meta', $image_meta_mock_json );
		$this->open_graph_image_mock->allows( 'get_image_by_id' )->with( 1337 )->andReturn( $this->image_meta_mock );

		$this->options_mock->expects( 'get' )->with( 'metadesc-home-wpseo' )->andReturn( 'home_meta_description' );

		$this->indexable_mock->orm->expects( 'set' )->with( 'description', 'home_meta_description' );

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		$this->indexable_mock->orm->expects( 'set' )->with( 'blog_id', 1 );

		$builder = new Indexable_Home_Page_Builder( $this->options_mock, $this->url_mock );
		$builder->set_social_image_helpers( $this->image_mock, $this->open_graph_image_mock, $this->twitter_image_mock );
		$builder->build( $this->indexable_mock );
	}

	/**
	 * Tests the formatting of the indexable data when no meta description for the homepage is set.
	 *
	 * @covers ::build
	 */
	public function test_build_with_fallback_description() {
		// Provide stubs.
		$image_meta_mock_json = \wp_json_encode( $this->image_meta_mock );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_meta', $image_meta_mock_json );
		$this->open_graph_image_mock->allows( 'get_image_by_id' )->with( 1337 )->andReturn( $this->image_meta_mock );

		// When no meta description is stored in the WP_Options...
		$this->options_mock->expects( 'get' )->with( 'metadesc-home-wpseo' )->andReturn( false );
		// We expect the description to be `false` in the ORM layer.
		$this->indexable_mock->orm->expects( 'set' )->with( 'description', false );

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		$this->indexable_mock->orm->expects( 'set' )->with( 'blog_id', 1 );

		$builder = new Indexable_Home_Page_Builder( $this->options_mock, $this->url_mock );
		$builder->set_social_image_helpers( $this->image_mock, $this->open_graph_image_mock, $this->twitter_image_mock );
		$builder->build( $this->indexable_mock );
	}

	/**
	 * Tests whether the open graph image meta data is correctly build and set on the Indexable.
	 */
	public function test_build_open_graph_image_meta_data() {
		$this->options_mock->expects( 'get' )->with( 'metadesc-home-wpseo' )->andReturn( 'home_meta_description' );

		$this->indexable_mock->orm->expects( 'set' )->with( 'description', 'home_meta_description' );

		// Transform the image meta mock to JSON, since we expect that to be stored in the DB.
		$image_meta_mock_json = \wp_json_encode( $this->image_meta_mock );
		// We expect open graph image meta data to be set on the Indexable ORM.
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_meta', $image_meta_mock_json );
		// We expect image meta data to be retrieved from the open graph image helper.
		$this->open_graph_image_mock->expects( 'get_image_by_id' )->with( 1337 )->andReturn( $this->image_meta_mock );

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		$this->indexable_mock->orm->expects( 'set' )->with( 'blog_id', 1 );

		$builder = new Indexable_Home_Page_Builder( $this->options_mock, $this->url_mock );
		$builder->set_social_image_helpers( $this->image_mock, $this->open_graph_image_mock, $this->twitter_image_mock );
		$builder->build( $this->indexable_mock );
	}
}
