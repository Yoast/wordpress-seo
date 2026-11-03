<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use WPSEO_Rank;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Surfaces\Values\Meta;

/**
 * Shared translation between the ability input, an indexable, and the SEO data of a single entity.
 *
 * Subclasses declare which input fields they can write and how the read output is shaped;
 * the patch semantics and the rendered-value lookup are the same for every entity type.
 */
abstract class Abstract_SEO_Field_Map {

	/**
	 * Maps each rendered output field to the Meta property holding the value as
	 * it is actually output on the front end (template applied, replacement
	 * variables expanded).
	 *
	 * @var array<string, string>
	 */
	private const RENDERED_FIELDS = [
		'seo_title'              => 'title',
		'meta_description'       => 'meta_description',
		'canonical'              => 'canonical',
		'open_graph_title'       => 'open_graph_title',
		'open_graph_description' => 'open_graph_description',
		'twitter_title'          => 'twitter_title',
		'twitter_description'    => 'twitter_description',
	];

	/**
	 * Returns the string input fields mapped to the indexable column they write to.
	 *
	 * @return array<string, string> The string fields.
	 */
	abstract protected function get_string_fields(): array;

	/**
	 * Returns the boolean input fields mapped to the indexable column they write to.
	 *
	 * Excludes `noindex`, which is tri-state (null resets to the default) and is
	 * handled separately.
	 *
	 * @return array<string, string> The boolean fields.
	 */
	abstract protected function get_boolean_fields(): array;

	/**
	 * Applies a validated input patch onto an indexable.
	 *
	 * Only fields present in the input are touched (patch semantics); a present but
	 * empty/null value clears the field by setting its column to null. The mutated
	 * indexable is the desired state, which the caller cascades to the source of truth.
	 * Flags left out of the patch keep their current value, so advanced-robots flags
	 * merge for free.
	 *
	 * @param array<string, int|string|bool|null> $input     The validated input patch.
	 * @param Indexable                           $indexable The indexable to mutate.
	 *
	 * @return array<string> The indexable columns the patch touched, so the caller can cascade
	 *                       only those.
	 */
	public function apply_to_indexable( array $input, Indexable $indexable ): array {
		$changed_columns = [];

		foreach ( $this->get_string_fields() as $input_key => $column ) {
			if ( \array_key_exists( $input_key, $input ) ) {
				$value                = $input[ $input_key ];
				$indexable->{$column} = ( $value === null || $value === '' ) ? null : (string) $value;
				$changed_columns[]    = $column;
			}
		}

		foreach ( $this->get_boolean_fields() as $input_key => $column ) {
			if ( \array_key_exists( $input_key, $input ) ) {
				$indexable->{$column} = (bool) $input[ $input_key ];
				$changed_columns[]    = $column;
			}
		}

		if ( \array_key_exists( 'noindex', $input ) ) {
			// Tri-state: null resets to the default, true = noindex, false = index.
			$indexable->is_robots_noindex = ( $input['noindex'] === null ) ? null : (bool) $input['noindex'];
			$changed_columns[]            = 'is_robots_noindex';
		}

		return $changed_columns;
	}

	/**
	 * Returns the SEO data fields every entity type shares, keyed by output-schema property name.
	 *
	 * Alongside the raw stored fields, each rendered companion (`*_rendered`)
	 * carries the value as it is actually output on the front end: the global
	 * default template is applied where no custom value is set, and replacement
	 * variables are expanded.
	 *
	 * @param Indexable  $indexable The indexable to read from.
	 * @param Meta|false $meta      The meta values for the entity, or false when unavailable.
	 *
	 * @return array<string, string|bool|null> The shared SEO data fields.
	 */
	protected function get_shared_seo_fields( $indexable, $meta ): array {
		return [
			'seo_title'                       => $indexable->title,
			'seo_title_rendered'              => $this->rendered( $meta, 'seo_title' ),
			'meta_description'                => $indexable->description,
			'meta_description_rendered'       => $this->rendered( $meta, 'meta_description' ),
			'focus_keyphrase'                 => $indexable->primary_focus_keyword,
			'canonical'                       => $indexable->canonical,
			'canonical_rendered'              => $this->rendered( $meta, 'canonical' ),
			'is_cornerstone'                  => (bool) $indexable->is_cornerstone,
			'noindex'                         => $indexable->is_robots_noindex,
			'open_graph_title'                => $indexable->open_graph_title,
			'open_graph_title_rendered'       => $this->rendered( $meta, 'open_graph_title' ),
			'open_graph_description'          => $indexable->open_graph_description,
			'open_graph_description_rendered' => $this->rendered( $meta, 'open_graph_description' ),
			'twitter_title'                   => $indexable->twitter_title,
			'twitter_title_rendered'          => $this->rendered( $meta, 'twitter_title' ),
			'twitter_description'             => $indexable->twitter_description,
			'twitter_description_rendered'    => $this->rendered( $meta, 'twitter_description' ),
			'seo_score'                       => WPSEO_Rank::from_numeric_score( (int) $indexable->primary_focus_keyword_score )->get_rank(),
			'readability_score'               => WPSEO_Rank::from_numeric_score( (int) $indexable->readability_score )->get_rank(),
			// A zero score maps to NO_FOCUS ("not available") via the rank ranges, same as the scores above.
			'inclusive_language_score'        => WPSEO_Rank::from_numeric_score( (int) $indexable->inclusive_language_score )->get_rank(),
		];
	}

	/**
	 * Returns the front-end output for a rendered field, or null when nothing is output.
	 *
	 * @param Meta|false $meta         The meta values for the entity, or false when unavailable.
	 * @param string     $output_field The rendered output field name.
	 *
	 * @return string|null The rendered value, or null when empty or unavailable.
	 */
	protected function rendered( $meta, string $output_field ): ?string {
		if ( ! $meta instanceof Meta ) {
			return null;
		}

		$value = $meta->{ self::RENDERED_FIELDS[ $output_field ] };

		// Treat an empty presented value as "nothing is output" rather than an empty string.
		if ( $value === null || $value === '' ) {
			return null;
		}

		return (string) $value;
	}
}
