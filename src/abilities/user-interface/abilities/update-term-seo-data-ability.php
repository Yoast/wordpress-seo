<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Term_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Abilities\User_Interface\AI_Generate_Upsell;
use Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that updates the SEO data of a single term.
 */
class Update_Term_SEO_Data_Ability extends Abstract_SEO_Data_Ability {

	/**
	 * The term SEO data updater.
	 *
	 * @var Term_SEO_Data_Updater
	 */
	private $term_seo_data_updater;

	/**
	 * The AI Generate upsell.
	 *
	 * @var AI_Generate_Upsell
	 */
	private $ai_generate_upsell;

	/**
	 * The SEO data output schema.
	 *
	 * @var SEO_Data_Output_Schema
	 */
	private $output_schema;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                   $capability_helper                   The capability helper.
	 * @param Should_Index_Indexables_Conditional $should_index_indexables_conditional The should index indexables conditional.
	 * @param Term_SEO_Data_Updater               $term_seo_data_updater               The term SEO data updater.
	 * @param AI_Generate_Upsell                  $ai_generate_upsell                  The AI Generate upsell.
	 * @param SEO_Data_Output_Schema              $output_schema                       The SEO data output schema.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional,
		Term_SEO_Data_Updater $term_seo_data_updater,
		AI_Generate_Upsell $ai_generate_upsell,
		SEO_Data_Output_Schema $output_schema
	) {
		parent::__construct( $capability_helper, $should_index_indexables_conditional );

		$this->term_seo_data_updater = $term_seo_data_updater;
		$this->ai_generate_upsell    = $ai_generate_upsell;
		$this->output_schema         = $output_schema;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/update-term-seo-data';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => \__( 'Update Term SEO Data', 'wordpress-seo' ),
			'description'         => \__( 'Update the SEO data for a single taxonomy term, such as a category or a tag. Identify the term by term_id or by permalink (URL). Only the fields you provide are changed; a provided empty value clears that field. Only terms the current user is allowed to edit can be updated.', 'wordpress-seo' ),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => $this->get_update_term_seo_data_input_schema(),
			'output_schema'       => $this->ai_generate_upsell->add_to_schema( $this->output_schema->get_term_output_schema() ),
			'permission_callback' => [ $this, 'can_edit_advanced_metadata' ],
			'execute_callback'    => [ $this, 'execute' ],
			'meta'                => [
				'show_in_rest' => true,
				'annotations'  => [
					'readonly'    => false,
					// We can't claim this is truly non-destructive because technically there can be data deletions.
					'destructive' => null,
					'idempotent'  => true,
				],
				'mcp'          => [
					'public' => true,
				],
			],
		];
	}

	/**
	 * Executes the ability: updates the term SEO data and, on the free plugin, adds the
	 * AI Generate hint to the response when a field AI Generate can write was set.
	 *
	 * @param array<string, int|string|bool|null> $input The input identifying the term plus the SEO fields to change.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The updated SEO data, or an error.
	 */
	public function execute( array $input ) {
		return $this->ai_generate_upsell->add_hint( $this->term_seo_data_updater->update_term_seo_data( $input ), $input );
	}

	/**
	 * Returns the input schema for updating a term's SEO data (write path).
	 *
	 * @return array<string, mixed> The input schema.
	 */
	private function get_update_term_seo_data_input_schema(): array {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'term_id'                => [
					'type'        => 'integer',
					'description' => \__( 'The ID of the term to update.', 'wordpress-seo' ),
					'minimum'     => 1,
				],
				'permalink'              => [
					'type'        => 'string',
					'description' => \__( 'The permalink (URL) of the term archive to update.', 'wordpress-seo' ),
				],
				'seo_title'              => $this->ai_generate_field_schema( \__( 'SEO title', 'wordpress-seo' ) ),
				'meta_description'       => $this->ai_generate_field_schema( \__( 'meta description', 'wordpress-seo' ) ),
				'canonical'              => [
					'type'        => [ 'string', 'null' ],
					'description' => \__( 'The custom canonical URL for the term archive. Use null or an empty string to remove it and fall back to the default canonical.', 'wordpress-seo' ),
				],
				'is_cornerstone'         => [
					'type'        => 'boolean',
					'description' => \__( 'Whether the term is marked as cornerstone content.', 'wordpress-seo' ),
				],
				'noindex'                => [
					'type'        => [ 'boolean', 'null' ],
					'description' => \__( 'Whether search engines should be told not to index this term archive. true sets noindex (the archive is excluded from search results); false forces the archive to be indexed; null clears the setting and falls back to the taxonomy default.', 'wordpress-seo' ),
				],
				'open_graph_title'       => $this->ai_generate_field_schema( \__( 'Open Graph title', 'wordpress-seo' ) ),
				'open_graph_description' => $this->ai_generate_field_schema( \__( 'Open Graph description', 'wordpress-seo' ) ),
				'twitter_title'          => $this->ai_generate_field_schema( \__( 'X title', 'wordpress-seo' ) ),
				'twitter_description'    => $this->ai_generate_field_schema( \__( 'X description', 'wordpress-seo' ) ),
			],
		];
	}

	/**
	 * Returns the input schema for a nullable string field that AI Generate can also write,
	 * such as the SEO title or the social titles and descriptions.
	 *
	 * @param string $field The human-readable field name.
	 *
	 * @return array<string, mixed> The input schema fragment.
	 */
	private function ai_generate_field_schema( string $field ): array {
		return [
			'type'        => [ 'string', 'null' ],
			'description' => \sprintf(
				/* translators: %s expands to the name of the SEO field, e.g. "SEO title". */
				\__( 'The %s for the term.', 'wordpress-seo' ),
				$field,
			),
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
