<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface;

use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Abilities\Infrastructure\Enabled_Analysis_Features_Checker;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Integration that registers Yoast SEO abilities with the WordPress Abilities API.
 */
class Abilities_Integration implements Integration_Interface {

	/**
	 * The score retriever.
	 *
	 * @var Score_Retriever
	 */
	private $score_retriever;

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The enabled analysis features checker.
	 *
	 * @var Enabled_Analysis_Features_Checker
	 */
	private $enabled_analysis_features_checker;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ Abilities_API_Conditional::class ];
	}

	/**
	 * Constructor.
	 *
	 * @param Score_Retriever                   $score_retriever                   The score retriever.
	 * @param Capability_Helper                 $capability_helper                 The capability helper.
	 * @param Enabled_Analysis_Features_Checker $enabled_analysis_features_checker The enabled analysis features checker.
	 */
	public function __construct(
		Score_Retriever $score_retriever,
		Capability_Helper $capability_helper,
		Enabled_Analysis_Features_Checker $enabled_analysis_features_checker
	) {
		$this->score_retriever                   = $score_retriever;
		$this->capability_helper                 = $capability_helper;
		$this->enabled_analysis_features_checker = $enabled_analysis_features_checker;
	}

	/**
	 * Registers hooks with WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp_abilities_api_categories_init', [ $this, 'register_categories' ] );
		\add_action( 'wp_abilities_api_init', [ $this, 'register_abilities' ] );
	}

	/**
	 * Registers the Yoast SEO ability category.
	 *
	 * @return void
	 */
	public function register_categories() {
		\wp_register_ability_category(
			'yoast-seo',
			[
				'label'       => \__( 'Yoast SEO', 'wordpress-seo' ),
				'description' => \__( 'SEO analysis capabilities provided by Yoast SEO.', 'wordpress-seo' ),
			],
		);
	}

	/**
	 * Registers the Yoast SEO abilities.
	 *
	 * @return void
	 */
	public function register_abilities() {
		$seo_score_item_schema                                  = $this->get_score_output_schema( [ 'na', 'bad', 'ok', 'good', 'noindex' ] );
		$seo_score_item_schema['properties']['focus_keyphrase'] = [
			'type'        => [ 'string', 'null' ],
			'description' => \__( 'The focus keyphrase for the post, or null if not set.', 'wordpress-seo' ),
		];

		$readability_score_item_schema        = $this->get_score_output_schema( [ 'na', 'bad', 'ok', 'good' ] );
		$inclusive_language_score_item_schema = $this->get_score_output_schema( [ 'na', 'bad', 'ok', 'good' ] );

		if ( $this->enabled_analysis_features_checker->is_keyword_analysis_enabled() ) {
			\wp_register_ability(
				'yoast-seo/get-seo-scores',
				$this->get_shared_ability_args(
					[
						'label'            => \__( 'Get SEO Scores', 'wordpress-seo' ),
						'description'      => \__( 'Get the SEO scores for the most recently modified posts.', 'wordpress-seo' ),
						'output_schema'    => $this->wrap_in_array_schema( $seo_score_item_schema ),
						'execute_callback' => [ $this->score_retriever, 'get_seo_scores' ],
					],
				),
			);
		}

		if ( $this->enabled_analysis_features_checker->is_content_analysis_enabled() ) {
			\wp_register_ability(
				'yoast-seo/get-readability-scores',
				$this->get_shared_ability_args(
					[
						'label'            => \__( 'Get Readability Scores', 'wordpress-seo' ),
						'description'      => \__( 'Get the readability scores for the most recently modified posts.', 'wordpress-seo' ),
						'output_schema'    => $this->wrap_in_array_schema( $readability_score_item_schema ),
						'execute_callback' => [ $this->score_retriever, 'get_readability_scores' ],
					],
				),
			);
		}

		if ( $this->enabled_analysis_features_checker->is_inclusive_language_enabled() ) {
			\wp_register_ability(
				'yoast-seo/get-inclusive-language-scores',
				$this->get_shared_ability_args(
					[
						'label'            => \__( 'Get Inclusive Language Scores', 'wordpress-seo' ),
						'description'      => \__( 'Get the inclusive language scores for the most recently modified posts.', 'wordpress-seo' ),
						'output_schema'    => $this->wrap_in_array_schema( $inclusive_language_score_item_schema ),
						'execute_callback' => [ $this->score_retriever, 'get_inclusive_language_scores' ],
					],
				),
			);
		}

		$nullable_schema = static function ( array $schema ): array {
			return [
				'oneOf' => [
					$schema,
					[ 'type' => 'null' ],
				],
			];
		};

		// For sub-scores inside get-all-scores, use schemas without the title property.
		$seo_sub_schema                                  = $this->get_score_sub_schema( [ 'na', 'bad', 'ok', 'good', 'noindex' ] );
		$seo_sub_schema['properties']['focus_keyphrase'] = [
			'type'        => [ 'string', 'null' ],
			'description' => \__( 'The focus keyphrase for the post, or null if not set.', 'wordpress-seo' ),
		];

		$readability_sub_schema        = $this->get_score_sub_schema( [ 'na', 'bad', 'ok', 'good' ] );
		$inclusive_language_sub_schema = $this->get_score_sub_schema( [ 'na', 'bad', 'ok', 'good' ] );

		$all_scores_item_schema = [
			'type'       => 'object',
			'properties' => [
				'title'              => [
					'type'        => 'string',
					'description' => \__( 'The post title.', 'wordpress-seo' ),
				],
				'seo'                => $nullable_schema( $seo_sub_schema ),
				'readability'        => $nullable_schema( $readability_sub_schema ),
				'inclusive_language' => $nullable_schema( $inclusive_language_sub_schema ),
			],
		];

		\wp_register_ability(
			'yoast-seo/get-all-scores',
			$this->get_shared_ability_args(
				[
					'label'            => \__( 'Get All Analysis Scores', 'wordpress-seo' ),
					'description'      => \__( 'Get all analysis scores (SEO, readability, inclusive language) for the most recently modified posts.', 'wordpress-seo' ),
					'output_schema'    => $this->wrap_in_array_schema( $all_scores_item_schema ),
					'execute_callback' => [ $this->score_retriever, 'get_all_scores' ],
				],
			),
		);
	}

	/**
	 * Checks whether the current user can read scores.
	 *
	 * @return bool Whether the current user can read scores.
	 */
	public function can_read_scores(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Returns the shared ability arguments merged with ability-specific arguments.
	 *
	 * @param array<string, array<string, string>> $ability_specific_args The ability-specific arguments.
	 *
	 * @return array<string, array<string, string>> The merged ability arguments.
	 */
	private function get_shared_ability_args( array $ability_specific_args ): array {
		return \array_merge(
			[
				'category'            => 'yoast-seo',
				'input_schema'        => $this->get_number_of_posts_schema(),
				'permission_callback' => [ $this, 'can_read_scores' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => true,
						'destructive' => false,
						'idempotent'  => true,
					],
					'mcp'          => [
						'public' => true,
					],
				],
			],
			$ability_specific_args,
		);
	}

	/**
	 * Returns the number of posts input schema.
	 *
	 * @return array<string, array<string, string>> The number of posts schema.
	 */
	private function get_number_of_posts_schema(): array {
		return [
			'type'       => 'object',
			'properties' => [
				'number_of_posts' => [
					'type'        => 'integer',
					'description' => \__( 'The number of recently modified posts to retrieve scores for. Defaults to 10.', 'wordpress-seo' ),
					'minimum'     => 1,
					'default'     => 10,
				],
			],
		];
	}

	/**
	 * Wraps an item schema in an array schema.
	 *
	 * @param array<string, array<string, string>> $item_schema The item schema.
	 *
	 * @return array<string, array<string, string>> The array schema.
	 */
	private function wrap_in_array_schema( array $item_schema ): array {
		return [
			'type'  => 'array',
			'items' => $item_schema,
		];
	}

	/**
	 * Returns the score output schema for a specific set of valid ratings, including the title property.
	 *
	 * @param array<string> $ratings The valid rating slugs for this score type.
	 *
	 * @return array<string, array<string, string>> The score output schema.
	 */
	private function get_score_output_schema( array $ratings ): array {
		return [
			'type'       => 'object',
			'properties' => [
				'title'  => [
					'type'        => 'string',
					'description' => \__( 'The post title.', 'wordpress-seo' ),
				],
				'score'  => [
					'type'        => 'integer',
					'description' => \__( 'The numeric score from 0 to 100.', 'wordpress-seo' ),
				],
				'rating' => [
					'type'        => 'string',
					'enum'        => $ratings,
					'description' => \__( 'The rating slug.', 'wordpress-seo' ),
				],
				'label'  => [
					'type'        => 'string',
					'description' => \__( 'A human-readable label for the rating.', 'wordpress-seo' ),
				],
			],
		];
	}

	/**
	 * Returns the score sub-schema (without title) for use inside the all-scores ability.
	 *
	 * @param array<string> $ratings The valid rating slugs for this score type.
	 *
	 * @return array<string, array<string, string>> The score sub-schema.
	 */
	private function get_score_sub_schema( array $ratings ): array {
		return [
			'type'       => 'object',
			'properties' => [
				'score'  => [
					'type'        => 'integer',
					'description' => \__( 'The numeric score from 0 to 100.', 'wordpress-seo' ),
				],
				'rating' => [
					'type'        => 'string',
					'enum'        => $ratings,
					'description' => \__( 'The rating slug.', 'wordpress-seo' ),
				],
				'label'  => [
					'type'        => 'string',
					'description' => \__( 'A human-readable label for the rating.', 'wordpress-seo' ),
				],
			],
		];
	}
}
