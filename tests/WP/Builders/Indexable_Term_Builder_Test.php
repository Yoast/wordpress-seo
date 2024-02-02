<?php

namespace Yoast\WP\SEO\Tests\WP\Builders;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Invalid_Term_Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Term_Not_Built_Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Term_Not_Found_Exception;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Term_Builder
 */
final class Indexable_Term_Builder_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Indexable_Term_Builder
	 */
	private $instance;

	/**
	 * The term id.
	 *
	 * @var int
	 */
	private $term_id;

	/**
	 * Holds the meta data for our term.
	 *
	 * @var array
	 */
	private $wpseo_taxonomy_meta;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$post_id = self::factory()->post->create(
			[
				'post_title'  => 'Test post',
				'post_date'   => '1978-09-13 08:50:00',
				'post_status' => 'publish',
			]
		);

		$this->term_id = self::factory()->category->create(
			[
				'name'     => 'test_term',
				'taxonomy' => 'category',
			]
		);

		self::factory()->term->add_post_terms( $post_id, $this->term_id, 'category', true );

		$this->wpseo_taxonomy_meta = [
			'category' => [
				$this->term_id            => [
					'wpseo_focuskw'        => 'cool category',
					'wpseo_linkdex'        => '39',
					'wpseo_content_score'  => '0',
					'wpseo_noindex'        => 'index',
					'wpseo_is_cornerstone' => '1',
				],
				'wpseo_already_validated' => 'true',
			],
		];

		\update_option( 'wpseo_taxonomy_meta', $this->wpseo_taxonomy_meta );

		$this->instance = new Indexable_Term_Builder(
			\YoastSEO()->helpers->taxonomy,
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
		$term = \get_term( $this->term_id );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $this->term_id, $indexable );

		$this->assertInstanceOf( Indexable::class, $result, 'The result should be an instance of Indexable.' );
		$this->assertEquals( 'term', $result->object_type, 'The object type should be term.' );
		$this->assertEquals( $this->term_id, $result->object_id, 'The object id should be the term id.' );
		$this->assertEquals( \get_current_blog_id(), $result->blog_id, 'The blog id should be the current blog id.' );
		$this->assertEquals( $term->taxonomy, $result->object_sub_type, 'The object sub type should be the term taxonomy.' );
		$this->assertEquals( $term->name, $result->breadcrumb_title, 'The breadcrumb title should be the term name.' );
		$this->assertEquals( \get_term_link( $term, $term->taxonomy ), $result->permalink, 'The permalink should be the term link.' );
		$this->assertEquals( $this->wpseo_taxonomy_meta['category'][ $this->term_id ]['wpseo_linkdex'], $result->primary_focus_keyword_score, 'The primary focus keyword score should be the term linkdex.' );
		$this->assertTrue( $result->is_public, 'The term should be public.' );
		$this->assertFalse( $result->is_robots_noindex, 'The term should not be noindex.' );
		$this->assertTrue( $result->is_cornerstone, 'The term should be a cornerstone.' );

		$this->assertEquals( '1978-09-13 08:50:00', $result->object_published_at, 'The object published at should be the post date.' );
	}

	/**
	 * Tests the build method when the term the indexable should be built for does not exist.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_term_not_found() {
		$term_id = -1;

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$this->expectException( Term_Not_Found_Exception::class );
		$this->expectExceptionMessage( 'The term could not be found.' );

		$this->instance->build( $term_id, $indexable );
	}

	/**
	 * Tests the build method when the category of the term the indexable should be built is not indexable (i.e. it is not public).
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_category_not_indexable() {
		\register_taxonomy(
			'test_tax',
			'post',
			[
				'public'            => false,
				'query_var'         => false,
			]
		);

		$term_id = self::factory()->term->create(
			[
				'taxonomy' => 'test_tax',
				'name'     => 'test_term',
			]
		);

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$this->expectException( Term_Not_Built_Exception::class );
		$this->expectExceptionMessage( "The term $term_id could not be built because it's not indexable" );

		$this->instance->build( $term_id, $indexable );
	}

	/**
	 * Tests the build method when the termpassed to the build function is invalid.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_invalid_term() {
		$term = '';

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$this->expectException( Invalid_Term_Exception::class );
		$this->expectExceptionMessage( 'The term is considered invalid. The following reason was given by WordPress:' );

		$this->instance->build( $term, $indexable );
	}
}
