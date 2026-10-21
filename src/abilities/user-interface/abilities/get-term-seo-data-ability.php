<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Term_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that returns the SEO data of a single term.
 */
class Get_Term_SEO_Data_Ability extends Abstract_SEO_Data_Ability {

	/**
	 * The term SEO data collector.
	 *
	 * @var Term_SEO_Data_Collector
	 */
	private $term_seo_data_collector;

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
	 * @param Term_SEO_Data_Collector             $term_seo_data_collector             The term SEO data collector.
	 * @param SEO_Data_Output_Schema              $output_schema                       The SEO data output schema.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional,
		Term_SEO_Data_Collector $term_seo_data_collector,
		SEO_Data_Output_Schema $output_schema
	) {
		parent::__construct( $capability_helper, $should_index_indexables_conditional );

		$this->term_seo_data_collector = $term_seo_data_collector;
		$this->output_schema           = $output_schema;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-term-seo-data';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => \__( 'Get Term SEO Data', 'wordpress-seo' ),
			'description'         => \__( 'Get the SEO data for a single taxonomy term, such as a category or a tag. Identify the term by term_id or by permalink (URL). Only terms the current user is allowed to edit are returned.', 'wordpress-seo' ),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => $this->get_term_identifier_input_schema(),
			'output_schema'       => $this->output_schema->get_term_output_schema(),
			'permission_callback' => [ $this, 'can_edit_advanced_metadata' ],
			'execute_callback'    => [ $this->term_seo_data_collector, 'get_term_seo_data' ],
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
	 * Returns the input schema for identifying a term (read path).
	 *
	 * @return array<string, mixed> The input schema.
	 */
	private function get_term_identifier_input_schema(): array {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'term_id'   => [
					'type'        => 'integer',
					'description' => \__( 'The ID of the term to retrieve.', 'wordpress-seo' ),
					'minimum'     => 1,
				],
				'permalink' => [
					'type'        => 'string',
					'description' => \__( 'The permalink (URL) of the term archive to retrieve.', 'wordpress-seo' ),
				],
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
