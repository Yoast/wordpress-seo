<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Author_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that returns the SEO data of a single author archive.
 */
class Get_Author_SEO_Data_Ability extends Abstract_Author_SEO_Data_Ability {

	/**
	 * The author SEO data collector.
	 *
	 * @var Author_SEO_Data_Collector
	 */
	private $author_seo_data_collector;

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
	 * @param Author_SEO_Data_Collector           $author_seo_data_collector           The author SEO data collector.
	 * @param SEO_Data_Output_Schema              $output_schema                       The SEO data output schema.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional,
		Author_SEO_Data_Collector $author_seo_data_collector,
		SEO_Data_Output_Schema $output_schema
	) {
		parent::__construct( $capability_helper, $should_index_indexables_conditional );

		$this->author_seo_data_collector = $author_seo_data_collector;
		$this->output_schema             = $output_schema;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-author-seo-data';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => \__( 'Get Author SEO Data', 'wordpress-seo' ),
			'description'         => \__( 'Get the SEO data for the author archive of a single user. Identify the user by user_id or by the permalink (URL) of their author archive. Only users who can edit other users can use this, and only on users they are allowed to edit.', 'wordpress-seo' ),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => $this->get_author_identifier_input_schema(),
			'output_schema'       => $this->output_schema->get_author_output_schema(),
			'permission_callback' => [ $this, 'can_edit_users_advanced_metadata' ],
			'execute_callback'    => [ $this->author_seo_data_collector, 'get_author_seo_data' ],
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
	 * Returns the input schema for identifying an author (read path).
	 *
	 * @return array<string, mixed> The input schema.
	 */
	private function get_author_identifier_input_schema(): array {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'user_id'   => [
					'type'        => 'integer',
					'description' => \__( 'The ID of the user whose author archive to retrieve.', 'wordpress-seo' ),
					'minimum'     => 1,
				],
				'permalink' => [
					'type'        => 'string',
					'description' => \__( 'The permalink (URL) of the author archive to retrieve.', 'wordpress-seo' ),
				],
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
