<?php
namespace Yoast\WP\SEO\Tests\WP\Builders;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Term_Not_Found_Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Invalid_Term_Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Term_Not_Built_Exception;
use Yoast\WP\SEO\Generated\Cached_Container;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Term_Builder
 */
class Indexable_Term_Builder_Test extends TestCase {

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

	private $wpseo_taxonomy_meta;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();

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

		update_option( 'wpseo_taxonomy_meta', $this->wpseo_taxonomy_meta );

		$container = $this->get_container();

		$this->options_helper = new Options_Helper();
		$this->versions       = new Indexable_Builder_Versions();

		$this->taxonomy_helper = $container->get( 'Yoast\WP\SEO\Helpers\Taxonomy_Helper' );
		$this->post_helper     = $container->get( 'Yoast\WP\SEO\Helpers\Post_Helper' );

		$this->instance = new Indexable_Term_Builder( $this->taxonomy_helper, $this->versions, $this->post_helper );


		$this->instance->set_social_image_helpers(
			$container->get( 'Yoast\WP\SEO\Helpers\Image_Helper' ),
			$container->get( 'Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper' ),
			$container->get( 'Yoast\WP\SEO\Helpers\Twitter\Image_Helper' )
		);  }

	/**
	 * Tests the build method's happy path.
	 *
	 * @covers ::build
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
	 */
	public function test_build_term_not_found() {
		$term_id = -1;

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$this->expectException( Term_Not_Found_Exception::class );

		$this->instance->build( $term_id, $indexable );
	}

	/**
	 * Tests the build method when the category of the term the indexable should be built is not indexable (i.e. it is not public).
	 *
	 * @covers ::build
	 */
	public function test_build_category_not_indexable() {
		register_taxonomy(
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

		$this->instance->build( $term_id, $indexable );
	}

	/**
	 * Tests the build method when the termpassed to the build function is invalid.
	 *
	 * @covers ::build
	 */
	public function test_build_invalid_term() {
		$term = '';

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$this->expectException( Invalid_Term_Exception::class );

		$this->instance->build( $term, $indexable );
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
