<?php

namespace Yoast\WP\SEO\Tests\WP\Builders;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Home_Page_Builder
 */
final class Indexable_Home_Page_Builder_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Indexable_Home_Page_Builder
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$this->instance = new Indexable_Home_Page_Builder(
			\YoastSEO()->helpers->options,
			\YoastSEO()->helpers->url,
			\YoastSEO()->classes->get( Indexable_Builder_Versions::class ),
			\YoastSEO()->helpers->post
		);

		$this->instance->set_social_image_helpers(
			\YoastSEO()->helpers->image,
			\YoastSEO()->helpers->open_graph->image,
			\YoastSEO()->helpers->twitter->image
		);
	}

	/**
	 * Tests the build method's happy path.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build() {
		$description = 'A cool description';
		\YoastSEO()->helpers->options->set( 'metadesc-home-wpseo', $description );

		$post_data = [
			'post_title'  => 'Test post',
			'post_date'   => '1978-09-13 08:50:00',
			'post_status' => 'publish',
		];

		self::factory()->post->create( $post_data );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $indexable );

		$this->assertInstanceOf( Indexable::class, $result, 'The result should be an instance of Indexable.' );
		$this->assertEquals( '1978-09-13 08:50:00', $result->object_published_at, 'object_published_at should be 1978-09-13 08:50:00.' );
		$this->assertEquals( '1978-09-13 08:50:00', $result->object_last_modified, 'object_last_modified should be 1978-09-13 08:50:00.' );
		$this->assertEquals( 'home-page', $result->object_type, 'object_type should be home-page.' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'title-home-wpseo' ), $result->title, 'title should be the same as the title-home-wpseo option.' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'breadcrumbs-home' ), $result->breadcrumb_title, 'breadcrumb_title should be the same as the breadcrumbs-home option.' );
		$this->assertEquals( \YoastSEO()->helpers->url->home(), $result->permalink, 'permalink should be the same as the home url.' );
		$this->assertEquals( $description, $result->description, 'description is not correct.' );
		$this->assertEquals( \get_current_blog_id(), $result->blog_id, 'blog_id should be the id of the current blog.' );
		$this->assertNull( $result->open_graph_image_source, 'open_graph_image_source should be null.' );
		$this->assertNull( $result->open_graph_image_meta, 'open_graph_image_meta should be null.' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'open_graph_frontpage_title' ), $result->open_graph_title, 'open_graph_title should be the same as the open_graph_frontpage_title option.' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'open_graph_frontpage_image' ), $result->open_graph_image, 'open_graph_image should be the same as the open_graph_frontpage_image option.' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'open_graph_frontpage_image_id' ), $result->open_graph_image_id, 'open_graph_image_id should be the same as the open_graph_frontpage_image_id option.' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'open_graph_frontpage_desc' ), $result->open_graph_description, 'open_graph_description should be the same as the open_graph_frontpage_desc option.' );
	}

	/**
	 * Tests the build method when no description has been provided.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_with_fallback_description() {
		\YoastSEO()->helpers->options->set( 'metadesc-home-wpseo', '' );

		$fallback_description = 'A cool fallback description';
		\update_option( 'blogdescription', $fallback_description );

		$post_data = [
			'post_title'  => 'Test post',
			'post_date'   => '1978-09-13 08:50:00',
			'post_status' => 'publish',
		];

		self::factory()->post->create( $post_data );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $indexable );

		$this->assertInstanceOf( Indexable::class, $result, 'The result should be an instance of Indexable.' );
		$this->assertEquals( $fallback_description, $result->description, 'description is not correct.' );
	}

	/**
	 * Tests the build method when an Open Graph image is present.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_when_open_graph_image_is_present() {
		$fake_image_path   = '/wp-content/uploads/cat.jpg';
		$fake_image_width  = 1024;
		$fake_image_height = 768;

		$expected_image = [
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
		$id = \wp_insert_attachment(
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

		\YoastSEO()->helpers->options->set( 'open_graph_frontpage_image_id', $id );

		$post_data = [
			'post_title'  => 'Test post',
			'post_date'   => '1978-09-13 08:50:00',
			'post_status' => 'publish',
		];

		self::factory()->post->create( $post_data );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $indexable );

		$this->assertInstanceOf( Indexable::class, $result, 'The result should be an instance of Indexable.' );
		$this->assertEquals( \home_url() . $fake_image_path, $result->open_graph_image, 'open_graph_image is not correct.' );
		$this->assertEqualsCanonicalizing( $expected_image, (array) \json_decode( $result->open_graph_image_meta ), 'open_graph_image_meta is not correct.' );
	}
}
