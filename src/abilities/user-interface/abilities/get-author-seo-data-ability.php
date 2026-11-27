<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Author_SEO_Data_Collector;
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
	 * Constructor.
	 *
	 * @param Capability_Helper                   $capability_helper                   The capability helper.
	 * @param Should_Index_Indexables_Conditional $should_index_indexables_conditional The should index indexables conditional.
	 * @param SEO_Data_Output_Schema              $output_schema                       The SEO data output schema.
	 * @param Author_SEO_Data_Collector           $author_seo_data_collector           The author SEO data collector.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional,
		SEO_Data_Output_Schema $output_schema,
		Author_SEO_Data_Collector $author_seo_data_collector
	) {
		parent::__construct( $capability_helper, $should_index_indexables_conditional, $output_schema );

		$this->author_seo_data_collector = $author_seo_data_collector;
	}

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'get-author-seo-data';
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Get Author SEO Data', 'wordpress-seo' );
	}

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	protected function get_description(): string {
		return \__( 'Get the SEO data for the author archive of a single user. Identify the user by user_id or by the permalink (URL) of their author archive. Only users who can edit other users can use this, and only on users they are allowed to edit.', 'wordpress-seo' );
	}

	/**
	 * Returns the callback that executes the ability.
	 *
	 * @return array<int, object|string> The execute callback.
	 */
	protected function get_execute_callback(): array {
		return [ $this->author_seo_data_collector, 'get_author_seo_data' ];
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the input schema properties that identify the author.
	 *
	 * @return array<string, array<string, mixed>> The input schema properties.
	 */
	protected function get_input_properties(): array {
		return [
			'user_id'   => [
				'type'        => 'integer',
				'description' => \__( 'The ID of the user whose author archive to retrieve.', 'wordpress-seo' ),
				'minimum'     => 1,
			],
			'permalink' => [
				'type'        => 'string',
				'description' => \__( 'The permalink (URL) of the author archive to retrieve.', 'wordpress-seo' ),
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
			'readonly'    => true,
			'destructive' => false,
			'idempotent'  => true,
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
