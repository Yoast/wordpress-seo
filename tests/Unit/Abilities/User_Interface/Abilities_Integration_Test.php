<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Application\Posts_With_SEO_Issues_Retriever;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Features_List;
use Yoast\WP\SEO\Editors\Framework\Inclusive_Language_Analysis;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Editors\Framework\Readability_Analysis;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Abilities_Integration class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration
 */
final class Abilities_Integration_Test extends TestCase {

	/**
	 * The score retriever mock.
	 *
	 * @var Mockery\MockInterface|Score_Retriever
	 */
	private $score_retriever;

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The enabled analysis features repository mock.
	 *
	 * @var Mockery\MockInterface|Enabled_Analysis_Features_Repository
	 */
	private $enabled_analysis_features_repository;

	/**
	 * The post SEO data collector mock.
	 *
	 * @var Mockery\MockInterface|Post_SEO_Data_Collector
	 */
	private $post_seo_data_collector;

	/**
	 * The post SEO data updater mock.
	 *
	 * @var Mockery\MockInterface|Post_SEO_Data_Updater
	 */
	private $post_seo_data_updater;

	/**
	 * The posts with SEO issues retriever mock.
	 *
	 * @var Mockery\MockInterface|Posts_With_SEO_Issues_Retriever
	 */
	private $posts_with_seo_issues_retriever;

	/**
	 * The instance under test.
	 *
	 * @var Abilities_Integration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		// The article-type enum is built from the documented filter; return the default unfiltered.
		Monkey\Functions\when( 'apply_filters' )->returnArg( 2 );

		$this->score_retriever                      = Mockery::mock( Score_Retriever::class );
		$this->capability_helper                    = Mockery::mock( Capability_Helper::class );
		$this->enabled_analysis_features_repository = Mockery::mock( Enabled_Analysis_Features_Repository::class );
		$this->post_seo_data_collector              = Mockery::mock( Post_SEO_Data_Collector::class );
		$this->post_seo_data_updater                = Mockery::mock( Post_SEO_Data_Updater::class );
		$this->posts_with_seo_issues_retriever      = Mockery::mock( Posts_With_SEO_Issues_Retriever::class );

		$this->instance = new Abilities_Integration(
			$this->score_retriever,
			$this->capability_helper,
			$this->enabled_analysis_features_repository,
			$this->post_seo_data_collector,
			$this->post_seo_data_updater,
			$this->posts_with_seo_issues_retriever,
		);
	}

	/**
	 * Tests that get_conditionals returns the Abilities API and indexables conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame(
			[
				Abilities_API_Conditional::class,
				Should_Index_Indexables_Conditional::class,
			],
			Abilities_Integration::get_conditionals(),
		);
	}

	/**
	 * Tests that register_hooks registers the correct actions.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'wp_abilities_api_init' )
			->once()
			->with( [ $this->instance, 'register_abilities' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that can_manage_seo checks the manage options capability and returns its result.
	 *
	 * @covers ::can_manage_seo
	 *
	 * @dataProvider provide_can_manage_seo
	 *
	 * @param bool $allowed Whether the capability is granted.
	 *
	 * @return void
	 */
	public function test_can_manage_seo( bool $allowed ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( $allowed );

		$this->assertSame( $allowed, $this->instance->can_manage_seo() );
	}

	/**
	 * Data provider for test_can_manage_seo.
	 *
	 * @return array<string, array<bool>> The capability outcomes.
	 */
	public static function provide_can_manage_seo(): array {
		return [
			'capability granted' => [ true ],
			'capability denied'  => [ false ],
		];
	}

