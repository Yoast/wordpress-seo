<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Formatter
 */

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\SEO\Dependency_Injection\Container_Compiler;
use Yoast\WP\SEO\Generated\Cached_Container;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
	 * The indexable builder versions value.
	 *
	 * @var Indexable_Builder_Versions
	 */
	private $versions;

	/**
	 * The url helper.
	 *
	 * @var Url_Helper
	 */
	private $url_helper;

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
		$container = $this->get_container();

		$this->options_helper = new Options_Helper();
		$this->url_helper     = new Url_Helper();
		$this->versions       = new Indexable_Builder_Versions();

		$this->instance = new Indexable_Home_Page_Builder(
			$this->options_helper,
			$this->url_helper,
			$this->versions,
			$container->get( 'Yoast\WP\SEO\Helpers\Post_Helper' )
		);

		$this->instance->set_social_image_helpers(
			$container->get( 'Yoast\WP\SEO\Helpers\Image_Helper' ),
			$container->get( 'Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper' ),
			$container->get( 'Yoast\WP\SEO\Helpers\Twitter\Image_Helper' )
		);
	}

	/**
	 * Tests the build method.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$description = 'A cool description';
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

		$fallback_description = 'A cool fallback description';
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
	public function test_build_when_open_graph_image_is_present() {
		$fake_image_path   = '/wp-content/uploads/cat.jpg';
		$fake_image_width  = 1024;
		$fake_image_height = 768;

		$expected_image    = [
			'width'  => $fake_image_width,
			'height' => $fake_image_height,
			'url'    => \home_url() . $fake_image_path,
			'path'   => $fake_image_path,
			'size'   => 'full',
			'alt'    => '',
			'pixels' => ( $fake_image_width * $fake_image_height ),
			'type'   => 'image/jpeg',
		];

		// Create the attachement post.
		$id = wp_insert_attachment(
			[
				'post_title'     => 'Attachment Title',
				'post_type'      => 'attachment',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'guid'           => \home_url() . $fake_image_path,
			]
		);

		$expected_image['id'] = $id;

		\update_post_meta( $id, '_wp_attached_file', $fake_image_path );
		\update_post_meta(
			$id,
			'_wp_attachment_metadata',
			[
				'width'  => $fake_image_width,
				'height' => $fake_image_height,
			]
		);

		$this->options_helper->set( 'open_graph_frontpage_image_id', $id );

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
		$this->assertEquals( \home_url() . $fake_image_path, $result->open_graph_image );
		$this->assertEqualsCanonicalizing( $expected_image, (array) json_decode( $result->open_graph_image_meta ) );
	}

	/**
	 * Method to get our service container.
	 *
	 * @return Cached_Container|null
	 */
	private function get_container() {
		if ( \file_exists( __DIR__ . '/../../../src/generated/container.php' ) ) {
			require_once __DIR__ . '/../../../src/generated/container.php';

			return new Cached_Container();
		}

		return null;
	}
}
