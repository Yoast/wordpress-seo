<?php
namespace Yoast\WP\SEO\Tests\WP\Builders;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Term_Not_Found_Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Invalid_Term_Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Term_Not_Built_Exception;
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
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->options_helper = new Options_Helper();
		$this->versions       = new Indexable_Builder_Versions();

		$this->image_helper            = Mockery::mock( Image_Helper::class );
		$this->open_graph_image_helper = Mockery::mock( Open_Graph_Image_Helper::class );
		$this->twitter_image_helper    = Mockery::mock( Twitter_Image_Helper::class );

		$string_helper         = new String_Helper();
		$post_type_helper      = new Post_Type_Helper( $this->options_helper );
		$this->taxonomy_helper = new Taxonomy_Helper( $this->options_helper, $string_helper );
		$this->post_helper     = new Post_Helper( $string_helper, $post_type_helper );

		$this->instance = new Indexable_Term_Builder( $this->taxonomy_helper, $this->versions, $this->post_helper );

		$this->instance->set_social_image_helpers( $this->image_helper, $this->open_graph_image_helper, $this->twitter_image_helper );
	}

	/**
	 * Tests the build method's happy path.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$post_data = [
			'post_title'  => 'Test post',
			'post_date'   => '1978-09-13 08:50:00',
			'post_status' => 'publish',
		];

		$post_id = self::factory()->post->create( $post_data );
		$term_id = self::factory()->category->create();
		self::factory()->term->add_post_terms( $post_id, $term_id, 'category', true );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$this->image_helper
			->shouldReceive( 'get_term_content_image' )
			->with( $term_id )
			->once()
			->andReturn( 'lel' );

		$result = $this->instance->build( $term_id, $indexable );

		$this->assertInstanceOf( Indexable::class, $result );
		$this->assertEquals( '1978-09-13 08:50:00', $result->object_published_at );
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
}
