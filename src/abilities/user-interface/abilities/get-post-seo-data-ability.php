<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that returns the SEO data of one or more posts.
 */
class Get_Post_SEO_Data_Ability extends Abstract_Post_SEO_Data_Ability {

	/**
	 * The post SEO data collector.
	 *
	 * @var Post_SEO_Data_Collector
	 */
	private $post_seo_data_collector;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                   $capability_helper                   The capability helper.
	 * @param Should_Index_Indexables_Conditional $should_index_indexables_conditional The should index indexables conditional.
	 * @param Post_SEO_Data_Collector             $post_seo_data_collector             The post SEO data collector.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional,
		Post_SEO_Data_Collector $post_seo_data_collector
	) {
		parent::__construct( $capability_helper, $should_index_indexables_conditional );

		$this->post_seo_data_collector = $post_seo_data_collector;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-post-seo-data';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => \__( 'Get Post SEO Data', 'wordpress-seo' ),
			'description'         => \__( 'Get the SEO data for a post. Identify the post by post_id, by permalink (URL), or by title keywords; the title may be a comma-separated list and returns the SEO data for every post matching any of the values, paginated most recently modified first (use the page parameter to reach older matches). At least one identifier is required. Only posts the current user is allowed to edit are returned.', 'wordpress-seo' ),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => $this->get_post_identifier_input_schema(),
			'output_schema'       => [
				'type'  => 'array',
				'items' => $this->get_post_seo_data_output_schema(),
			],
			'permission_callback' => [ $this, 'can_edit_advanced_metadata' ],
			'execute_callback'    => [ $this->post_seo_data_collector, 'get_post_seo_data' ],
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

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
