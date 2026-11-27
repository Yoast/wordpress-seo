<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Author_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that updates the SEO data of a single author archive.
 */
class Update_Author_SEO_Data_Ability extends Abstract_Author_SEO_Data_Ability {

	/**
	 * The author SEO data updater.
	 *
	 * @var Author_SEO_Data_Updater
	 */
	private $author_seo_data_updater;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                   $capability_helper                   The capability helper.
	 * @param Should_Index_Indexables_Conditional $should_index_indexables_conditional The should index indexables conditional.
	 * @param SEO_Data_Output_Schema              $output_schema                       The SEO data output schema.
	 * @param Author_SEO_Data_Updater             $author_seo_data_updater             The author SEO data updater.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional,
		SEO_Data_Output_Schema $output_schema,
		Author_SEO_Data_Updater $author_seo_data_updater
	) {
		parent::__construct( $capability_helper, $should_index_indexables_conditional, $output_schema );

		$this->author_seo_data_updater = $author_seo_data_updater;
	}

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'update-author-seo-data';
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Update Author SEO Data', 'wordpress-seo' );
	}

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	protected function get_description(): string {
		return \__( 'Update the SEO data for the author archive of a single user. Identify the user by user_id or by the permalink (URL) of their author archive. Only the fields you provide are changed; a provided empty value clears that field. Only users who can edit other users can use this, and only on users they are allowed to edit.', 'wordpress-seo' );
	}

	/**
	 * Returns the callback that executes the ability.
	 *
	 * @return array<int, object|string> The execute callback.
	 */
	protected function get_execute_callback(): array {
		return [ $this->author_seo_data_updater, 'update_author_seo_data' ];
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the input schema properties: the author identifiers and the writable fields.
	 *
	 * @return array<string, array<string, mixed>> The input schema properties.
	 */
	protected function get_input_properties(): array {
		return [
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
				'description' => \__( 'Whether search engines should be told not to index this author archive. true sets noindex (the archive is excluded from search results); false removes it. When the site settings set all author archives to noindex, that setting applies regardless of this one.', 'wordpress-seo' ),
			],
		];
	}

	/**
	 * Returns the annotations that describe the behavior of the ability.
	 *
	 * @return array<string, bool|null> The annotations.
	 */
	protected function get_annotations(): array {
		return [
			'readonly'    => false,
			// We can't claim this is truly non-destructive because technically there can be data deletions.
			'destructive' => null,
			'idempotent'  => true,
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