	/**
	 * Tests that register_abilities registers all score abilities plus the metadata abilities.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_inclusive_language_enabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME          => true,
				Readability_Analysis::NAME        => true,
				Inclusive_Language_Analysis::NAME => true,
			],
		);

		$this->expect_score_ability( 'yoast-seo/get-seo-scores' );
		$this->expect_score_ability( 'yoast-seo/get-readability-scores' );
		$this->expect_score_ability( 'yoast-seo/get-inclusive-language-scores' );
		$this->expect_post_seo_data_abilities();
		$this->expect_posts_with_seo_issues_ability();

		$this->instance->register_abilities();
	}

	/**
	 * Tests that the score abilities are not registered when their analysis features are disabled,
	 * but the metadata abilities always are.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_all_analysis_disabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME          => false,
				Readability_Analysis::NAME        => false,
				Inclusive_Language_Analysis::NAME => false,
			],
		);

		$this->expect_post_seo_data_abilities();
		$this->expect_posts_with_seo_issues_ability();

		$this->instance->register_abilities();
	}

	/**
	 * Tests that only the keyphrase score ability registers alongside the metadata abilities.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_only_keyphrase_enabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME          => true,
				Readability_Analysis::NAME        => false,
				Inclusive_Language_Analysis::NAME => false,
			],
		);

		$this->expect_score_ability( 'yoast-seo/get-seo-scores' );
		$this->expect_post_seo_data_abilities();
		$this->expect_posts_with_seo_issues_ability();

		$this->instance->register_abilities();
	}

	/**
	 * Tests that the get and update post SEO data abilities register with the expected definition.
	 *
	 * @covers ::register_abilities
	 * @covers ::register_get_post_seo_data_ability
	 * @covers ::register_update_post_seo_data_ability
	 *
	 * @return void
	 */
	public function test_register_post_seo_data_abilities_definition() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME          => false,
				Readability_Analysis::NAME        => false,
				Inclusive_Language_Analysis::NAME => false,
			],
		);

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-post-seo-data',
				[
					'label'               => 'Get Post SEO Data',
					'category'            => 'yoast-seo',
					'description'         => 'Get the SEO data for a post. Identify the post by post_id, by permalink (URL), or by title keywords; the title may be a comma-separated list and returns the SEO data for every post matching any of the values, paginated most recently modified first (use the page parameter to reach older matches). At least one identifier is required.',
					'input_schema'        => $this->get_expected_identifier_input_schema(),
					'output_schema'       => [
						'type'  => 'array',
						'items' => $this->get_expected_output_schema(),
					],
					'permission_callback' => [ $this->instance, 'can_manage_seo' ],
					'execute_callback'    => [ $this->post_seo_data_collector, 'get_post_seo_data' ],
					'meta'                => $this->get_read_meta(),
				],
			);

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/update-post-seo-data',
				[
					'label'               => 'Update Post SEO Data',
					'category'            => 'yoast-seo',
					'description'         => 'Update the SEO data for a single post. Identify the post by post_id or by permalink (URL). Only the fields you provide are changed; a provided empty value clears that field.',
					'input_schema'        => $this->get_expected_update_input_schema(),
					'output_schema'       => $this->get_expected_output_schema(),
					'permission_callback' => [ $this->instance, 'can_manage_seo' ],
					'execute_callback'    => [ $this->post_seo_data_updater, 'update_post_seo_data' ],
					'meta'                => $this->get_write_meta(),
				],
			);

		$this->expect_posts_with_seo_issues_ability();

		$this->instance->register_abilities();
	}

	/**
	 * Tests that the posts with SEO issues ability registers with the expected definition,
	 * offering all issue types when every analysis feature is enabled.
	 *
	 * @covers ::register_abilities
	 * @covers ::register_get_posts_with_seo_issues_ability
	 * @covers ::get_posts_with_seo_issues_input_schema
	 * @covers ::get_post_with_issue_output_schema
	 *
	 * @return void
	 */
	public function test_register_posts_with_seo_issues_ability_definition() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME          => true,
				Readability_Analysis::NAME        => true,
				Inclusive_Language_Analysis::NAME => true,
			],
		);

		$this->expect_score_ability( 'yoast-seo/get-seo-scores' );
		$this->expect_score_ability( 'yoast-seo/get-readability-scores' );
		$this->expect_score_ability( 'yoast-seo/get-inclusive-language-scores' );
		$this->expect_post_seo_data_abilities();

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-posts-with-seo-issues',
				[
					'label'               => 'Get Posts With SEO Issues',
					'category'            => 'yoast-seo',
					'description'         => 'Get published posts that have a known SEO issue of the given type: a low (not good) SEO score, a low (not good) readability score, or no custom meta description. Results are ordered most recently modified first and paginated; an empty result means there are no posts with the issue or no further pages.',
					'input_schema'        => $this->get_expected_posts_with_seo_issues_input_schema(
						[ 'low-seo-score', 'low-readability-score', 'default-meta-description' ],
					),
					'output_schema'       => [
						'type'  => 'array',
						'items' => [
							'type'       => 'object',
							'properties' => [
								'post_id' => [
									'type'        => 'integer',
									'description' => 'The ID of the post.',
								],
								'title'   => [
									'type'        => 'string',
									'description' => 'The post title.',
								],
							],
						],
					],
					'permission_callback' => [ $this->instance, 'can_manage_seo' ],
					'execute_callback'    => [ $this->posts_with_seo_issues_retriever, 'get_posts_with_seo_issues' ],
					'meta'                => $this->get_read_meta(),
				],
			);

		$this->instance->register_abilities();
	}

	/**
	 * Tests that the issue type enum only offers the meta description issue
	 * when the score-based analysis features are disabled.
	 *
	 * @covers ::register_abilities
	 * @covers ::register_get_posts_with_seo_issues_ability
	 * @covers ::get_posts_with_seo_issues_input_schema
	 *
	 * @return void
	 */
	public function test_register_posts_with_seo_issues_ability_with_analyses_disabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME          => false,
				Readability_Analysis::NAME        => false,
				Inclusive_Language_Analysis::NAME => false,
			],
		);

		$this->expect_post_seo_data_abilities();

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-posts-with-seo-issues',
				Mockery::on(
					static function ( $args ) {
						return $args['input_schema']['properties']['issue_type']['enum'] === [ 'default-meta-description' ];
					},
				),
			);

		$this->instance->register_abilities();
	}

	/**
	 * Registers a loose expectation for a score ability registration.
	 *
	 * @param string $slug The ability slug.
	 *
	 * @return void
	 */
	private function expect_score_ability( string $slug ): void {
		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with( $slug, Mockery::type( 'array' ) );
	}

	/**
	 * Registers loose expectations for the two metadata abilities.
	 *
	 * @return void
	 */
	private function expect_post_seo_data_abilities(): void {
		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with( 'yoast-seo/get-post-seo-data', Mockery::type( 'array' ) );

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with( 'yoast-seo/update-post-seo-data', Mockery::type( 'array' ) );
	}

	/**
	 * Registers a loose expectation for the posts with SEO issues ability registration.
	 *
	 * @return void
	 */
	private function expect_posts_with_seo_issues_ability(): void {
		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with( 'yoast-seo/get-posts-with-seo-issues', Mockery::type( 'array' ) );
	}

	/**
	 * Returns the expected input schema for the posts with SEO issues ability.
	 *
	 * @param array<int, string> $issue_types The issue types expected on offer.
	 *
	 * @return array<string, mixed> The schema.
	 */
	private function get_expected_posts_with_seo_issues_input_schema( array $issue_types ): array {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'required'             => [ 'issue_type' ],
			'properties'           => [
				'issue_type'      => [
					'type'        => 'string',
					'enum'        => $issue_types,
					'description' => 'The SEO issue to look for. Only issue types whose analysis is enabled on this site are offered.',
				],
				'post_type'       => [
					'type'        => 'string',
					'enum'        => [ 'post', 'page', 'product' ],
					'default'     => 'post',
					'description' => 'The post type to look in. Defaults to post.',
				],
				'number_of_posts' => [
					'type'        => 'integer',
					'description' => 'The number of posts to return per page. Defaults to 10.',
					'minimum'     => 1,
					'maximum'     => 100,
					'default'     => 10,
				],
				'page'            => [
					'type'        => 'integer',
					'description' => 'The page of results to return, 1-based and defaulting to 1. Posts are ordered most recently modified first, so request a later page to reach older posts. An empty result means there are no further pages.',
					'minimum'     => 1,
					'default'     => 1,
				],
			],
		];
	}

	/**
	 * Returns the read meta (read-only annotations).
	 *
	 * @return array<string, mixed> The meta.
	 */
	private function get_read_meta(): array {
		return [
			'show_in_rest' => true,
			'annotations'  => [
				'readonly'    => true,
				'destructive' => false,
				'idempotent'  => true,
			],
			'mcp'          => [
				'public' => true,
			],
		];
	}

	/**
	 * Returns the write meta (non-read-only annotations).
	 *
	 * @return array<string, mixed> The meta.
	 */
	private function get_write_meta(): array {
		return [
			'show_in_rest' => true,
			'annotations'  => [
				'readonly'    => false,
				'destructive' => false,
				'idempotent'  => true,
			],
			'mcp'          => [
				'public' => true,
			],
		];
	}

	/**
	 * Returns the expected identifier input schema for the read ability.
	 *
	 * @return array<string, mixed> The schema.
	 */
	private function get_expected_identifier_input_schema(): array {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'post_id'   => [
					'type'        => 'integer',
					'description' => 'The ID of the post to retrieve.',
					'minimum'     => 1,
				],
				'permalink' => [
					'type'        => 'string',
					'description' => 'The permalink (URL) of the post to retrieve.',
				],
				'title'     => [
					'type'        => 'string',
					'description' => 'Keywords to search for in post titles. Provide a comma-separated list to search for several titles at once; each value is matched as a whole phrase against the post title, and a post matching any value is returned. At most 10 phrases are used per request; any beyond the first 10 are ignored. Results are paginated to 10 entities per page; see the page parameter.',
				],
				'page'      => [
					'type'        => 'integer',
					'description' => 'The page of title-search results to return, 1-based and defaulting to 1. Matches are ordered most recently modified first, so request a later page to reach older matches. An empty result means there are no further pages. Only applies to a title search.',
					'minimum'     => 1,
					'default'     => 1,
				],
			],
		];
	}

	/**
	 * Returns the expected update input schema.
	 *
	 * @return array<string, mixed> The schema.
	 */
	private function get_expected_update_input_schema(): array {
		$nullable_string = [ 'type' => [ 'string', 'null' ] ];

		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'post_id'                => [
					'type'        => 'integer',
					'description' => 'The ID of the post to update.',
					'minimum'     => 1,
				],
				'permalink'              => [
					'type'        => 'string',
					'description' => 'The permalink (URL) of the post to update.',
				],
				'seo_title'              => $nullable_string,
				'meta_description'       => $nullable_string,
				'focus_keyphrase'        => \array_merge( $nullable_string, [ 'maxLength' => 191 ] ),
				'canonical'              => $nullable_string,
				'is_cornerstone'         => [ 'type' => 'boolean' ],
				'noindex'                => [
					'type'        => [ 'boolean', 'null' ],
					'description' => 'Whether search engines should be told not to index this post. true sets noindex (the post is excluded from search results); false forces the post to be indexed; null clears the setting and falls back to the post-type default.',
				],
				'nofollow'               => [ 'type' => 'boolean' ],
				'noimageindex'           => [ 'type' => 'boolean' ],
				'noarchive'              => [ 'type' => 'boolean' ],
				'nosnippet'              => [ 'type' => 'boolean' ],
				'open_graph_title'       => $nullable_string,
				'open_graph_description' => $nullable_string,
				'twitter_title'          => $nullable_string,
				'twitter_description'    => $nullable_string,
				'schema_page_type'       => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The Schema.org page type for the post. Must be one of the supported page types. Use null to clear it and fall back to the default.',
					'enum'        => \array_merge( \array_keys( Schema_Types::PAGE_TYPES ), [ '', null ] ),
				],
				'schema_article_type'    => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The Schema.org article type for the post. Must be one of the supported article types. Use null to clear it and fall back to the default.',
					'enum'        => \array_merge( \array_keys( Schema_Types::ARTICLE_TYPES ), [ '', null ] ),
				],
			],
		];
	}

	/**
	 * Returns the expected post SEO data output schema.
	 *
	 * @return array<string, mixed> The schema.
	 */
	private function get_expected_output_schema(): array {
		$nullable_string = [ 'type' => [ 'string', 'null' ] ];
		$score           = static function ( $analysis ) {
			return [
				'type'        => 'string',
				'enum'        => [ 'na', 'bad', 'ok', 'good' ],
				'description' => \sprintf(
					'The result of the %s that ran on the post when it was last saved.',
					$analysis,
				),
			];
		};
		$rendered        = static function ( $field ) {
			return [
				'type'        => [ 'string', 'null' ],
				'description' => \sprintf(
					'The %s as output on the front end: the global default template applied when no custom value is set, with replacement variables expanded. Null when nothing is output.',
					$field,
				),
			];
		};

		return [
			'type'       => 'object',
			'properties' => [
				'post_id'                         => [ 'type' => 'integer' ],
				'post_title'                      => $nullable_string,
				'permalink'                       => $nullable_string,
				'post_type'                       => [ 'type' => 'string' ],
				'post_status'                     => $nullable_string,
				'seo_title'                       => $nullable_string,
				'seo_title_rendered'              => $rendered( 'SEO title' ),
				'meta_description'                => $nullable_string,
				'meta_description_rendered'       => $rendered( 'meta description' ),
				'focus_keyphrase'                 => $nullable_string,
				'canonical'                       => $nullable_string,
				'canonical_rendered'              => $rendered( 'canonical URL' ),
				'is_cornerstone'                  => [ 'type' => 'boolean' ],
				'noindex'                         => [
					'type'        => [ 'boolean', 'null' ],
					'description' => 'Whether search engines are told not to index this post. true means noindex (the post is excluded from search results); false means the post is forced to be indexed; null means no setting is stored and the post-type default applies.',
				],
				'nofollow'                        => [ 'type' => 'boolean' ],
				'noimageindex'                    => [ 'type' => 'boolean' ],
				'noarchive'                       => [ 'type' => 'boolean' ],
				'nosnippet'                       => [ 'type' => 'boolean' ],
				'open_graph_title'                => $nullable_string,
				'open_graph_title_rendered'       => $rendered( 'Open Graph title' ),
				'open_graph_description'          => $nullable_string,
				'open_graph_description_rendered' => $rendered( 'Open Graph description' ),
				'twitter_title'                   => $nullable_string,
				'twitter_title_rendered'          => $rendered( 'Twitter title' ),
				'twitter_description'             => $nullable_string,
				'twitter_description_rendered'    => $rendered( 'Twitter description' ),
				'schema_page_type'                => $nullable_string,
				'schema_article_type'             => $nullable_string,
				'seo_score'                       => $score( 'SEO analysis' ),
				'readability_score'               => $score( 'readability analysis' ),
				'inclusive_language_score'        => $score( 'inclusive language analysis' ),
			],
		];
	}

	/**
	 * Mocks the enabled features repository to return the given features array.
	 *
	 * @param array<string, bool> $features The features array.
	 *
	 * @return void
	 */
	private function mock_enabled_features( array $features ): void {
		$features_list = Mockery::mock( Analysis_Features_List::class );

		$features_list
			->expects( 'to_array' )
			->once()
			->andReturn( $features );

		$this->enabled_analysis_features_repository
			->expects( 'get_features_by_keys' )
			->once()
			->with(
				[
					Keyphrase_Analysis::NAME,
					Readability_Analysis::NAME,
					Inclusive_Language_Analysis::NAME,
				],
			)
			->andReturn( $features_list );
	}
}
