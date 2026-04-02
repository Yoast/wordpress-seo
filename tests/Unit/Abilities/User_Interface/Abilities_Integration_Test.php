<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
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

		$this->score_retriever                      = Mockery::mock( Score_Retriever::class );
		$this->capability_helper                    = Mockery::mock( Capability_Helper::class );
		$this->enabled_analysis_features_repository = Mockery::mock( Enabled_Analysis_Features_Repository::class );

		$this->instance = new Abilities_Integration(
			$this->score_retriever,
			$this->capability_helper,
			$this->enabled_analysis_features_repository,
		);
	}

	/**
	 * Tests that get_conditionals returns the Abilities API conditional.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame(
			[ Abilities_API_Conditional::class ],
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
		Monkey\Actions\expectAdded( 'wp_abilities_api_categories_init' )
			->once()
			->with( [ $this->instance, 'register_categories' ] );

		Monkey\Actions\expectAdded( 'wp_abilities_api_init' )
			->once()
			->with( [ $this->instance, 'register_abilities' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that can_read_scores returns true for a user with wpseo_manage_options capability.
	 *
	 * @covers ::can_read_scores
	 *
	 * @return void
	 */
	public function test_can_read_scores_returns_true_for_user_with_manage_options() {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$this->assertTrue( $this->instance->can_read_scores() );
	}

	/**
	 * Tests that can_read_scores returns false for a user without wpseo_manage_options capability.
	 *
	 * @covers ::can_read_scores
	 *
	 * @return void
	 */
	public function test_can_read_scores_returns_false_for_user_without_manage_options() {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( false );

		$this->assertFalse( $this->instance->can_read_scores() );
	}

	/**
	 * Tests that register_categories registers the Yoast SEO category.
	 *
	 * @covers ::register_categories
	 *
	 * @return void
	 */
	public function test_register_categories() {
		Monkey\Functions\expect( 'wp_register_ability_category' )
			->once()
			->with(
				'yoast-seo',
				[
					'label'       => 'Yoast SEO',
					'description' => 'SEO analysis capabilities provided by Yoast SEO.',
				],
			);

		$this->instance->register_categories();
	}

	/**
	 * Tests that register_abilities registers all 3 abilities when inclusive language is enabled.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_inclusive_language_enabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME           => true,
				Readability_Analysis::NAME         => true,
				Inclusive_Language_Analysis::NAME  => true,
			],
		);

		$number_of_posts_schema = $this->get_number_of_posts_schema();

		$seo_score_item_schema                                  = $this->get_expected_score_schema();
		$seo_score_item_schema['properties']['focus_keyphrase'] = [
			'type'        => [ 'string', 'null' ],
			'description' => 'The focus keyphrase for the post, or null if not set.',
		];

		$readability_score_item_schema        = $this->get_expected_score_schema();
		$inclusive_language_score_item_schema = $this->get_expected_score_schema();

		$shared_meta = $this->get_shared_meta();

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-seo-scores',
				[
					'label'               => 'Get SEO Scores',
					'category'            => 'yoast-seo',
					'description'         => 'Get the SEO scores for the most recently modified posts.',
					'input_schema'        => $number_of_posts_schema,
					'output_schema'       => [
						'type'  => 'array',
						'items' => $seo_score_item_schema,
					],
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_seo_scores' ],
					'meta'                => $shared_meta,
				],
			);

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-readability-scores',
				[
					'label'               => 'Get Readability Scores',
					'category'            => 'yoast-seo',
					'description'         => 'Get the readability scores for the most recently modified posts.',
					'input_schema'        => $number_of_posts_schema,
					'output_schema'       => [
						'type'  => 'array',
						'items' => $readability_score_item_schema,
					],
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_readability_scores' ],
					'meta'                => $shared_meta,
				],
			);

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-inclusive-language-scores',
				[
					'label'               => 'Get Inclusive Language Scores',
					'category'            => 'yoast-seo',
					'description'         => 'Get the inclusive language scores for the most recently modified posts.',
					'input_schema'        => $number_of_posts_schema,
					'output_schema'       => [
						'type'  => 'array',
						'items' => $inclusive_language_score_item_schema,
					],
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_inclusive_language_scores' ],
					'meta'                => $shared_meta,
				],
			);

		$this->instance->register_abilities();
	}

	/**
	 * Tests that register_abilities does not register SEO scores when keyword analysis is disabled.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_keyword_analysis_disabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME           => false,
				Readability_Analysis::NAME         => true,
				Inclusive_Language_Analysis::NAME  => false,
			],
		);

		Monkey\Functions\expect( 'wp_register_ability' )
			->once();

		$this->instance->register_abilities();
	}

	/**
	 * Tests that register_abilities does not register readability scores when content analysis is disabled.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_content_analysis_disabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME           => true,
				Readability_Analysis::NAME         => false,
				Inclusive_Language_Analysis::NAME  => false,
			],
		);

		Monkey\Functions\expect( 'wp_register_ability' )
			->once();

		$this->instance->register_abilities();
	}

	/**
	 * Tests that register_abilities registers only 2 abilities when inclusive language is disabled.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_inclusive_language_disabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME           => true,
				Readability_Analysis::NAME         => true,
				Inclusive_Language_Analysis::NAME  => false,
			],
		);

		$number_of_posts_schema = $this->get_number_of_posts_schema();

		$seo_score_item_schema                                  = $this->get_expected_score_schema();
		$seo_score_item_schema['properties']['focus_keyphrase'] = [
			'type'        => [ 'string', 'null' ],
			'description' => 'The focus keyphrase for the post, or null if not set.',
		];

		$readability_score_item_schema = $this->get_expected_score_schema();

		$shared_meta = $this->get_shared_meta();

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-seo-scores',
				[
					'label'               => 'Get SEO Scores',
					'category'            => 'yoast-seo',
					'description'         => 'Get the SEO scores for the most recently modified posts.',
					'input_schema'        => $number_of_posts_schema,
					'output_schema'       => [
						'type'  => 'array',
						'items' => $seo_score_item_schema,
					],
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_seo_scores' ],
					'meta'                => $shared_meta,
				],
			);

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-readability-scores',
				[
					'label'               => 'Get Readability Scores',
					'category'            => 'yoast-seo',
					'description'         => 'Get the readability scores for the most recently modified posts.',
					'input_schema'        => $number_of_posts_schema,
					'output_schema'       => [
						'type'  => 'array',
						'items' => $readability_score_item_schema,
					],
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_readability_scores' ],
					'meta'                => $shared_meta,
				],
			);

		$this->instance->register_abilities();
	}

	/**
	 * Returns the expected number of posts input schema.
	 *
	 * @return array<string, mixed> The expected schema.
	 */
	private function get_number_of_posts_schema(): array {
		return [
			'type'       => 'object',
			'properties' => [
				'number_of_posts' => [
					'type'        => 'integer',
					'description' => 'The number of recently modified posts to retrieve scores for. Defaults to 10.',
					'minimum'     => 1,
					'maximum'     => 100,
					'default'     => 10,
				],
			],
		];
	}

	/**
	 * Returns the shared meta expected for all abilities.
	 *
	 * @return array<string, mixed> The shared meta.
	 */
	private function get_shared_meta(): array {
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
	 * Returns the expected score output schema (with title).
	 *
	 * @return array<string, mixed> The expected score output schema.
	 */
	private function get_expected_score_schema(): array {
		return [
			'type'       => 'object',
			'properties' => [
				'title' => [
					'type'        => 'string',
					'description' => 'The post title.',
				],
				'score' => [
					'type'        => 'string',
					'enum'        => [ 'na', 'bad', 'ok', 'good' ],
					'description' => 'The score slug.',
				],
				'label' => [
					'type'        => 'string',
					'description' => 'A human-readable label for the score.',
				],
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
