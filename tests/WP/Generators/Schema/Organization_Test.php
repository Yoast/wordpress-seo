<?php

namespace Yoast\WP\SEO\Tests\WP\Generators\Schema;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\Organization;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Memoizers\Presentation_Memoizer;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Generators\Schema\Organization
 */
final class Organization_Test extends TestCase {

	/**
	 * The generator to test.
	 *
	 * @var Organization
	 */
	private $instance;

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $context;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$indexable_post_builder = new Indexable_Post_Builder(
			\YoastSEO()->helpers->post,
			\YoastSEO()->helpers->post_type,
			\YoastSEO()->classes->get( Indexable_Builder_Versions::class ),
			\YoastSEO()->helpers->meta
		);

		$indexable_post_builder->set_social_image_helpers(
			\YoastSEO()->helpers->image,
			\YoastSEO()->helpers->open_graph->image,
			\YoastSEO()->helpers->twitter->image
		);

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

		$post_id         = self::factory()->post->create( $post );
		$indexable       = new Indexable();
		$indexable->orm  = ORM::for_table( 'wp_yoast_indexable' );
		$built_indexable = $indexable_post_builder->build( $post_id, $indexable );

		$meta_tags_context_memoizer = new Meta_Tags_Context_Memoizer(
			\YoastSEO()->helpers->blocks,
			\YoastSEO()->helpers->current_page,
			\YoastSEO()->classes->get( Indexable_Repository::class ),
			\YoastSEO()->classes->get( Meta_Tags_Context::class ),
			\YoastSEO()->classes->get( Presentation_Memoizer::class )
		);
		$this->context              = $meta_tags_context_memoizer->get( $built_indexable, 'page' );
	}

	/**
	 * Tests that the type is properly set if everything is in the default setting.
	 *
	 * @covers ::generate
	 *
	 * @return void
	 */
	public function test_create_organization_schema() {
		$this->context->site_user_id = 1;

		$this->instance          = \YoastSEO()->classes->get( Organization::class );
		$this->instance->context = $this->context;
		$this->instance->helpers = \YoastSEO()->helpers;
		$webpage_schema_piece    = $this->instance->generate();

		$expected = 'Organization';

		$this->assertEquals( $expected, $webpage_schema_piece['@type'] );
	}

	/**
	 * Tests that mainEntityOfPage gets set for Profile pages.
	 *
	 * @covers ::generate
	 *
	 * @return void
	 */
	public function test_create_organization_schema_for_profile_page() {
		$this->context->site_user_id     = 1;
		$this->context->schema_page_type = [ 'ProfilePage' ];

		$this->instance          = \YoastSEO()->classes->get( Organization::class );
		$this->instance->context = $this->context;
		$this->instance->helpers = \YoastSEO()->helpers;
		$webpage_schema_piece    = $this->instance->generate();

		$expected = $this->context->main_schema_id;

		$this->assertEquals( $expected, $webpage_schema_piece['mainEntityOfPage']['@id'] );
	}
}
