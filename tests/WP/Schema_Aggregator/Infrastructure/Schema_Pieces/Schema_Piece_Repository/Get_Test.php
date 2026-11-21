<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository;

use Generator;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Third_Party\EDD_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Repositories\Indexable_Repository as Pure_Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Person_Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Factory;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\WordPress_Query_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Meta_Tags_Context_Memoizer_Adapter;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Edd_Schema_Piece_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Woo_Schema_Piece_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\WordPress_Global_State_Adapter;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Schema_Piece_Repository.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository::get
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository::collect_external_schema
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository::get_all_schema_types
 */
final class Get_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Schema_Piece_Repository
	 */
	private $instance;

	/**
	 * Created WordPress post IDs for cleanup.
	 *
	 * @var array<int>
	 */
	private $created_posts = [];

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$meta_tags_context_memoizer = \YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$indexable_helper           = \YoastSEO()->classes->get( Indexable_Helper::class );
		$post_type_helper           = \YoastSEO()->classes->get( Post_Type_Helper::class );
		$pure_indexable_repository  = \YoastSEO()->classes->get( Pure_Indexable_Repository::class );

		// Ensure the post watcher is active so indexables are created automatically.
		\YoastSEO()->classes->get( Indexable_Post_Watcher::class );

		$adapter = new Meta_Tags_Context_Memoizer_Adapter();
		$config  = new Aggregator_Config( new WooCommerce_Conditional(), $post_type_helper );

		$article_schema_enhancer = new Article_Schema_Enhancer();
		$article_config          = new Article_Config();
		$article_schema_enhancer->set_article_config( $article_config );

		$person_schema_enhancer = new Person_Schema_Enhancer();
		$person_config          = new Person_Config();
		$person_schema_enhancer->set_person_config( $person_config );

		$enhancement_factory            = new Schema_Enhancement_Factory( $article_schema_enhancer, $person_schema_enhancer );
		$indexable_repository           = new Indexable_Repository( $pure_indexable_repository );
		$wordpress_query_repository     = new WordPress_Query_Repository( \YoastSEO()->classes->get( Indexable_Builder::class ), $pure_indexable_repository );
		$indexable_repository_factory   = new Indexable_Repository_Factory( $indexable_repository, $wordpress_query_repository );
		$wordpress_global_state_adapter = new WordPress_Global_State_Adapter( $meta_tags_context_memoizer );
		$edd_schema_piece_repository    = new Edd_Schema_Piece_Repository( new EDD_Conditional(), \YoastSEO()->classes->get( Meta_Surface::class ) );
		$woo_schema_piece_repository    = new Woo_Schema_Piece_Repository( new WooCommerce_Conditional() );

		$this->instance = new Schema_Piece_Repository(
			$meta_tags_context_memoizer,
			$indexable_helper,
			$adapter,
			$config,
			$enhancement_factory,
			$indexable_repository_factory,
			$wordpress_global_state_adapter,
			$edd_schema_piece_repository,
			$woo_schema_piece_repository,
		);

		// Delete all indexables before each test to ensure a clean slate.
		global $wpdb;
		$table = Model::get_table_name( 'Indexable' );
		$wpdb->query( "DELETE FROM {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.

		$this->create_test_content();
	}

	/**
	 * Tears down the test class.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		foreach ( $this->created_posts as $post_id ) {
			\wp_delete_post( $post_id, true );
		}

		parent::tear_down();
	}

	/**
	 * Tests the get method returns schema pieces for existing content.
	 *
	 * @dataProvider get_with_results_data
	 *
	 * @param int    $page                The page number.
	 * @param int    $page_size           The number of items per page.
	 * @param string $post_type           The post type to filter by.
	 * @param int    $min_expected_pieces The minimum expected number of schema pieces.
	 * @param bool   $enabled_indexables  Whether indexables are enabled.
	 *
	 * @return void
	 */
	public function test_get_with_results(
		int $page,
		int $page_size,
		string $post_type,
		int $min_expected_pieces,
		bool $enabled_indexables
	): void {
		if ( ! $enabled_indexables ) {
			\add_filter( 'Yoast\WP\SEO\should_index_indexables', '__return_false' );
		}

		$result = $this->instance->get( $page, $page_size, $post_type );

		$this->assertInstanceOf( Schema_Piece_Collection::class, $result );

		$pieces = $result->to_array();

		$this->assertNotEmpty( $pieces, 'Expected schema pieces in the collection.' );
		$this->assertGreaterThanOrEqual(
			$min_expected_pieces,
			\count( $pieces ),
			"Should return at least {$min_expected_pieces} schema pieces.",
		);

		foreach ( $pieces as $piece ) {
			$this->assertInstanceOf( Schema_Piece::class, $piece, 'Each item should be a Schema_Piece instance.' );
			$this->assertNotEmpty( $piece->get_type(), 'Schema piece should have a type.' );
			$this->assertNotEmpty( $piece->get_data(), 'Schema piece should have data.' );
		}
	}

	/**
	 * Tests the get method returns an empty collection when no matching content exists.
	 *
	 * @dataProvider get_empty_response_data
	 *
	 * @param int    $page               The page number.
	 * @param int    $page_size          The number of items per page.
	 * @param string $post_type          The post type to filter by.
	 * @param bool   $enabled_indexables Whether indexables are enabled.
	 *
	 * @return void
	 */
	public function test_get_empty_response(
		int $page,
		int $page_size,
		string $post_type,
		bool $enabled_indexables
	): void {
		if ( ! $enabled_indexables ) {
			\add_filter( 'Yoast\WP\SEO\should_index_indexables', '__return_false' );
		}

		$result = $this->instance->get( $page, $page_size, $post_type );

		$this->assertInstanceOf( Schema_Piece_Collection::class, $result );
		$this->assertEmpty( $result->to_array(), 'Expected an empty collection.' );
	}

	/**
	 * Tests that different pages return different schema pieces.
	 *
	 * @dataProvider enabled_indexables_data
	 *
	 * @param bool $enabled_indexables Whether indexables are enabled.
	 *
	 * @return void
	 */
	public function test_get_pagination_returns_different_schema_pieces( bool $enabled_indexables ): void {
		if ( ! $enabled_indexables ) {
			\add_filter( 'Yoast\WP\SEO\should_index_indexables', '__return_false' );
		}

		$page_1_pieces = $this->instance->get( 1, 1, 'post' )->to_array();
		$page_2_pieces = $this->instance->get( 2, 1, 'post' )->to_array();

		$this->assertNotEmpty( $page_1_pieces, 'First page should return schema pieces.' );
		$this->assertNotEmpty( $page_2_pieces, 'Second page should return schema pieces.' );

		$page_1_data = \array_map(
			static function ( Schema_Piece $piece ) {
				return $piece->get_data();
			},
			$page_1_pieces,
		);
		$page_2_data = \array_map(
			static function ( Schema_Piece $piece ) {
				return $piece->get_data();
			},
			$page_2_pieces,
		);

		$this->assertNotEquals( $page_1_data, $page_2_data, 'Different pages should return different schema pieces.' );
	}

	/**
	 * Tests that posts marked as noindex are excluded from schema pieces.
	 *
	 * @dataProvider enabled_indexables_data
	 *
	 * @param bool $enabled_indexables Whether indexables are enabled.
	 *
	 * @return void
	 */
	public function test_get_excludes_noindex_posts( bool $enabled_indexables ): void {
		if ( ! $enabled_indexables ) {
			\add_filter( 'Yoast\WP\SEO\should_index_indexables', '__return_false' );
		}

		// Create a noindex post.
		$noindex_post_id       = self::factory()->post->create(
			[
				'post_title'   => 'Noindex Post',
				'post_status'  => 'publish',
				'post_type'    => 'post',
				'post_content' => 'This post should be excluded from schema aggregation.',
			],
		);
		$this->created_posts[] = $noindex_post_id;

		// Mark the post as noindex.
		\update_post_meta( $noindex_post_id, '_yoast_wpseo_meta-robots-noindex', '1' );

		// Rebuild the indexable so is_robots_noindex is set.
		$indexable_builder = \YoastSEO()->classes->get( Indexable_Builder::class );
		$indexable_repo    = \YoastSEO()->classes->get( Pure_Indexable_Repository::class );
		$indexable         = $indexable_repo->find_by_id_and_type( $noindex_post_id, 'post' );
		$indexable_builder->build( $indexable );

		// Fetch all posts with a large page size to include all posts.
		$result = $this->instance->get( 1, 100, 'post' );
		$pieces = $result->to_array();

		// Verify the noindex post's schema pieces are not in the result.
		$noindex_post_url = \get_permalink( $noindex_post_id );
		foreach ( $pieces as $piece ) {
			$data = $piece->get_data();
			if ( isset( $data['@id'] ) ) {
				$this->assertStringNotContainsString(
					$noindex_post_url,
					$data['@id'],
					'Schema pieces for noindex posts should be excluded.',
				);
			}
		}

		// Verify that regular posts still have schema pieces.
		$this->assertNotEmpty( $pieces, 'Regular posts should still return schema pieces.' );
	}

	/**
	 * Data provider for test_get_with_results.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_with_results_data(): Generator {
		yield 'First page of posts' => [
			'page'                => 1,
			'page_size'           => 10,
			'post_type'           => 'post',
			'min_expected_pieces' => 3,
			'enabled_indexables'  => true,
		];

		yield 'First page of posts with disabled indexables' => [
			'page'                => 1,
			'page_size'           => 10,
			'post_type'           => 'post',
			'min_expected_pieces' => 3,
			'enabled_indexables'  => false,
		];

		yield 'First page of pages' => [
			'page'                => 1,
			'page_size'           => 10,
			'post_type'           => 'page',
			'min_expected_pieces' => 2,
			'enabled_indexables'  => true,
		];

		yield 'First page of pages with disabled indexables' => [
			'page'                => 1,
			'page_size'           => 10,
			'post_type'           => 'page',
			'min_expected_pieces' => 2,
			'enabled_indexables'  => false,
		];

		yield 'Small page size limits indexables processed' => [
			'page'                => 1,
			'page_size'           => 1,
			'post_type'           => 'post',
			'min_expected_pieces' => 1,
			'enabled_indexables'  => true,
		];

		yield 'Small page size limits indexables processed with disabled indexables' => [
			'page'                => 1,
			'page_size'           => 1,
			'post_type'           => 'post',
			'min_expected_pieces' => 1,
			'enabled_indexables'  => false,
		];
	}

	/**
	 * Data provider for test_get_empty_response.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_empty_response_data(): Generator {
		yield 'High page number returns empty collection' => [
			'page'               => 100,
			'page_size'          => 10,
			'post_type'          => 'post',
			'enabled_indexables' => true,
		];

		yield 'High page number returns empty collection with disabled indexables' => [
			'page'               => 100,
			'page_size'          => 10,
			'post_type'          => 'post',
			'enabled_indexables' => false,
		];

		yield 'Non-existent post type returns empty collection' => [
			'page'               => 1,
			'page_size'          => 10,
			'post_type'          => 'non_existent_type',
			'enabled_indexables' => true,
		];

		yield 'Non-existent post type returns empty collection with disabled indexables' => [
			'page'               => 1,
			'page_size'          => 10,
			'post_type'          => 'non_existent_type',
			'enabled_indexables' => false,
		];
	}

	/**
	 * Data provider for tests that only need the indexables enabled/disabled flag.
	 *
	 * @return Generator Test data to use.
	 */
	public static function enabled_indexables_data(): Generator {
		yield 'Indexables enabled' => [
			'enabled_indexables' => true,
		];

		yield 'Indexables disabled' => [
			'enabled_indexables' => false,
		];
	}

	/**
	 * Creates test content.
	 *
	 * @return void
	 */
	private function create_test_content(): void {
		$post_ids            = self::factory()->post->create_many(
			3,
			[
				'post_title'   => 'Test Post',
				'post_status'  => 'publish',
				'post_type'    => 'post',
				'post_content' => 'Test post content for schema aggregation.',
			],
		);
		$this->created_posts = \array_merge( $this->created_posts, $post_ids );

		$page_ids            = self::factory()->post->create_many(
			2,
			[
				'post_title'   => 'Test Page',
				'post_status'  => 'publish',
				'post_type'    => 'page',
				'post_content' => 'Test page content for schema aggregation.',
			],
		);
		$this->created_posts = \array_merge( $this->created_posts, $page_ids );
	}
}
