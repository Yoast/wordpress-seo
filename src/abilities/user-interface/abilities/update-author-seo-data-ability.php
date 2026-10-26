<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Author_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that updates the SEO data of a single author archive.
 */
class Update_Author_SEO_Data_Ability extends Abstract_SEO_Data_Ability {

	/**
	 * The author SEO data updater.
	 *
	 * @var Author_SEO_Data_Updater
	 */
	private $author_seo_data_updater;

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
	 * @param Author_SEO_Data_Updater             $author_seo_data_updater             The author SEO data updater.
	 * @param SEO_Data_Output_Schema              $output_schema                       The SEO data output schema.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional,
		Author_SEO_Data_Updater $author_seo_data_updater,
		SEO_Data_Output_Schema $output_schema
	) {
		parent::__construct( $capability_helper, $should_index_indexables_conditional );

		$this->author_seo_data_updater = $author_seo_data_updater;
		$this->output_schema           = $output_schema;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/update-author-seo-data';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => \__( 'Update Author SEO Data', 'wordpress-seo' ),
			'description'         => \__( 'Update the SEO data for the author archive of a single user: its SEO title, meta description and whether search engines are told not to index it. Identify the user by user_id or by the permalink (URL) of their author archive. Only the fields you provide are changed; a provided empty value clears that field. Provide only the identifier to get the current values without changing anything. Only users the current user is allowed to edit can be updated.', 'wordpress-seo' ),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => $this->get_update_author_seo_data_input_schema(),
			'output_schema'       => $this->output_schema->get_author_output_schema(),
			'permission_callback' => [ $this, 'can_edit_advanced_metadata' ],
			'execute_callback'    => [ $this->author_seo_data_updater, 'update_author_seo_data' ],
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
	 * Returns the input schema for updating the SEO data of an author archive (write path).
	 *
	 * @return array<string, mixed> The input schema.
	 */
	private function get_update_author_seo_data_input_schema(): array {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'user_id'          => [
					'type'        => 'integer',
					'description' => \__( 'The ID of the user whose author archive to update.', 'wordpress-seo' ),
					'minimum'     => 1,
				],
				'permalink'        => [
					'type'        => 'string',
					'description' => \__( 'The permalink (URL) of the author archive to update.', 'wordpress-seo' ),
				],
				'seo_title'        => [
					'type'        => [ 'string', 'null' ],
					'description' => \__( 'The SEO title for the author archive.', 'wordpress-seo' ),
				],
				'meta_description' => [
					'type'        => [ 'string', 'null' ],
					'description' => \__( 'The meta description for the author archive.', 'wordpress-seo' ),
				],
				'noindex'          => [
					'type'        => 'boolean',
					'description' => \__( 'Whether search engines should be told not to index this author archive. true sets noindex (the archive is excluded from search results); false removes it. When the site settings set all author archives to noindex, that setting applies regardless of this one. This changes whether the archive can appear in search results, so confirm it with the user before saving.', 'wordpress-seo' ),
				],
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
