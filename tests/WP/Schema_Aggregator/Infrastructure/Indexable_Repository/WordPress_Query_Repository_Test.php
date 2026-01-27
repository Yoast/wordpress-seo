<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\WP\Schema_Aggregator\Infrastructure\Indexable_Repository;

use Generator;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository as Pure_Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\WordPress_Query_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for WordPress_Query_Repository.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\WordPress_Query_Repository
 */
final class WordPress_Query_Repository_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var WordPress_Query_Repository
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

		$indexable_builder         = \YoastSEO()->classes->get( Indexable_Builder::class );
		$pure_indexable_repository = \YoastSEO()->classes->get( Pure_Indexable_Repository::class );

		$this->instance = new WordPress_Query_Repository( $indexable_builder, $pure_indexable_repository );
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
	 * Tests the get method.
	 *
	 * @dataProvider get_data
	 * @covers ::get
	 *
	 * @param int                   $page                The page number.
	 * @param int                   $page_size           The number of items per page.
	 * @param string                $post_type           The post type to filter by.
	 * @param int                   $min_expected        The minimum expected number of results.
	 * @param array<string, string> $expected_properties Expected properties to check in results.
	 * @param bool                  $should_have_results Whether results are expected.
	 *
	 * @return void
	 */
	public function test_get( int $page, int $page_size, string $post_type, int $min_expected, array $expected_properties, bool $should_have_results ): void {
		$result = $this->instance->get( $page, $page_size, $post_type );

		$this->assertIsArray( $result, 'Result should be an array' );
		$this->assertGreaterThanOrEqual( $min_expected, \count( $result ), "Should return at least {$min_expected} indexables for post type {$post_type}" );

		if ( $should_have_results ) {
			$this->assertNotEmpty( $result, 'Should have results when expected' );

			foreach ( $result as $indexable ) {
				$this->assertInstanceOf( Indexable::class, $indexable, 'Each result should be an Indexable instance' );
				$this->assertTrue( $indexable->is_public === true || $indexable->is_public === null, 'Should be public or null' );

				foreach ( $expected_properties as $property => $value ) {
					$this->assertEquals( $value, $indexable->$property, "Property {$property} should match expected value" );
				}
			}
		}
		else {
			$this->assertEmpty( $result, 'Should have no results when not expected' );
		}
	}

	/**
	 * Tests the get method with pagination.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_pagination_returns_different_results(): void {
		$page_1 = $this->instance->get( 1, 1, 'post' );
		$page_2 = $this->instance->get( 2, 1, 'post' );

		$this->assertIsArray( $page_1 );
		$this->assertIsArray( $page_2 );
		$this->assertCount( 1, $page_1, 'First page should return exactly 1 result with page size 1' );
		$this->assertCount( 1, $page_2, 'Second page should return exactly 1 result with page size 1' );

		$this->assertNotEquals(
			( $page_1[0]->object_id ?? null ),
			( $page_2[0]->object_id ?? null ),
			'Different pages should return different posts'
		);
	}

	/**
	 * Data provider for the get test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_data(): Generator {
		yield 'First page posts' => [
			'page'                => 1,
			'page_size'           => 10,
			'post_type'           => 'post',
			'min_expected'        => 3,
			'expected_properties' => [ 'object_type' => 'post' ],
			'should_have_results' => true,
		];

		yield 'First page pages' => [
			'page'                => 1,
			'page_size'           => 10,
			'post_type'           => 'page',
			'min_expected'        => 2,
			'expected_properties' => [],
			'should_have_results' => true,
		];

		yield 'Small page size' => [
			'page'                => 1,
			'page_size'           => 1,
			'post_type'           => 'post',
			'min_expected'        => 1,
			'expected_properties' => [ 'object_type' => 'post' ],
			'should_have_results' => true,
		];

		yield 'High page number - should return 0' => [
			'page'                => 10,
			'page_size'           => 5,
			'post_type'           => 'post',
			'min_expected'        => 0,
			'expected_properties' => [],
			'should_have_results' => false,
		];

		yield 'Non-existent post type' => [
			'page'                => 1,
			'page_size'           => 10,
			'post_type'           => 'non_existent_type',
			'min_expected'        => 0,
			'expected_properties' => [],
			'should_have_results' => false,
		];
	}

	/**
	 * Creates test content using WordPress factories.
	 *
	 * @return void
	 */
	private function create_test_content(): void {
		$post_ids            = self::factory()->post->create_many(
			3,
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
				'post_type'   => 'post',
			]
		);
		$this->created_posts = \array_merge( $this->created_posts, $post_ids );

		$page_ids            = self::factory()->post->create_many(
			2,
			[
				'post_title'  => 'Test Page',
				'post_status' => 'publish',
				'post_type'   => 'page',
			]
		);
		$this->created_posts = \array_merge( $this->created_posts, $page_ids );
	}
}
