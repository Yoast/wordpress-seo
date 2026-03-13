<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Abilities\Infrastructure\Enabled_Analysis_Features_Checker;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
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
	 * The enabled analysis features checker mock.
	 *
	 * @var Mockery\MockInterface|Enabled_Analysis_Features_Checker
	 */
	private $enabled_analysis_features_checker;

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

		$this->score_retriever                   = Mockery::mock( Score_Retriever::class );
		$this->capability_helper                 = Mockery::mock( Capability_Helper::class );
		$this->enabled_analysis_features_checker = Mockery::mock( Enabled_Analysis_Features_Checker::class );

		$this->instance = new Abilities_Integration(
			$this->score_retriever,
			$this->capability_helper,
			$this->enabled_analysis_features_checker,
		);

		$this->enabled_analysis_features_checker
			->shouldReceive( 'is_keyword_analysis_enabled' )
			->andReturn( true )
			->byDefault();

		$this->enabled_analysis_features_checker
			->shouldReceive( 'is_content_analysis_enabled' )
			->andReturn( true )
			->byDefault();

		$this->enabled_analysis_features_checker
			->shouldReceive( 'is_inclusive_language_enabled' )
			->andReturn( false )
			->byDefault();
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
	 * Tests that register_abilities registers all 4 abilities when inclusive language is enabled.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_inclusive_language_enabled() {
		$this->enabled_analysis_features_checker
			->expects( 'is_inclusive_language_enabled' )
			->once()
			->andReturn( true );

		$post_id_schema = [
			'type'       => 'object',
			'properties' => [
				'post_id' => [
					'type'        => 'integer',
					'description' => 'The ID of the post to retrieve the score for.',
					'minimum'     => 1,
				],
			],
			'required'   => [ 'post_id' ],
		];

		$seo_score_schema                                  = $this->get_expected_score_schema( [ 'na', 'bad', 'ok', 'good', 'noindex' ] );
		$seo_score_schema['properties']['focus_keyphrase'] = [
			'type'        => [ 'string', 'null' ],
			'description' => 'The focus keyphrase for the post, or null if not set.',
		];

		$readability_score_schema        = $this->get_expected_score_schema( [ 'na', 'bad', 'ok', 'good' ] );
		$inclusive_language_score_schema = $this->get_expected_score_schema( [ 'bad', 'ok', 'good' ] );

		$shared_meta = [
			'show_in_rest' => true,
			'annotations'  => [
				'readonly'    => false,
				'destructive' => false,
				'idempotent'  => true,
			],
		];

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-seo-score',
				[
					'label'               => 'Get SEO Score',
					'category'            => 'yoast-seo',
					'description'         => 'Get the SEO score for a post.',
					'input_schema'        => $post_id_schema,
					'output_schema'       => $seo_score_schema,
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_seo_score' ],
					'meta'                => $shared_meta,
				],
			);

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-readability-score',
				[
					'label'               => 'Get Readability Score',
					'category'            => 'yoast-seo',
					'description'         => 'Get the readability score for a post.',
					'input_schema'        => $post_id_schema,
					'output_schema'       => $readability_score_schema,
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_readability_score' ],
					'meta'                => $shared_meta,
				],
			);

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-inclusive-language-score',
				[
					'label'               => 'Get Inclusive Language Score',
					'category'            => 'yoast-seo',
					'description'         => 'Get the inclusive language score for a post.',
					'input_schema'        => $post_id_schema,
					'output_schema'       => $inclusive_language_score_schema,
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_inclusive_language_score' ],
					'meta'                => $shared_meta,
				],
			);

		$nullable = static function ( array $schema ): array {
			return [
				'oneOf' => [
					$schema,
					[ 'type' => 'null' ],
				],
			];
		};

		$all_scores_output_schema = [
			'type'       => 'object',
			'properties' => [
				'seo'                => $nullable( $seo_score_schema ),
				'readability'        => $nullable( $readability_score_schema ),
				'inclusive_language' => $nullable( $inclusive_language_score_schema ),
			],
		];

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-all-scores',
				[
					'label'               => 'Get All Analysis Scores',
					'category'            => 'yoast-seo',
					'description'         => 'Get all analysis scores (SEO, readability, inclusive language) for a post.',
					'input_schema'        => $post_id_schema,
					'output_schema'       => $all_scores_output_schema,
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_all_scores' ],
					'meta'                => $shared_meta,
				],
			);

		$this->instance->register_abilities();
	}

	/**
	 * Tests that register_abilities registers only 3 abilities when inclusive language is disabled.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_inclusive_language_disabled() {
		$post_id_schema = [
			'type'       => 'object',
			'properties' => [
				'post_id' => [
					'type'        => 'integer',
					'description' => 'The ID of the post to retrieve the score for.',
					'minimum'     => 1,
				],
			],
			'required'   => [ 'post_id' ],
		];

		$seo_score_schema                                  = $this->get_expected_score_schema( [ 'na', 'bad', 'ok', 'good', 'noindex' ] );
		$seo_score_schema['properties']['focus_keyphrase'] = [
			'type'        => [ 'string', 'null' ],
			'description' => 'The focus keyphrase for the post, or null if not set.',
		];

		$readability_score_schema        = $this->get_expected_score_schema( [ 'na', 'bad', 'ok', 'good' ] );
		$inclusive_language_score_schema = $this->get_expected_score_schema( [ 'bad', 'ok', 'good' ] );

		$shared_meta = [
			'show_in_rest' => true,
			'annotations'  => [
				'readonly'    => false,
				'destructive' => false,
				'idempotent'  => true,
			],
		];

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-seo-score',
				[
					'label'               => 'Get SEO Score',
					'category'            => 'yoast-seo',
					'description'         => 'Get the SEO score for a post.',
					'input_schema'        => $post_id_schema,
					'output_schema'       => $seo_score_schema,
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_seo_score' ],
					'meta'                => $shared_meta,
				],
			);

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-readability-score',
				[
					'label'               => 'Get Readability Score',
					'category'            => 'yoast-seo',
					'description'         => 'Get the readability score for a post.',
					'input_schema'        => $post_id_schema,
					'output_schema'       => $readability_score_schema,
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_readability_score' ],
					'meta'                => $shared_meta,
				],
			);

		$nullable = static function ( array $schema ): array {
			return [
				'oneOf' => [
					$schema,
					[ 'type' => 'null' ],
				],
			];
		};

		$all_scores_output_schema = [
			'type'       => 'object',
			'properties' => [
				'seo'                => $nullable( $seo_score_schema ),
				'readability'        => $nullable( $readability_score_schema ),
				'inclusive_language' => $nullable( $inclusive_language_score_schema ),
			],
		];

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with(
				'yoast-seo/get-all-scores',
				[
					'label'               => 'Get All Analysis Scores',
					'category'            => 'yoast-seo',
					'description'         => 'Get all analysis scores (SEO, readability, inclusive language) for a post.',
					'input_schema'        => $post_id_schema,
					'output_schema'       => $all_scores_output_schema,
					'permission_callback' => [ $this->instance, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_all_scores' ],
					'meta'                => $shared_meta,
				],
			);

		$this->instance->register_abilities();
	}

	/**
	 * Returns the expected score output schema for a given set of valid ratings.
	 *
	 * @param array<string> $ratings The valid rating slugs.
	 *
	 * @return array<string, mixed> The expected score output schema.
	 */
	private function get_expected_score_schema( array $ratings ): array {
		return [
			'type'       => 'object',
			'properties' => [
				'score'  => [
					'type'        => 'integer',
					'description' => 'The numeric score from 0 to 100.',
				],
				'rating' => [
					'type'        => 'string',
					'enum'        => $ratings,
					'description' => 'The rating slug.',
				],
				'label'  => [
					'type'        => 'string',
					'description' => 'A human-readable label for the rating.',
				],
			],
		];
	}
}
