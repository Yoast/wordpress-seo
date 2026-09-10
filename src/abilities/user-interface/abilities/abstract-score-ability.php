<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Base class for the abilities that return the analysis scores of the most recently modified posts.
 */
abstract class Abstract_Score_Ability implements Ability_Interface {

	/**
	 * The score retriever.
	 *
	 * @var Score_Retriever
	 */
	protected $score_retriever;

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
	 * The should index indexables conditional.
	 *
	 * @var Should_Index_Indexables_Conditional
	 */
	private $should_index_indexables_conditional;

	/**
	 * Constructor.
	 *
	 * @param Score_Retriever                      $score_retriever                      The score retriever.
	 * @param Capability_Helper                    $capability_helper                    The capability helper.
	 * @param Enabled_Analysis_Features_Repository $enabled_analysis_features_repository The enabled analysis features repository.
	 * @param Should_Index_Indexables_Conditional  $should_index_indexables_conditional  The should index indexables conditional.
	 */
	public function __construct(
		Score_Retriever $score_retriever,
		Capability_Helper $capability_helper,
		Enabled_Analysis_Features_Repository $enabled_analysis_features_repository,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional
	) {
		$this->score_retriever                      = $score_retriever;
		$this->capability_helper                    = $capability_helper;
		$this->enabled_analysis_features_repository = $enabled_analysis_features_repository;
		$this->should_index_indexables_conditional  = $should_index_indexables_conditional;
	}

	/**
	 * Returns the name of the analysis feature the ability depends on.
	 *
	 * @return string The analysis feature name.
	 */
	abstract protected function get_feature_name(): string;

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	abstract protected function get_label(): string;

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	abstract protected function get_description(): string;

	/**
	 * Returns the callback that executes the ability.
	 *
	 * @return array<int, object|string> The execute callback.
	 */
	abstract protected function get_execute_callback(): array;

	/**
	 * Returns whether the ability is available: the scores are read from the indexables, so
	 * they must be built, and the analysis feature the ability depends on must be enabled.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		if ( ! $this->should_index_indexables_conditional->is_met() ) {
			return false;
		}

		$feature_name     = $this->get_feature_name();
		$enabled_features = $this->enabled_analysis_features_repository->get_features_by_keys( [ $feature_name ] )->to_array();

		return isset( $enabled_features[ $feature_name ] ) && $enabled_features[ $feature_name ] === true;
	}

	/**
	 * Checks whether the current user can manage Yoast SEO.
	 *
	 * Gates the score abilities behind the Yoast SEO management capability.
	 *
	 * @return bool Whether the current user can manage Yoast SEO.
	 */
	public function can_manage_seo(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => $this->get_label(),
			'description'         => $this->get_description(),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'properties'           => [
					'number_of_posts' => [
						'type'        => 'integer',
						'description' => \__( 'The number of recently modified posts to retrieve scores for. Defaults to 10.', 'wordpress-seo' ),
						'minimum'     => 1,
						'maximum'     => 100,
						'default'     => 10,
					],
				],
			],
			'output_schema'       => $this->get_output_schema(),
			'permission_callback' => [ $this, 'can_manage_seo' ],
			'execute_callback'    => $this->get_execute_callback(),
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
		];
	}

	/**
	 * Returns the output schema: an array of score items.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	protected function get_output_schema(): array {
		return $this->wrap_in_array_schema( $this->get_score_output_schema() );
	}

	/**
	 * Wraps an item schema in an array schema.
	 *
	 * @param array<string, mixed> $item_schema The item schema.
	 *
	 * @return array<string, mixed> The array schema.
	 */
	protected function wrap_in_array_schema( array $item_schema ): array {
		return [
			'type'  => 'array',
			'items' => $item_schema,
		];
	}

	/**
	 * Returns the score output schema, including the title property.
	 *
	 * @return array<string, mixed> The score output schema.
	 */
	protected function get_score_output_schema(): array {
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

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
