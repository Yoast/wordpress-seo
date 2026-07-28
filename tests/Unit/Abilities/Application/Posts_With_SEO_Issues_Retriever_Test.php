<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Posts_With_SEO_Issues_Retriever;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Ok_Readability_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Ok_SEO_Score_Group;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Features_List;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Editors\Framework\Readability_Analysis;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Posts_With_SEO_Issues_Retriever class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Posts_With_SEO_Issues_Retriever
 */
final class Posts_With_SEO_Issues_Retriever_Test extends TestCase {

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The enabled analysis features repository mock.
	 *
	 * @var Mockery\MockInterface|Enabled_Analysis_Features_Repository
	 */
	private $enabled_analysis_features_repository;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The post type helper mock.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The instance under test.
	 *
	 * @var Posts_With_SEO_Issues_Retriever
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );

		Monkey\Functions\stubs(
			[
				'__' => static function ( $text ) {
					return $text;
				},
			],
		);

		$this->indexable_repository                 = Mockery::mock( Indexable_Repository::class );
		$this->enabled_analysis_features_repository = Mockery::mock( Enabled_Analysis_Features_Repository::class );
		$this->options_helper                       = Mockery::mock( Options_Helper::class );
		$this->post_type_helper                     = Mockery::mock( Post_Type_Helper::class );

		// The score group value objects are dependency-free domain objects; using the
		// real ones pins the ability to the same thresholds the task list buckets with.
		$this->instance = new Posts_With_SEO_Issues_Retriever(
			$this->indexable_repository,
			$this->enabled_analysis_features_repository,
			$this->options_helper,
			$this->post_type_helper,
			new Ok_SEO_Score_Group(),
			new Ok_Readability_Score_Group(),
		);
	}

	/**
	 * Tests that the low SEO score issue queries with the OK group's maximum score and maps the rows.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::find_posts_with_issue
	 * @covers ::build_result_for_row
	 *
	 * @return void
	 */
	public function test_get_posts_with_low_seo_scores() {
		$this->mock_feature_enabled( Keyphrase_Analysis::NAME, true );
		$this->mock_public_post_types();

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( 'post', 10, null, 0, 70 )
			->andReturn(
				[
					[
						'object_id'        => '5',
						'breadcrumb_title' => 'Trail Running Guide',
					],
					[
						'object_id'        => '7',
						'breadcrumb_title' => 'Hiking Boots Review',
					],
				],
			);

		$result = $this->instance->get_posts_with_seo_issues( [ 'issue_type' => 'low-seo-score' ] );

		$this->assertSame(
			[
				[
					'post_id' => 5,
					'title'   => 'Trail Running Guide',
				],
				[
					'post_id' => 7,
					'title'   => 'Hiking Boots Review',
				],
			],
			$result,
		);
	}

	/**
	 * Tests that the low readability score issue queries with the OK group's maximum score.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::find_posts_with_issue
	 *
	 * @return void
	 */
	public function test_get_posts_with_low_readability_scores() {
		$this->mock_feature_enabled( Readability_Analysis::NAME, true );
		$this->mock_public_post_types();

		$this->indexable_repository
			->expects( 'get_recent_posts_with_readability_scores_for_post_type' )
			->once()
			->with( 'post', 10, null, 0, 70 )
			->andReturn(
				[
					[
						'object_id'        => '11',
						'breadcrumb_title' => 'Some Post',
					],
				],
			);

		$result = $this->instance->get_posts_with_seo_issues( [ 'issue_type' => 'low-readability-score' ] );

		$this->assertSame(
			[
				[
					'post_id' => 11,
					'title'   => 'Some Post',
				],
			],
			$result,
		);
	}

	/**
	 * Tests that the default meta description issue queries posts without a description.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::find_posts_with_issue
	 * @covers ::has_templated_meta_description
	 *
	 * @return void
	 */
	public function test_get_posts_with_default_meta_descriptions() {
		$this->mock_public_post_types();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'metadesc-post' )
			->andReturn( '' );

		$this->indexable_repository
			->expects( 'get_recent_posts_for_post_type' )
			->once()
			->with( 'post', 10, null, 0, true )
			->andReturn(
				[
					[
						'object_id'        => '3',
						'breadcrumb_title' => 'Post Without Description',
					],
				],
			);

		$result = $this->instance->get_posts_with_seo_issues( [ 'issue_type' => 'default-meta-description' ] );

		$this->assertSame(
			[
				[
					'post_id' => 3,
					'title'   => 'Post Without Description',
				],
			],
			$result,
		);
	}

	/**
	 * Tests that a meta description template with a replacevar yields an empty result without querying.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::find_posts_with_issue
	 * @covers ::has_templated_meta_description
	 *
	 * @return void
	 */
	public function test_default_meta_descriptions_gated_by_templated_option() {
		$this->mock_public_post_types();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'metadesc-post' )
			->andReturn( '%%excerpt%%' );

		$this->indexable_repository
			->expects( 'get_recent_posts_for_post_type' )
			->never();

		$this->assertSame( [], $this->instance->get_posts_with_seo_issues( [ 'issue_type' => 'default-meta-description' ] ) );
	}

	/**
	 * Tests that a hardcoded meta description template without replacevars does not gate the query.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::find_posts_with_issue
	 * @covers ::has_templated_meta_description
	 *
	 * @return void
	 */
	public function test_default_meta_descriptions_with_hardcoded_template() {
		$this->mock_public_post_types();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'metadesc-post' )
			->andReturn( 'The same description on every page.' );

		$this->indexable_repository
			->expects( 'get_recent_posts_for_post_type' )
			->once()
			->with( 'post', 10, null, 0, true )
			->andReturn( [] );

		$this->assertSame( [], $this->instance->get_posts_with_seo_issues( [ 'issue_type' => 'default-meta-description' ] ) );
	}

	/**
	 * Tests that the page and number_of_posts inputs translate into a limit and offset.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::get_number_of_posts
	 * @covers ::get_page
	 *
	 * @return void
	 */
	public function test_pagination_translates_to_limit_and_offset() {
		$this->mock_feature_enabled( Keyphrase_Analysis::NAME, true );
		$this->mock_public_post_types();

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( 'post', 20, null, 40, 70 )
			->andReturn( [] );

		$result = $this->instance->get_posts_with_seo_issues(
			[
				'issue_type'      => 'low-seo-score',
				'number_of_posts' => 20,
				'page'            => 3,
			],
		);

		// An empty later page is valid pagination past the last result, not an error.
		$this->assertSame( [], $result );
	}

	/**
	 * Tests that the number_of_posts and page inputs are clamped to their allowed ranges.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::get_number_of_posts
	 * @covers ::get_page
	 *
	 * @return void
	 */
	public function test_pagination_clamps_out_of_range_input() {
		$this->mock_feature_enabled( Keyphrase_Analysis::NAME, true );
		$this->mock_public_post_types();

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( 'post', 100, null, 0, 70 )
			->andReturn( [] );

		$this->instance->get_posts_with_seo_issues(
			[
				'issue_type'      => 'low-seo-score',
				'number_of_posts' => 999,
				'page'            => 0,
			],
		);
	}

	/**
	 * Tests that the requested post type is passed through to the query.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::get_available_post_types
	 *
	 * @return void
	 */
	public function test_custom_post_type_is_queried() {
		$this->mock_feature_enabled( Keyphrase_Analysis::NAME, true );
		$this->mock_public_post_types( [ 'post', 'page' ] );

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( 'page', 10, null, 0, 70 )
			->andReturn( [] );

		$this->instance->get_posts_with_seo_issues(
			[
				'issue_type' => 'low-seo-score',
				'post_type'  => 'page',
			],
		);
	}

	/**
	 * Tests that a post with an empty title falls back to the (no title) placeholder.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::build_result_for_row
	 *
	 * @return void
	 */
	public function test_fallback_title() {
		$this->mock_feature_enabled( Keyphrase_Analysis::NAME, true );
		$this->mock_public_post_types();

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( 'post', 10, null, 0, 70 )
			->andReturn(
				[
					[
						'object_id'        => '9',
						'breadcrumb_title' => '',
					],
				],
			);

		$result = $this->instance->get_posts_with_seo_issues( [ 'issue_type' => 'low-seo-score' ] );

		$this->assertSame( '(no title)', $result[0]['title'] );
	}

	/**
	 * Tests that a missing or unknown issue type returns an error.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::is_known_issue_type
	 *
	 * @dataProvider provide_invalid_issue_types
	 *
	 * @param array<string, string> $input The ability input.
	 *
	 * @return void
	 */
	public function test_invalid_issue_type_returns_error( array $input ) {
		$this->assertInstanceOf( WP_Error::class, $this->instance->get_posts_with_seo_issues( $input ) );
	}

	/**
	 * Data provider for test_invalid_issue_type_returns_error.
	 *
	 * @return array<string, array<array<string, string>>> The invalid inputs.
	 */
	public static function provide_invalid_issue_types(): array {
		return [
			'missing issue_type' => [ [] ],
			'unknown issue_type' => [ [ 'issue_type' => 'no-social-image' ] ],
		];
	}

	/**
	 * Tests that an issue type whose analysis feature is disabled returns an error without querying.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::validate_issue_type_availability
	 *
	 * @return void
	 */
	public function test_disabled_analysis_feature_returns_error() {
		$this->mock_feature_enabled( Readability_Analysis::NAME, false );

		$this->indexable_repository
			->expects( 'get_recent_posts_with_readability_scores_for_post_type' )
			->never();

		$this->assertInstanceOf(
			WP_Error::class,
			$this->instance->get_posts_with_seo_issues( [ 'issue_type' => 'low-readability-score' ] ),
		);
	}

	/**
	 * Tests that an unsupported or unregistered post type returns an error.
	 *
	 * @covers ::get_posts_with_seo_issues
	 * @covers ::get_available_post_types
	 *
	 * @dataProvider provide_invalid_post_types
	 *
	 * @param string        $post_type         The requested post type.
	 * @param array<string> $public_post_types The public post types registered on the site.
	 *
	 * @return void
	 */
	public function test_invalid_post_type_returns_error( string $post_type, array $public_post_types ) {
		$this->mock_feature_enabled( Keyphrase_Analysis::NAME, true );
		$this->mock_public_post_types( $public_post_types );

		$this->assertInstanceOf(
			WP_Error::class,
			$this->instance->get_posts_with_seo_issues(
				[
					'issue_type' => 'low-seo-score',
					'post_type'  => $post_type,
				],
			),
		);
	}

	/**
	 * Data provider for test_invalid_post_type_returns_error.
	 *
	 * @return array<string, array<string|array<string>>> The invalid post type scenarios.
	 */
	public static function provide_invalid_post_types(): array {
		return [
			'unsupported post type'                  => [ 'attachment', [ 'post', 'page', 'attachment' ] ],
			'supported but not registered as public' => [ 'product', [ 'post', 'page' ] ],
		];
	}

	/**
	 * Tests that a failed query returns an error instead of an empty result.
	 *
	 * @covers ::get_posts_with_seo_issues
	 *
	 * @return void
	 */
	public function test_failed_query_returns_error() {
		$this->mock_feature_enabled( Keyphrase_Analysis::NAME, true );
		$this->mock_public_post_types();

		$this->indexable_repository
			->expects( 'get_recent_posts_with_keywords_for_post_type' )
			->once()
			->with( 'post', 10, null, 0, 70 )
			->andReturn( false );

		$this->assertInstanceOf(
			WP_Error::class,
			$this->instance->get_posts_with_seo_issues( [ 'issue_type' => 'low-seo-score' ] ),
		);
	}

	/**
	 * Mocks the enabled analysis features repository for a single feature lookup.
	 *
	 * @param string $feature The feature name.
	 * @param bool   $enabled Whether the feature is enabled.
	 *
	 * @return void
	 */
	private function mock_feature_enabled( string $feature, bool $enabled ): void {
		$features_list = Mockery::mock( Analysis_Features_List::class );

		$features_list
			->expects( 'to_array' )
			->once()
			->andReturn( [ $feature => $enabled ] );

		$this->enabled_analysis_features_repository
			->expects( 'get_features_by_keys' )
			->once()
			->with( [ $feature ] )
			->andReturn( $features_list );
	}

	/**
	 * Mocks the public post types registered on the site.
	 *
	 * @param array<string> $post_types The public post types.
	 *
	 * @return void
	 */
	private function mock_public_post_types( array $post_types = [ 'post', 'page' ] ): void {
		$this->post_type_helper
			->expects( 'get_public_post_types' )
			->once()
			->andReturn( $post_types );
	}
}
