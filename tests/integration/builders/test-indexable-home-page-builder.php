<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Formatter
 */

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Home_Page_Builder
 */
class Indexable_Home_Page_Builder_Test extends WPSEO_UnitTestCase {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	private $taxonomy_helper;

	/**
	 * The image helper.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	private $image_helper;

	/**
	 * The image helper.
	 *
	 * @var Mockery\MockInterface|Open_Graph_Image_Helper
	 */
	private $open_graph_image_helper;

	/**
	 * The image helper.
	 *
	 * @var Mockery\MockInterface|Twitter_Image_Helper
	 */
	private $twitter_image_helper;

	/**
	 * The indexable builder versions value.
	 *
	 * @var Indexable_Builder_Versions
	 */
	private $versions;

	/**
	 * The post helper.
	 *
	 * @var Post_Helper
	 */
	private $post_helper;

	/**
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	protected $url_helper;

	/**
	 * The instance.
	 *
	 * @var Indexable_Home_Page_Builder
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();

		
		$this->options_helper          = new Options_Helper();
		$this->versions                = new Indexable_Builder_Versions();
		$this->image_helper            = Mockery::mock( Image_Helper::class );
		$this->open_graph_image_helper = Mockery::mock( Open_Graph_Image_Helper::class );
		$this->twitter_image_helper    = Mockery::mock( Twitter_Image_Helper::class );
		$this->url_helper              = new Url_Helper();

		$string_helper    = new String_Helper();
		$post_type_helper = new Post_Type_Helper( $this->options_helper );

		$this->taxonomy_helper         = new Taxonomy_Helper( $this->options_helper, $string_helper );
		$this->post_helper             = new Post_Helper( $string_helper, $post_type_helper );

		$this->instance = new Indexable_Home_Page_Builder(
			$this->options_helper,
			$this->url_helper,
			$this->versions,
			$this->post_helper
		);

		$this->instance->set_social_image_helpers( $this->image_helper, $this->open_graph_image_helper, $this->twitter_image_helper );
	}

	/**
	 * Tests the build method.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$description = "A cool description";
		$this->options_helper->set( 'metadesc-home-wpseo', $description );

		$post_data = [
			'post_title'  => 'Test post',
			'post_date'   => '1978-09-13 08:50:00',
			'post_status' => 'publish',
		];

		self::factory()->post->create( $post_data );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $indexable );

		$this->assertInstanceOf( Indexable::class, $result );
		$this->assertEquals( '1978-09-13 08:50:00', $result->object_published_at );
		$this->assertEquals( '1978-09-13 08:50:00', $result->object_last_modified );
		$this->assertEquals( 'home-page', $result->object_type );
		$this->assertEquals( $this->options_helper->get( 'title-home-wpseo' ), $result->title );
		$this->assertEquals( $this->options_helper->get( 'breadcrumbs-home' ), $result->breadcrumb_title );
		$this->assertEquals( $this->url_helper->home(), $result->permalink );
		$this->assertEquals( $description, $result->description );
		$this->assertEquals( \get_current_blog_id(), $result->blog_id );
		$this->assertNull( $result->open_graph_image_source );
		$this->assertNull( $result->open_graph_image_meta );
		$this->assertEquals( $this->options_helper->get( 'open_graph_frontpage_title' ), $result->open_graph_title );
		$this->assertEquals( $this->options_helper->get( 'open_graph_frontpage_image' ), $result->open_graph_image );
		$this->assertEquals( $this->options_helper->get( 'open_graph_frontpage_image_id' ), $result->open_graph_image_id );
		$this->assertEquals( $this->options_helper->get( 'open_graph_frontpage_desc' ), $result->open_graph_description );
	}

	/**
	 * Tests the build method when no description has been provided.
	 *
	 * @covers ::build
	 */
	public function test_build_with_fallback_description() {
		$this->options_helper->set( 'metadesc-home-wpseo', '' );

		$fallback_description = "A cool fallback description";
		update_option( 'blogdescription', $fallback_description );

		$post_data = [
			'post_title'  => 'Test post',
			'post_date'   => '1978-09-13 08:50:00',
			'post_status' => 'publish',
		];

		self::factory()->post->create( $post_data );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $indexable );

		$this->assertInstanceOf( Indexable::class, $result );
		$this->assertEquals( $fallback_description, $result->description );
	}

	/**
	 * Tests the build method when an Open Graph image is present.
	 *
	 * @covers ::build
	 */
	/* WIP
	public function test_build_when_open_graph_image_is_present() {
		// Create the attachement post.
		$id = wp_insert_attachment(
			array(
				'post_title'     => 'Attachment Title',
				'post_type'      => 'attachment',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'guid'           => 'http://' . WP_TESTS_DOMAIN . '/wp-content/uploads/test-image.jpg',
			)
		);

		$this->options_helper->set( 'open_graph_frontpage_image_id', $id );

		$this->open_graph_image_helper
			->shouldReceive( 'get_image_by_id' )
			->with( $id )
			->once()
			->andReturn( 'http://example.org/wp-content/uploads/test-image.jpg' );
		$post_data = [
			'post_title'  => 'Test post',
			'post_date'   => '1978-09-13 08:50:00',
			'post_status' => 'publish',
		];

		self::factory()->post->create( $post_data );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $indexable );

		$this->assertInstanceOf( Indexable::class, $result );
	}
	*/
}
