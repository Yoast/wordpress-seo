<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

/**
 * Base class for the abilities that read or write the SEO data of a term.
 */
abstract class Abstract_Term_SEO_Data_Ability extends Abstract_SEO_Data_Ability {

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the output schema describing a term's SEO data.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	protected function get_term_seo_data_output_schema(): array {
		$nullable_string = [
			'type' => [ 'string', 'null' ],
		];
		$score           = static function ( $analysis ) {
			return [
				'type'        => 'string',
				'enum'        => [ 'na', 'bad', 'ok', 'good' ],
				'description' => \sprintf(
					/* translators: %s expands to the name of the analysis, e.g. "SEO analysis". */
					\__( 'The result of the %s that ran on the term when it was last saved.', 'wordpress-seo' ),
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

		// The raw side of a rendered pair carries the stored per-term value; null means "no custom value set", not "nothing is output".
		$raw = static function ( $field ) {
			return [
				'type'        => [ 'string', 'null' ],
				'description' => \sprintf(
					/* translators: %s expands to the name of the SEO field, e.g. "SEO title". */
					\__( 'The custom %s as stored for the term, which may contain unexpanded replacement variables. Null when no custom value is set; the rendered companion field carries what is actually output.', 'wordpress-seo' ),
					$field,
				),
			];
		};

		return [
			'type'       => 'object',
			'properties' => [
				'term_id'                         => [ 'type' => 'integer' ],
				'term_name'                       => $nullable_string,
				'permalink'                       => $nullable_string,
				'taxonomy'                        => [ 'type' => 'string' ],
				'seo_title'                       => $raw( \__( 'SEO title', 'wordpress-seo' ) ),
				'seo_title_rendered'              => $rendered( \__( 'SEO title', 'wordpress-seo' ) ),
				'meta_description'                => $raw( \__( 'meta description', 'wordpress-seo' ) ),
				'meta_description_rendered'       => $rendered( \__( 'meta description', 'wordpress-seo' ) ),
				'focus_keyphrase'                 => $nullable_string,
				'canonical'                       => [
					'type'        => [ 'string', 'null' ],
					'description' => \__( 'The custom canonical URL as stored for the term. Null when no custom value is set; the rendered companion field carries what is actually output.', 'wordpress-seo' ),
				],
				'canonical_rendered'              => [
					'type'        => [ 'string', 'null' ],
					'description' => \__( 'The canonical URL as output on the front end: the custom value when set, otherwise the permalink of the term. Null when nothing is output.', 'wordpress-seo' ),
				],
				'is_cornerstone'                  => [ 'type' => 'boolean' ],
				'noindex'                         => [
					'type'        => [ 'boolean', 'null' ],
					'description' => \__( 'Whether search engines are told not to index this term archive. true means noindex (the archive is excluded from search results); false means the archive is forced to be indexed; null means no setting is stored and the taxonomy default applies.', 'wordpress-seo' ),
				],
				'open_graph_title'                => $raw( \__( 'Open Graph title', 'wordpress-seo' ) ),
				'open_graph_title_rendered'       => $rendered( \__( 'Open Graph title', 'wordpress-seo' ) ),
				'open_graph_description'          => $raw( \__( 'Open Graph description', 'wordpress-seo' ) ),
				'open_graph_description_rendered' => $rendered( \__( 'Open Graph description', 'wordpress-seo' ) ),
				'twitter_title'                   => $raw( \__( 'X title', 'wordpress-seo' ) ),
				'twitter_title_rendered'          => $rendered( \__( 'X title', 'wordpress-seo' ) ),
				'twitter_description'             => $raw( \__( 'X description', 'wordpress-seo' ) ),
				'twitter_description_rendered'    => $rendered( \__( 'X description', 'wordpress-seo' ) ),
				'seo_score'                       => $score( \__( 'SEO analysis', 'wordpress-seo' ) ),
				'readability_score'               => $score( \__( 'readability analysis', 'wordpress-seo' ) ),
				'inclusive_language_score'        => $score( \__( 'inclusive language analysis', 'wordpress-seo' ) ),
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
