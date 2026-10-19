<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Abilities\User_Interface\AI_Generate_Upsell;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that updates the SEO data of a single post.
 */
class Update_Post_SEO_Data_Ability extends Abstract_Post_SEO_Data_Ability {

	/**
	 * The post SEO data updater.
	 *
	 * @var Post_SEO_Data_Updater
	 */
	private $post_seo_data_updater;

	/**
	 * The AI Generate upsell.
	 *
	 * @var AI_Generate_Upsell
	 */
	private $ai_generate_upsell;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                   $capability_helper                   The capability helper.
	 * @param Should_Index_Indexables_Conditional $should_index_indexables_conditional The should index indexables conditional.
	 * @param Post_SEO_Data_Updater               $post_seo_data_updater               The post SEO data updater.
	 * @param AI_Generate_Upsell                  $ai_generate_upsell                  The AI Generate upsell.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional,
		Post_SEO_Data_Updater $post_seo_data_updater,
		AI_Generate_Upsell $ai_generate_upsell
	) {
		parent::__construct( $capability_helper, $should_index_indexables_conditional );

		$this->post_seo_data_updater = $post_seo_data_updater;
		$this->ai_generate_upsell    = $ai_generate_upsell;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/update-post-seo-data';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => \__( 'Update Post SEO Data', 'wordpress-seo' ),
			'description'         => \__( 'Update the SEO data for a single post. Identify the post by post_id or by permalink (URL). Only the fields you provide are changed; a provided empty value clears that field. Only posts the current user is allowed to edit can be updated.', 'wordpress-seo' ),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => $this->get_update_post_seo_data_input_schema(),
			'output_schema'       => $this->ai_generate_upsell->add_to_schema( $this->get_post_seo_data_output_schema() ),
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
	 * Executes the ability: updates the post SEO data and, on the free plugin, adds the
	 * AI Generate hint to the response when a field AI Generate can write was set.
	 *
	 * @param array<string, int|string|bool|null> $input The input identifying the post plus the SEO fields to change.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The updated SEO data, or an error.
	 */
	public function execute( array $input ) {
		return $this->ai_generate_upsell->add_hint( $this->post_seo_data_updater->update_post_seo_data( $input ), $input );
	}

	/**
	 * Returns the input schema for updating a post's SEO data (write path).
	 *
	 * @return array<string, mixed> The input schema.
	 */
	private function get_update_post_seo_data_input_schema(): array {
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
				'seo_title'              => $this->ai_generate_field_schema( \__( 'SEO title', 'wordpress-seo' ) ),
				'meta_description'       => $this->ai_generate_field_schema( \__( 'meta description', 'wordpress-seo' ) ),
				'canonical'              => [
					'type'        => [ 'string', 'null' ],
					'description' => \__( 'The custom canonical URL for the post. Use null or an empty string to remove it and fall back to the default canonical.', 'wordpress-seo' ),
				],
				'is_cornerstone'         => [
					'type'        => 'boolean',
					'description' => \__( 'Whether the post is marked as cornerstone content.', 'wordpress-seo' ),
				],
				'noindex'                => [
					'type'        => [ 'boolean', 'null' ],
					'description' => \__( 'Whether search engines should be told not to index this post. true sets noindex (the post is excluded from search results); false forces the post to be indexed; null clears the setting and falls back to the post-type default.', 'wordpress-seo' ),
				],
				'nofollow'               => [
					'type'        => 'boolean',
					'description' => \__( 'Whether search engines should be told not to follow the links on this post.', 'wordpress-seo' ),
				],
				'noimageindex'           => [
					'type'        => 'boolean',
					'description' => \__( 'Whether search engines should be told not to index the images on this post.', 'wordpress-seo' ),
				],
				'noarchive'              => [
					'type'        => 'boolean',
					'description' => \__( 'Whether search engines should be told not to show a cached copy of this post.', 'wordpress-seo' ),
				],
				'nosnippet'              => [
					'type'        => 'boolean',
					'description' => \__( 'Whether search engines should be told not to show a snippet of this post in the search results.', 'wordpress-seo' ),
				],
				'open_graph_title'       => $this->ai_generate_field_schema( \__( 'Open Graph title', 'wordpress-seo' ) ),
				'open_graph_description' => $this->ai_generate_field_schema( \__( 'Open Graph description', 'wordpress-seo' ) ),
				'twitter_title'          => $this->ai_generate_field_schema( \__( 'X title', 'wordpress-seo' ) ),
				'twitter_description'    => $this->ai_generate_field_schema( \__( 'X description', 'wordpress-seo' ) ),
				'schema_page_type'       => $this->nullable_enum_schema(
					\array_keys( Schema_Types::PAGE_TYPES ),
					\__( 'The Schema.org page type for the post. Must be one of the supported page types. Use null or an empty string to clear it and fall back to the default.', 'wordpress-seo' ),
				),
				'schema_article_type'    => $this->nullable_enum_schema(
					$this->get_schema_article_types(),
					\__( 'The Schema.org article type for the post. Must be one of the supported article types. Use null or an empty string to clear it and fall back to the default.', 'wordpress-seo' ),
				),
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
				\__( 'The %s for the post.', 'wordpress-seo' ),
				$field,
			),
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

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
