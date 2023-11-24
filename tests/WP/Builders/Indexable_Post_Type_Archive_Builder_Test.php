<?php
namespace Yoast\WP\SEO\Tests\WP\Builders;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder
 */
class Indexable_Post_Type_Archive_Builder_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Indexable_Post_Type_Archive_Builder
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();

		$this->instance = new Indexable_Post_Type_Archive_Builder(
			YoastSEO()->helpers->options,
			YoastSEO()->classes->get( 'Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions' ),
			YoastSEO()->helpers->post,
			YoastSEO()->helpers->post_type
		);
	}

	/**
	 * Tests the build method.
	 *
	 * @covers ::build
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

		$this->assertInstanceOf( Indexable::class, $result );
		$this->assertEquals( $post_type, $result->object_sub_type, 'The object sub-type is not correct.' );
		$this->assertEquals( 'post-type-archive', $result->object_type, 'The object type is not correct.' );
		$this->assertEquals( YoastSEO()->helpers->options->get( 'title-ptarchive-' . $post_type ), $result->title, 'The title is not correct.' );
		$this->assertEquals( YoastSEO()->helpers->options->get( 'metadesc-ptarchive-' . $post_type ), $result->description, 'The description is not correct.' );
		$this->assertEquals( $post_type, $result->breadcrumb_title, 'The breadcrumb title is not correct.' );
		$this->assertEquals( \get_post_type_archive_link( $post_type ), $result->permalink, 'The permalink is not correct.' );
		$this->assertEquals( YoastSEO()->helpers->options->get( 'noindex-ptarchive-' . $post_type ), $result->is_robots_noindex, 'The noindex is not correct.' );
		$this->assertEquals( \get_current_blog_id(), $result->blog_id, 'The blog id is not correct.' );
		$this->assertEquals( '1978-09-13 08:50:00', $result->object_published_at );
	}
}
