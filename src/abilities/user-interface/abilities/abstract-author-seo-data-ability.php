<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Base class for the abilities that read or write the SEO data of an author archive.
 */
abstract class Abstract_Author_SEO_Data_Ability extends Abstract_SEO_Data_Ability {

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
	 * @param SEO_Data_Output_Schema              $output_schema                       The SEO data output schema.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional,
		SEO_Data_Output_Schema $output_schema
	) {
		parent::__construct( $capability_helper, $should_index_indexables_conditional );

		$this->output_schema = $output_schema;
	}

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	abstract protected function get_slug(): string;

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

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the input schema properties, including the user_id and permalink that identify the author.
	 *
	 * @return array<string, array<string, mixed>> The input schema properties.
	 */
	abstract protected function get_input_properties(): array;

	/**
	 * Returns the annotations that describe the behavior of the ability.
	 *
	 * @return array<string, bool|null> The annotations.
	 */
	abstract protected function get_annotations(): array;

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/' . $this->get_slug();
	}

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
				'properties'           => $this->get_input_properties(),
			],
			'output_schema'       => $this->output_schema->get_author_output_schema(),
			'permission_callback' => [ $this, 'can_edit_users_advanced_metadata' ],
			'execute_callback'    => $this->get_execute_callback(),
			'meta'                => [
				'show_in_rest' => true,
				'annotations'  => $this->get_annotations(),
				'mcp'          => [
					'public' => true,
				],
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Checks whether the current user can edit the advanced SEO metadata of other users.
	 *
	 * The user profile only shows these fields to users who can edit users, so this keeps the abilities away from
	 * users who could never use them. The capability helper is not used for edit_users, as it lets SEO managers pass.
	 *
	 * @return bool Whether the current user can edit the advanced SEO metadata of other users.
	 */
	public function can_edit_users_advanced_metadata(): bool {
		return $this->can_edit_advanced_metadata() && \current_user_can( 'edit_users' );
	}
}
