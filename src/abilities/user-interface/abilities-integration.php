<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface;

use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Config\Schema_Types;
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
	 * The post SEO data collector.
	 *
	 * @var Post_SEO_Data_Collector
	 */
	private $post_seo_data_collector;

	/**
	 * The post SEO data updater.
	 *
	 * @var Post_SEO_Data_Updater
	 */
	private $post_seo_data_updater;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [
			Abilities_API_Conditional::class,
			Should_Index_Indexables_Conditional::class,
		];
	}

	/**
	 * Constructor.
	 *
	 * @param Score_Retriever                      $score_retriever                      The score retriever.
	 * @param Capability_Helper                    $capability_helper                    The capability helper.
	 * @param Enabled_Analysis_Features_Repository $enabled_analysis_features_repository The enabled analysis features repository.
	 * @param Post_SEO_Data_Collector              $post_seo_data_collector              The post SEO data collector.
	 * @param Post_SEO_Data_Updater                $post_seo_data_updater                The post SEO data updater.
	 */
	public function __construct(
		Score_Retriever $score_retriever,
		Capability_Helper $capability_helper,
		Enabled_Analysis_Features_Repository $enabled_analysis_features_repository,
		Post_SEO_Data_Collector $post_seo_data_collector,
		Post_SEO_Data_Updater $post_seo_data_updater
	) {
		$this->score_retriever                      = $score_retriever;
		$this->capability_helper                    = $capability_helper;
		$this->enabled_analysis_features_repository = $enabled_analysis_features_repository;
		$this->post_seo_data_collector              = $post_seo_data_collector;
		$this->post_seo_data_updater                = $post_seo_data_updater;
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

		// Metadata read/write is independent of which analysis features are enabled.
		$this->register_get_post_seo_data_ability();
		$this->register_update_post_seo_data_ability();
	}

	/**
	 * Checks whether the current user can manage Yoast SEO.
	 *
	 * Gates every ability — reading scores, reading post SEO data, and updating it —
	 * behind the same Yoast SEO management capability.
	 *
	 * @return bool Whether the current user can manage Yoast SEO.
	 */
	public function can_manage_seo(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Checks whether the current user can read scores.
	 *
	 * @deprecated 28.2
	 * @codeCoverageIgnore Because of deprecation.
	 *
	 * @return bool Whether the current user can read scores.
	 */
	public function can_read_scores(): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.2', 'Use can_manage_seo() instead.' );

		return $this->can_manage_seo();
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

	/**
	 * Registers the get post SEO data ability.
	 *
	 * @return void
	 */
	private function register_get_post_seo_data_ability(): void {
		\wp_register_ability(
			Ability_Categories_Integration::CATEGORY_SLUG . '/get-post-seo-data',
			$this->get_shared_ability_args(
				[
					'label'               => \__( 'Get Post SEO Data', 'wordpress-seo' ),
					'description'         => \__( 'Get the SEO data for a post. Identify the post by post_id, by permalink (URL), or by title keywords; the title may be a comma-separated list and returns the SEO data for every post matching any of the values, paginated most recently modified first (use the page parameter to reach older matches). At least one identifier is required.', 'wordpress-seo' ),
					'input_schema'        => $this->get_post_identifier_input_schema(),
					'output_schema'       => $this->wrap_in_array_schema( $this->get_post_seo_data_output_schema() ),
					'execute_callback'    => [ $this->post_seo_data_collector, 'get_post_seo_data' ],
				],
			),
		);
	}

	/**
	 * Registers the update post SEO data ability.
	 *
	 * @return void
	 */
	private function register_update_post_seo_data_ability(): void {
		\wp_register_ability(
			Ability_Categories_Integration::CATEGORY_SLUG . '/update-post-seo-data',
			$this->get_shared_ability_args(
				[
					'label'               => \__( 'Update Post SEO Data', 'wordpress-seo' ),
					'description'         => \__( 'Update the SEO data for a single post. Identify the post by post_id or by permalink (URL). Only the fields you provide are changed; a provided empty value clears that field.', 'wordpress-seo' ),
					'input_schema'        => $this->get_update_post_seo_data_input_schema(),
					'output_schema'       => $this->get_post_seo_data_output_schema(),
					'execute_callback'    => [ $this->post_seo_data_updater, 'update_post_seo_data' ],
					'meta'                => [
						'show_in_rest' => true,
						'annotations'  => [
							'readonly'    => false,
							'destructive' => false,
							'idempotent'  => true,
						],
						'mcp'          => [
							'public' => true,
						],
					],
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
				'permission_callback' => [ $this, 'can_manage_seo' ],
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

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the input schema for identifying a post (read path).
	 *
	 * @return array<string, mixed> The input schema.
	 */
	private function get_post_identifier_input_schema(): array {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'post_id'   => [
					'type'        => 'integer',
					'description' => \__( 'The ID of the post to retrieve.', 'wordpress-seo' ),
					'minimum'     => 1,
				],
				'permalink' => [
					'type'        => 'string',
					'description' => \__( 'The permalink (URL) of the post to retrieve.', 'wordpress-seo' ),
				],
				'title'     => [
					'type'        => 'string',
					'description' => \__( 'Keywords to search for in post titles. Provide a comma-separated list to search for several titles at once; each value is matched as a whole phrase against the post title, and a post matching any value is returned. At most 10 phrases are used per request; any beyond the first 10 are ignored. Results are paginated to 10 entities per page; see the page parameter.', 'wordpress-seo' ),
				],
				'page'      => [
					'type'        => 'integer',
					'description' => \__( 'The page of title-search results to return, 1-based and defaulting to 1. Matches are ordered most recently modified first, so request a later page to reach older matches. An empty result means there are no further pages. Only applies to a title search.', 'wordpress-seo' ),
					'minimum'     => 1,
					'default'     => 1,
				],
			],
		];
	}

	/**
	 * Returns the input schema for updating a post's SEO data (write path).
	 *
	 * @return array<string, mixed> The input schema.
	 */
	private function get_update_post_seo_data_input_schema(): array {
		$nullable_string = [ 'type' => [ 'string', 'null' ] ];

		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'post_id'                => [
					'type'        => 'integer',
					'description' => \__( 'The ID of the post to update.', 'wordpress-seo' ),
					'minimum'     => 1,
				],
				'permalink'              => [
					'type'        => 'string',
					'description' => \__( 'The permalink (URL) of the post to update.', 'wordpress-seo' ),
				],
				'seo_title'              => $nullable_string,
				'meta_description'       => $nullable_string,
				'focus_keyphrase'        => \array_merge( $nullable_string, [ 'maxLength' => 191 ] ),
				'canonical'              => $nullable_string,
				'is_cornerstone'         => [ 'type' => 'boolean' ],
				'noindex'                => [
					'type'        => [ 'boolean', 'null' ],
					'description' => \__( 'Whether search engines should be told not to index this post. true sets noindex (the post is excluded from search results); false forces the post to be indexed; null clears the setting and falls back to the post-type default.', 'wordpress-seo' ),
				],
				'nofollow'               => [ 'type' => 'boolean' ],
				'noimageindex'           => [ 'type' => 'boolean' ],
				'noarchive'              => [ 'type' => 'boolean' ],
				'nosnippet'              => [ 'type' => 'boolean' ],
				'open_graph_title'       => $nullable_string,
				'open_graph_description' => $nullable_string,
				'twitter_title'          => $nullable_string,
				'twitter_description'    => $nullable_string,
				'schema_page_type'       => $this->nullable_enum_schema(
					\array_keys( Schema_Types::PAGE_TYPES ),
					\__( 'The Schema.org page type for the post. Must be one of the supported page types. Use null to clear it and fall back to the default.', 'wordpress-seo' ),
				),
				'schema_article_type'    => $this->nullable_enum_schema(
					$this->get_schema_article_types(),
					\__( 'The Schema.org article type for the post. Must be one of the supported article types. Use null to clear it and fall back to the default.', 'wordpress-seo' ),
				),
			],
		];
	}

	/**
	 * Returns the allowed Schema.org article type values.
	 *
	 * Mirrors the validation in WPSEO_Option_Titles so the ability accepts exactly the
	 * article types the editor does, including any registered through the filter.
	 *
	 * @return array<int, string> The allowed article type values.
	 */
	private function get_schema_article_types(): array {
		/**
		 * Filter: 'wpseo_schema_article_types' - Allow developers to filter the available article types.
		 *
		 * Make sure when you filter this to also filter `wpseo_schema_article_types_labels`.
		 *
		 * @param array $schema_article_types The available schema article types.
		 */
		return \array_keys( \apply_filters( 'wpseo_schema_article_types', Schema_Types::ARTICLE_TYPES ) );
	}

	/**
	 * Returns a nullable-string input schema constrained to a fixed set of allowed values.
	 *
	 * Null and the empty string are always allowed on top of the enum so the field can be
	 * cleared, matching the patch-clear semantics of the other write fields.
	 *
	 * @param array<int, string> $allowed_values The allowed string values.
	 * @param string             $description    The field description.
	 *
	 * @return array<string, mixed> The input schema fragment.
	 */
	private function nullable_enum_schema( array $allowed_values, string $description ): array {
		return [
			'type'        => [ 'string', 'null' ],
			'description' => $description,
			'enum'        => \array_merge( $allowed_values, [ '', null ] ),
		];
	}

	/**
	 * Returns the output schema describing a post's SEO data.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	private function get_post_seo_data_output_schema(): array {
		$nullable_string = [
			'type' => [ 'string', 'null' ],
		];
		$score           = static function ( $analysis ) {
			return [
				'type'        => 'string',
				'enum'        => [ 'na', 'bad', 'ok', 'good' ],
				'description' => \sprintf(
					/* translators: %s expands to the name of the analysis, e.g. "SEO analysis". */
					\__( 'The result of the %s that ran on the post when it was last saved.', 'wordpress-seo' ),
					$analysis,
				),
			];
		};

		// The rendered companion of a field carries the value as actually output on the front end: the global default template applied where no custom value is set, with replacement variables expanded.
		$rendered = static function ( $field ) {
			return [
				'type'        => [ 'string', 'null' ],
				'description' => \sprintf(
					/* translators: %s expands to the name of the SEO field, e.g. "SEO title". */
					\__( 'The %s as output on the front end: the global default template applied when no custom value is set, with replacement variables expanded. Null when nothing is output.', 'wordpress-seo' ),
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
				'seo_title_rendered'              => $rendered( \__( 'SEO title', 'wordpress-seo' ) ),
				'meta_description'                => $nullable_string,
				'meta_description_rendered'       => $rendered( \__( 'meta description', 'wordpress-seo' ) ),
				'focus_keyphrase'                 => $nullable_string,
				'canonical'                       => $nullable_string,
				'canonical_rendered'              => $rendered( \__( 'canonical URL', 'wordpress-seo' ) ),
				'is_cornerstone'                  => [ 'type' => 'boolean' ],
				'noindex'                         => [
					'type'        => [ 'boolean', 'null' ],
					'description' => \__( 'Whether search engines are told not to index this post. true means noindex (the post is excluded from search results); false means the post is forced to be indexed; null means no setting is stored and the post-type default applies.', 'wordpress-seo' ),
				],
				'nofollow'                        => [ 'type' => 'boolean' ],
				'noimageindex'                    => [ 'type' => 'boolean' ],
				'noarchive'                       => [ 'type' => 'boolean' ],
				'nosnippet'                       => [ 'type' => 'boolean' ],
				'open_graph_title'                => $nullable_string,
				'open_graph_title_rendered'       => $rendered( \__( 'Open Graph title', 'wordpress-seo' ) ),
				'open_graph_description'          => $nullable_string,
				'open_graph_description_rendered' => $rendered( \__( 'Open Graph description', 'wordpress-seo' ) ),
				'twitter_title'                   => $nullable_string,
				'twitter_title_rendered'          => $rendered( \__( 'Twitter title', 'wordpress-seo' ) ),
				'twitter_description'             => $nullable_string,
				'twitter_description_rendered'    => $rendered( \__( 'Twitter description', 'wordpress-seo' ) ),
				'schema_page_type'                => $nullable_string,
				'schema_article_type'             => $nullable_string,
				'seo_score'                       => $score( \__( 'SEO analysis', 'wordpress-seo' ) ),
				'readability_score'               => $score( \__( 'readability analysis', 'wordpress-seo' ) ),
				'inclusive_language_score'        => $score( \__( 'inclusive language analysis', 'wordpress-seo' ) ),
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
