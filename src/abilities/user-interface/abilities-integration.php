<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface;

use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Framework\Inclusive_Language_Analysis;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Editors\Framework\Readability_Analysis;
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
	 * The enabled analysis features repository.
	 *
	 * @var Enabled_Analysis_Features_Repository
	 */
	private $enabled_analysis_features_repository;

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
	 * @param Score_Retriever                      $score_retriever                      The score retriever.
	 * @param Capability_Helper                    $capability_helper                    The capability helper.
	 * @param Enabled_Analysis_Features_Repository $enabled_analysis_features_repository The enabled analysis features repository.
	 */
	public function __construct(
		Score_Retriever $score_retriever,
		Capability_Helper $capability_helper,
		Enabled_Analysis_Features_Repository $enabled_analysis_features_repository
	) {
		$this->score_retriever                      = $score_retriever;
		$this->capability_helper                    = $capability_helper;
		$this->enabled_analysis_features_repository = $enabled_analysis_features_repository;
	}

	/**
	 * Registers hooks with WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp_abilities_api_init', [ $this, 'register_abilities' ] );
	}

	/**
	 * Registers the Yoast SEO abilities.
	 *
	 * @return void
	 */
	public function register_abilities() {
		$enabled_features = $this->enabled_analysis_features_repository->get_features_by_keys(
			[
				Keyphrase_Analysis::NAME,
				Readability_Analysis::NAME,
				Inclusive_Language_Analysis::NAME,
			],
		)->to_array();

		if ( $enabled_features[ Keyphrase_Analysis::NAME ] === true ) {
			$this->register_seo_scores_ability();
		}

		if ( $enabled_features[ Readability_Analysis::NAME ] === true ) {
			$this->register_readability_scores_ability();
		}

		if ( $enabled_features[ Inclusive_Language_Analysis::NAME ] === true ) {
			$this->register_inclusive_language_scores_ability();
		}
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
	 * Registers the SEO scores ability.
	 *
	 * @return void
	 */
	private function register_seo_scores_ability(): void {
		$output_schema                                  = $this->get_score_output_schema();
		$output_schema['properties']['focus_keyphrase'] = [
			'type'        => [ 'string', 'null' ],
			'description' => \__( 'The focus keyphrase for the post, or null if not set.', 'wordpress-seo' ),
		];

		\wp_register_ability(
			Ability_Categories_Integration::CATEGORY_SLUG . '/get-seo-scores',
			$this->get_shared_ability_args(
				[
					'label'            => \__( 'Get SEO Scores', 'wordpress-seo' ),
					'description'      => \__( 'Get the SEO scores for the most recently modified posts.', 'wordpress-seo' ),
					'output_schema'    => $this->wrap_in_array_schema( $output_schema ),
					'execute_callback' => [ $this->score_retriever, 'get_seo_scores' ],
				],
			),
		);
	}

	/**
	 * Registers the readability scores ability.
	 *
	 * @return void
	 */
	private function register_readability_scores_ability(): void {
		\wp_register_ability(
			Ability_Categories_Integration::CATEGORY_SLUG . '/get-readability-scores',
			$this->get_shared_ability_args(
				[
					'label'            => \__( 'Get Readability Scores', 'wordpress-seo' ),
					'description'      => \__( 'Get the readability scores for the most recently modified posts.', 'wordpress-seo' ),
					'output_schema'    => $this->wrap_in_array_schema( $this->get_score_output_schema() ),
					'execute_callback' => [ $this->score_retriever, 'get_readability_scores' ],
				],
			),
		);
	}

	/**
	 * Registers the inclusive language scores ability.
	 *
	 * @return void
	 */
	private function register_inclusive_language_scores_ability(): void {
		\wp_register_ability(
			Ability_Categories_Integration::CATEGORY_SLUG . '/get-inclusive-language-scores',
			$this->get_shared_ability_args(
				[
					'label'            => \__( 'Get Inclusive Language Scores', 'wordpress-seo' ),
					'description'      => \__( 'Get the inclusive language scores for the most recently modified posts.', 'wordpress-seo' ),
					'output_schema'    => $this->wrap_in_array_schema( $this->get_score_output_schema() ),
					'execute_callback' => [ $this->score_retriever, 'get_inclusive_language_scores' ],
				],
			),
		);
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- Too complicated of a param declaration for this case.

	/**
	 * Returns the shared ability arguments merged with ability-specific arguments.
	 *
	 * @param array<string, mixed> $ability_specific_args The ability-specific arguments.
	 *
	 * @return array<string, mixed> The merged ability arguments.
	 */
	private function get_shared_ability_args( array $ability_specific_args ): array {
	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
		return \array_merge(
			[
				'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
				'input_schema'        => [
					'type'       => 'object',
					'properties' => [
						'number_of_posts' => [
							'type'        => 'integer',
							'description' => \__( 'The number of recently modified posts to retrieve scores for. Defaults to 10.', 'wordpress-seo' ),
							'minimum'     => 1,
							'maximum'     => 100,
							'default'     => 10,
						],
					],
				],
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
	 * Returns the score output schema, including the title property.
	 *
	 * @return array<string, array<string, string>> The score output schema.
	 */
	private function get_score_output_schema(): array {
		return [
			'type'       => 'object',
			'properties' => [
				'title' => [
					'type'        => 'string',
					'description' => \__( 'The post title.', 'wordpress-seo' ),
				],
				'score' => [
					'type'        => 'string',
					'enum'        => [ 'na', 'bad', 'ok', 'good' ],
					'description' => \__( 'The score slug.', 'wordpress-seo' ),
				],
				'label' => [
					'type'        => 'string',
					'description' => \__( 'A human-readable label for the score.', 'wordpress-seo' ),
				],
			],
		];
	}
}
