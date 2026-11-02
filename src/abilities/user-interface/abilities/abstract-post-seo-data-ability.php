<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

/**
 * Base class for the abilities that read or write the SEO data of a post.
 *
 * @TODO: Deprecate in favour of SEO_Data_Output_Schema, as the term abilities already do. Add a get_post_output_schema()
 *        built on its shared properties, inject it into the post abilities and have them extend Abstract_SEO_Data_Ability.
 */
abstract class Abstract_Post_SEO_Data_Ability extends Abstract_SEO_Data_Ability {

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
