<?php

namespace Yoast\WP\SEO\Tests\WP\Builders;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Post_Type_Not_Built_Exception;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder
 */
final class Indexable_Post_Type_Archive_Builder_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Indexable_Post_Type_Archive_Builder
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$this->instance = new Indexable_Post_Type_Archive_Builder(
			\YoastSEO()->helpers->options,
			\YoastSEO()->classes->get( 'Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions' ),
			\YoastSEO()->helpers->post,
			\YoastSEO()->helpers->post_type
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
		$post_type = 'my-custom-post-type';
		\register_post_type(
			$post_type,
			[
				'public'      => true,
				'has_archive' => true,
				'description' => 'a cool post type',
				'label'       => $post_type,
			]
		);

		$post = [
			'post_date'   => '1978-09-13 08:50:00',
			'post_status' => 'publish',
			'post_type'   => $post_type,
		];

		self::factory()->post->create( $post );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $post_type, $indexable );

		$this->assertInstanceOf( Indexable::class, $result, 'The result should be an instance of Indexable.' );
		$this->assertEquals( $post_type, $result->object_sub_type, 'object_sub_type is not correct.' );
		$this->assertEquals( 'post-type-archive', $result->object_type, 'object_type should be "post-type-archive".' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'title-ptarchive-' . $post_type ), $result->title, 'The title is not correct.' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'metadesc-ptarchive-' . $post_type ), $result->description, 'The description is not correct.' );
		$this->assertEquals( $post_type, $result->breadcrumb_title, 'breadcrumb_title is not correct.' );
		$this->assertEquals( \get_post_type_archive_link( $post_type ), $result->permalink, 'permalink is not correct.' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'noindex-ptarchive-' . $post_type ), $result->is_robots_noindex, "noindex-ptarchive-$post_type is not correct." );
		$this->assertEquals( \get_current_blog_id(), $result->blog_id, 'The blog id is not correct.' );
		$this->assertEquals( '1978-09-13 08:50:00', $result->object_published_at, 'published_at should be 1978-09-13 08:50:00' );
	}

	/**
	 * Tests the build method when the post type is not public.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_when_post_type_not_public() {
		$post_type = 'my-private-post-type';
		\register_post_type(
			$post_type,
			[
				'public'      => false,
				'has_archive' => true,
				'description' => 'a cool post type',
				'label'       => $post_type,
			]
		);

		$post = [
			'post_date'   => '1978-09-13 08:50:00',
			'post_status' => 'publish',
			'post_type'   => $post_type,
		];

		self::factory()->post->create( $post );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$this->expectException( Post_Type_Not_Built_Exception::class );
		$this->expectExceptionMessage( 'The post type ' . $post_type . ' could not be indexed because it does not meet indexing requirements.' );

		$this->instance->build( $post_type, $indexable );
	}
}
