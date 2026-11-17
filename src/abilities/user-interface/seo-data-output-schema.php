<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface;

/**
 * Builds the output schemas describing the SEO data of a single entity, such as a term.
 *
 * The SEO fields every entity type shares are described once; each entity type adds its
 * identity fields and the fields whose meaning depends on the entity type.
 */
class SEO_Data_Output_Schema {

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the output schema describing a term's SEO data.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	public function get_term_output_schema(): array {
		$nullable_string = [
			'type' => [ 'string', 'null' ],
		];

		return [
			'type'       => 'object',
			'properties' => \array_merge(
				[
					'term_id'   => [ 'type' => 'integer' ],
					'term_name' => $nullable_string,
					'permalink' => $nullable_string,
					'taxonomy'  => [ 'type' => 'string' ],
				],
				$this->get_shared_properties(),
				[
					'canonical'          => [
						'type'        => [ 'string', 'null' ],
						'description' => \__( 'The custom canonical URL as stored for the term. Null when no custom value is set; the rendered companion field carries what is actually output.', 'wordpress-seo' ),
					],
					'canonical_rendered' => [
						'type'        => [ 'string', 'null' ],
						'description' => \__( 'The canonical URL as output on the front end: the custom value when set, otherwise the permalink of the term. Null when nothing is output.', 'wordpress-seo' ),
					],
					'noindex'            => [
						'type'        => [ 'boolean', 'null' ],
						'description' => \__( 'Whether search engines are told not to index this term archive. true means noindex (the archive is excluded from search results); false means the archive is forced to be indexed; null means no setting is stored and the taxonomy default applies.', 'wordpress-seo' ),
					],
				],
			),
		];
	}

	/**
	 * Returns the properties of the SEO fields every entity type shares.
	 *
	 * The descriptions don't name the entity type, as a noun inserted into a translatable
	 * sentence can't be translated correctly.
	 *
	 * @return array<string, mixed> The shared properties, keyed by output-schema property name.
	 */
	private function get_shared_properties(): array {
		return [
			'seo_title'                       => $this->raw( \__( 'SEO title', 'wordpress-seo' ) ),
			'seo_title_rendered'              => $this->rendered( \__( 'SEO title', 'wordpress-seo' ) ),
			'meta_description'                => $this->raw( \__( 'meta description', 'wordpress-seo' ) ),
			'meta_description_rendered'       => $this->rendered( \__( 'meta description', 'wordpress-seo' ) ),
			'focus_keyphrase'                 => [ 'type' => [ 'string', 'null' ] ],
			'is_cornerstone'                  => [ 'type' => 'boolean' ],
			'open_graph_title'                => $this->raw( \__( 'Open Graph title', 'wordpress-seo' ) ),
			'open_graph_title_rendered'       => $this->rendered( \__( 'Open Graph title', 'wordpress-seo' ) ),
			'open_graph_description'          => $this->raw( \__( 'Open Graph description', 'wordpress-seo' ) ),
			'open_graph_description_rendered' => $this->rendered( \__( 'Open Graph description', 'wordpress-seo' ) ),
			'twitter_title'                   => $this->raw( \__( 'X title', 'wordpress-seo' ) ),
			'twitter_title_rendered'          => $this->rendered( \__( 'X title', 'wordpress-seo' ) ),
			'twitter_description'             => $this->raw( \__( 'X description', 'wordpress-seo' ) ),
			'twitter_description_rendered'    => $this->rendered( \__( 'X description', 'wordpress-seo' ) ),
			'seo_score'                       => $this->score( \__( 'SEO analysis', 'wordpress-seo' ) ),
			'readability_score'               => $this->score( \__( 'readability analysis', 'wordpress-seo' ) ),
			'inclusive_language_score'        => $this->score( \__( 'inclusive language analysis', 'wordpress-seo' ) ),
		];
	}

	/**
	 * Returns the property of a stored field.
	 *
	 * Null means "no custom value set", not "nothing is output".
	 *
	 * @param string $field The human-readable field name.
	 *
	 * @return array<string, mixed> The property.
	 */
	private function raw( string $field ): array {
		return [
			'type'        => [ 'string', 'null' ],
			'description' => \sprintf(
				/* translators: %s expands to the name of the SEO field, e.g. "SEO title". */
				\__( 'The custom %s as stored, which may contain unexpanded snippet variables. Null when no custom value is set; the rendered companion field carries what is actually output.', 'wordpress-seo' ),
				$field,
			),
		];
	}

	/**
	 * Returns the property of the rendered companion of a stored field.
	 *
	 * @param string $field The human-readable field name.
	 *
	 * @return array<string, mixed> The property.
	 */
	private function rendered( string $field ): array {
		return [
			'type'        => [ 'string', 'null' ],
			'description' => \sprintf(
				/* translators: %s expands to the name of the SEO field, e.g. "SEO title". */
				\__( 'The %s as output on the front end: the global default template applied when no custom value is set, with snippet variables expanded. Null when nothing is output.', 'wordpress-seo' ),
				$field,
			),
		];
	}

	/**
	 * Returns the property of an analysis score.
	 *
	 * @param string $analysis The human-readable analysis name.
	 *
	 * @return array<string, mixed> The property.
	 */
	private function score( string $analysis ): array {
		return [
			'type'        => 'string',
			'enum'        => [ 'na', 'bad', 'ok', 'good' ],
			'description' => \sprintf(
				/* translators: %s expands to the name of the analysis, e.g. "SEO analysis". */
				\__( 'The result of the %s as calculated at the last save in the editor.', 'wordpress-seo' ),
				$analysis,
			),
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
