<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Base class for the abilities that read or write the SEO data of a post.
 */
abstract class Abstract_Post_SEO_Data_Ability implements Ability_Interface {

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The should index indexables conditional.
	 *
	 * @var Should_Index_Indexables_Conditional
	 */
	private $should_index_indexables_conditional;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                   $capability_helper                   The capability helper.
	 * @param Should_Index_Indexables_Conditional $should_index_indexables_conditional The should index indexables conditional.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional
	) {
		$this->capability_helper                   = $capability_helper;
		$this->should_index_indexables_conditional = $should_index_indexables_conditional;
	}

	/**
	 * Returns whether the ability is available: the SEO data is read from and written to the
	 * indexables, so they must be built.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		return $this->should_index_indexables_conditional->is_met();
	}

	/**
	 * Checks whether the current user can edit advanced SEO metadata.
	 *
	 * Gates the post SEO data abilities on the same capability that gates the advanced
	 * and schema fields in the editors, so the abilities can never grant a field the
	 * editor UI denies. The capability helper also passes wpseo_manage_options holders.
	 * Per-post edit access is enforced on top, in the execute callbacks.
	 *
	 * @return bool Whether the current user can edit advanced SEO metadata.
	 */
	public function can_edit_advanced_metadata(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_edit_advanced_metadata' );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the output schema describing a post's SEO data.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	protected function get_post_seo_data_output_schema(): array {
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

		// The raw side of a rendered pair carries the stored per-post value; null means "no custom value set", not "nothing is output".
		$raw = static function ( $field ) {
			return [
				'type'        => [ 'string', 'null' ],
				'description' => \sprintf(
					/* translators: %s expands to the name of the SEO field, e.g. "SEO title". */
					\__( 'The custom %s as stored for the post, which may contain unexpanded replacement variables. Null when no custom value is set; the rendered companion field carries what is actually output.', 'wordpress-seo' ),
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
				'seo_title'                       => $raw( \__( 'SEO title', 'wordpress-seo' ) ),
				'seo_title_rendered'              => $rendered( \__( 'SEO title', 'wordpress-seo' ) ),
				'meta_description'                => $raw( \__( 'meta description', 'wordpress-seo' ) ),
				'meta_description_rendered'       => $rendered( \__( 'meta description', 'wordpress-seo' ) ),
				'focus_keyphrase'                 => $nullable_string,
				'canonical'                       => [
					'type'        => [ 'string', 'null' ],
					'description' => \__( 'The custom canonical URL as stored for the post. Null when no custom value is set; the rendered companion field carries what is actually output.', 'wordpress-seo' ),
				],
				'canonical_rendered'              => [
					'type'        => [ 'string', 'null' ],
					'description' => \__( 'The canonical URL as output on the front end: the custom value when set, otherwise the permalink of the post. Null when nothing is output.', 'wordpress-seo' ),
				],
				'is_cornerstone'                  => [ 'type' => 'boolean' ],
				'noindex'                         => [
					'type'        => [ 'boolean', 'null' ],
					'description' => \__( 'Whether search engines are told not to index this post. true means noindex (the post is excluded from search results); false means the post is forced to be indexed; null means no setting is stored and the post-type default applies.', 'wordpress-seo' ),
				],
				'nofollow'                        => [ 'type' => 'boolean' ],
				'noimageindex'                    => [ 'type' => 'boolean' ],
				'noarchive'                       => [ 'type' => 'boolean' ],
				'nosnippet'                       => [ 'type' => 'boolean' ],
				'open_graph_title'                => $raw( \__( 'Open Graph title', 'wordpress-seo' ) ),
				'open_graph_title_rendered'       => $rendered( \__( 'Open Graph title', 'wordpress-seo' ) ),
				'open_graph_description'          => $raw( \__( 'Open Graph description', 'wordpress-seo' ) ),
				'open_graph_description_rendered' => $rendered( \__( 'Open Graph description', 'wordpress-seo' ) ),
				'twitter_title'                   => $raw( \__( 'X title', 'wordpress-seo' ) ),
				'twitter_title_rendered'          => $rendered( \__( 'X title', 'wordpress-seo' ) ),
				'twitter_description'             => $raw( \__( 'X description', 'wordpress-seo' ) ),
				'twitter_description_rendered'    => $rendered( \__( 'X description', 'wordpress-seo' ) ),
				'schema_page_type'                => [
					'type'        => [ 'string', 'null' ],
					'description' => \__( 'The Schema.org page type stored for the post. Null means no override is set and the default for the post type applies.', 'wordpress-seo' ),
				],
				'schema_article_type'             => [
					'type'        => [ 'string', 'null' ],
					'description' => \__( 'The Schema.org article type stored for the post. Null means no override is set and the default for the post type applies.', 'wordpress-seo' ),
				],
				'seo_score'                       => $score( \__( 'SEO analysis', 'wordpress-seo' ) ),
				'readability_score'               => $score( \__( 'readability analysis', 'wordpress-seo' ) ),
				'inclusive_language_score'        => $score( \__( 'inclusive language analysis', 'wordpress-seo' ) ),
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
