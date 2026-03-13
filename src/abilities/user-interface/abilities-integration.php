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
		$seo_score_schema                                  = $this->get_score_output_schema( [ 'na', 'bad', 'ok', 'good', 'noindex' ] );
		$seo_score_schema['properties']['focus_keyphrase'] = [
			'type'        => [ 'string', 'null' ],
			'description' => \__( 'The focus keyphrase for the post, or null if not set.', 'wordpress-seo' ),
		];

		$readability_score_schema        = $this->get_score_output_schema( [ 'na', 'bad', 'ok', 'good' ] );
		$inclusive_language_score_schema = $this->get_score_output_schema( [ 'bad', 'ok', 'good' ] );

		if ( $this->enabled_analysis_features_checker->is_keyword_analysis_enabled() ) {
			\wp_register_ability(
				'yoast-seo/get-seo-score',
				$this->get_shared_ability_args(
					[
						'label'            => \__( 'Get SEO Score', 'wordpress-seo' ),
						'description'      => \__( 'Get the SEO score for a post.', 'wordpress-seo' ),
						'output_schema'    => $seo_score_schema,
						'execute_callback' => [ $this->score_retriever, 'get_seo_score' ],
					],
				),
			);
		}

		if ( $this->enabled_analysis_features_checker->is_content_analysis_enabled() ) {
			\wp_register_ability(
				'yoast-seo/get-readability-score',
				$this->get_shared_ability_args(
					[
						'label'            => \__( 'Get Readability Score', 'wordpress-seo' ),
						'description'      => \__( 'Get the readability score for a post.', 'wordpress-seo' ),
						'output_schema'    => $readability_score_schema,
						'execute_callback' => [ $this->score_retriever, 'get_readability_score' ],
					],
				),
			);
		}

		if ( $this->enabled_analysis_features_checker->is_inclusive_language_enabled() ) {
			\wp_register_ability(
				'yoast-seo/get-inclusive-language-score',
				$this->get_shared_ability_args(
					[
						'label'            => \__( 'Get Inclusive Language Score', 'wordpress-seo' ),
						'description'      => \__( 'Get the inclusive language score for a post.', 'wordpress-seo' ),
						'output_schema'    => $inclusive_language_score_schema,
						'execute_callback' => [ $this->score_retriever, 'get_inclusive_language_score' ],
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

		$all_scores_output_schema = [
			'type'       => 'object',
			'properties' => [
				'seo'                => $nullable_schema( $seo_score_schema ),
				'readability'        => $nullable_schema( $readability_score_schema ),
				'inclusive_language' => $nullable_schema( $inclusive_language_score_schema ),
			],
		];

		\wp_register_ability(
			'yoast-seo/get-all-scores',
			$this->get_shared_ability_args(
				[
					'label'            => \__( 'Get All Analysis Scores', 'wordpress-seo' ),
					'description'      => \__( 'Get all analysis scores (SEO, readability, inclusive language) for a post.', 'wordpress-seo' ),
					'output_schema'    => $all_scores_output_schema,
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
	 * @param array<string, mixed> $ability_specific_args The ability-specific arguments.
	 *
	 * @return array<string, mixed> The merged ability arguments.
	 */
	private function get_shared_ability_args( array $ability_specific_args ): array {
		return \array_merge(
			[
				'category'            => 'yoast-seo',
				'input_schema'        => $this->get_post_id_schema(),
				'permission_callback' => [ $this, 'can_read_scores' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => false,
						'destructive' => false,
						'idempotent'  => true,
					],
					'mcp' => [
						'public' => true,
					],
				],
			],
			$ability_specific_args,
		);
	}

	/**
	 * Returns the post ID input schema.
	 *
	 * @return array<string, array<string, string>> The post ID schema.
	 */
	private function get_post_id_schema(): array {
		return [
			'type'       => 'object',
			'properties' => [
				'post_id' => [
					'type'        => 'integer',
					'description' => \__( 'The ID of the post to retrieve the score for.', 'wordpress-seo' ),
					'minimum'     => 1,
				],
			],
			'required'   => [ 'post_id' ],
		];
	}

	/**
	 * Returns the score output schema for a specific set of valid ratings.
	 *
	 * @param array<string> $ratings The valid rating slugs for this score type.
	 *
	 * @return array<string, array<string, string>> The score output schema.
	 */
	private function get_score_output_schema( array $ratings ): array {
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
