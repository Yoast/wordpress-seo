<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use WPSEO_Rank;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Surfaces\Values\Meta;

/**
 * Translates between the ability input, an indexable, and the post SEO data value object.
 *
 * This is the single source of truth for the field contract shared by the read
 * (collector) and write (updater) abilities. The write path applies the input
 * onto an indexable; persistence to post meta is delegated to
 * Indexable_To_Postmeta_Helper so the encodings live in one place. The same definitions 
 * drive both the ability input schema and the write.
 */
class Post_SEO_Field_Map {

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
	 * Maps the boolean input fields to the indexable column they write to.
	 *
	 * Excludes `noindex`, which is tri-state (null resets to the default) and is
	 * handled separately.
	 *
	 * @var array<string, string>
	 */
	private const BOOLEAN_FIELDS = [
		'is_cornerstone' => 'is_cornerstone',
		'nofollow'       => 'is_robots_nofollow',
		'noimageindex'   => 'is_robots_noimageindex',
		'noarchive'      => 'is_robots_noarchive',
		'nosnippet'      => 'is_robots_nosnippet',
	];

	/**
	 * The meta surface.
	 *
	 * @var Meta_Surface
	 */
	private $meta_surface;

	/**
	 * Constructor.
	 *
	 * @param Meta_Surface $meta_surface The meta surface.
	 */
	public function __construct( Meta_Surface $meta_surface ) {
		$this->meta_surface = $meta_surface;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the string fields editable through the update post SEO data ability.
	 *
	 * Each definition maps the ability input field name to the indexable column the
	 * value is written to and the JSON-schema fragment describing the field in the
	 * ability input schema. Keeping both in one definition means a field is only
	 * accepted by the input schema when the write path also knows how to apply it,
	 * so the two cannot drift apart.
	 *
	 * @return array<string, array<string, mixed>> The field definitions, keyed by input field name.
	 */
	public function get_editable_string_fields(): array {
		$fields = [
			'canonical'           => [
				'column' => 'canonical',
				'schema' => [ 'type' => [ 'string', 'null' ] ],
			],
			'schema_page_type'    => [
				'column' => 'schema_page_type',
				'schema' => $this->nullable_enum_schema(
					\array_keys( Schema_Types::PAGE_TYPES ),
					\__( 'The Schema.org page type for the post. Must be one of the supported page types. Use null to clear it and fall back to the default.', 'wordpress-seo' ),
				),
			],
			'schema_article_type' => [
				'column' => 'schema_article_type',
				'schema' => $this->nullable_enum_schema(
					$this->get_schema_article_types(),
					\__( 'The Schema.org article type for the post. Must be one of the supported article types. Use null to clear it and fall back to the default.', 'wordpress-seo' ),
				),
			],
		];

		/**
		 * Filter: 'wpseo_editable_post_seo_data_string_fields' - Allows adding string fields to the
		 * ones editable through the update post SEO data ability.
		 *
		 * Each entry is keyed by the ability input field name and defines both the indexable column
		 * the value is written to ('column') and the JSON-schema fragment describing the field in
		 * the ability input schema ('schema'). Entries missing either part, or keyed by a reserved
		 * input field name, are discarded.
		 *
		 * @param array<string, array<string, mixed>> $fields The editable string field definitions.
		 */
		$filtered = \apply_filters( 'wpseo_editable_post_seo_data_string_fields', $fields );

		if ( ! \is_array( $filtered ) ) {
			return $fields;
		}

		return \array_filter( $filtered, [ $this, 'is_valid_string_field' ], \ARRAY_FILTER_USE_BOTH );
	}

	/**
	 * Checks whether a filtered field definition is usable.
	 *
	 * Guards the schema and write paths against malformed filter additions: an entry is
	 * only kept when it targets a non-reserved input field and defines both the indexable
	 * column and the schema fragment.
	 *
	 * @param mixed $field     The field definition to check.
	 * @param mixed $input_key The input field name the definition is keyed by.
	 *
	 * @return bool Whether the definition is usable.
	 */
	private function is_valid_string_field( $field, $input_key ): bool {
		if ( ! \is_string( $input_key ) || $input_key === '' ) {
			return false;
		}

		// Never let a filtered definition hijack the post identifiers or the non-string fields.
		$reserved = \array_merge( [ 'post_id', 'permalink', 'noindex' ], \array_keys( self::BOOLEAN_FIELDS ) );
		if ( \in_array( $input_key, $reserved, true ) ) {
			return false;
		}

		return \is_array( $field )
			&& isset( $field['column'] ) && \is_string( $field['column'] ) && $field['column'] !== ''
			&& isset( $field['schema'] ) && \is_array( $field['schema'] ) && $field['schema'] !== [];
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

	/**
	 * Builds the post SEO data array from an indexable.
	 *
	 * Alongside the raw stored fields, each rendered companion (`*_rendered`)
	 * carries the value as it is actually output on the front end: the global
	 * default template is applied where no custom value is set, and replacement
	 * variables are expanded.
	 *
	 * @param Indexable $indexable The indexable to read from.
	 *
	 * @return array<string, int|string|bool|null> The post SEO data, keyed by output-schema property name.
	 */
	public function to_seo_array( $indexable ): array {
		$meta = $this->meta_surface->for_indexable( $indexable, 'Post_Type' );

		return [
			'post_id'                         => (int) $indexable->object_id,
			'post_title'                      => $indexable->breadcrumb_title,
			'permalink'                       => $indexable->permalink,
			'post_type'                       => $indexable->object_sub_type,
			'post_status'                     => $indexable->post_status,
			'seo_title'                       => $indexable->title,
			'seo_title_rendered'              => $this->rendered( $meta, 'seo_title' ),
			'meta_description'                => $indexable->description,
			'meta_description_rendered'       => $this->rendered( $meta, 'meta_description' ),
			'focus_keyphrase'                 => $indexable->primary_focus_keyword,
			'canonical'                       => $indexable->canonical,
			'canonical_rendered'              => $this->rendered( $meta, 'canonical' ),
			'is_cornerstone'                  => (bool) $indexable->is_cornerstone,
			'noindex'                         => $indexable->is_robots_noindex,
			'nofollow'                        => (bool) $indexable->is_robots_nofollow,
			'noimageindex'                    => (bool) $indexable->is_robots_noimageindex,
			'noarchive'                       => (bool) $indexable->is_robots_noarchive,
			'nosnippet'                       => (bool) $indexable->is_robots_nosnippet,
			'open_graph_title'                => $indexable->open_graph_title,
			'open_graph_title_rendered'       => $this->rendered( $meta, 'open_graph_title' ),
			'open_graph_description'          => $indexable->open_graph_description,
			'open_graph_description_rendered' => $this->rendered( $meta, 'open_graph_description' ),
			'twitter_title'                   => $indexable->twitter_title,
			'twitter_title_rendered'          => $this->rendered( $meta, 'twitter_title' ),
			'twitter_description'             => $indexable->twitter_description,
			'twitter_description_rendered'    => $this->rendered( $meta, 'twitter_description' ),
			'schema_page_type'                => $indexable->schema_page_type,
			'schema_article_type'             => $indexable->schema_article_type,
			'seo_score'                       => WPSEO_Rank::from_numeric_score( (int) $indexable->primary_focus_keyword_score )->get_rank(),
			'readability_score'               => WPSEO_Rank::from_numeric_score( (int) $indexable->readability_score )->get_rank(),
			// A zero score maps to NO_FOCUS ("not available") via the rank ranges, same as the scores above.
			'inclusive_language_score'        => WPSEO_Rank::from_numeric_score( (int) $indexable->inclusive_language_score )->get_rank(),
		];
	}

	/**
	 * Builds the post SEO data arrays for a set of indexables.
	 *
	 * @param Indexable[] $indexables The indexables to read from.
	 *
	 * @return array<int, array<string, int|string|bool|null>> The post SEO data for each indexable.
	 */
	public function indexables_to_arrays( array $indexables ): array {
		if ( $indexables !== [] ) {
			$object_ids = \array_map(
				static function ( $indexable ) {
					return (int) $indexable->object_id;
				},
				$indexables,
			);

			// Prime the post cache in one query, so each presentation build below reads its post from cache instead of issuing its own query.
			\_prime_post_caches( $object_ids, false, false );
		}

		return \array_map( [ $this, 'to_seo_array' ], $indexables );
	}

	/**
	 * Returns the front-end output for a rendered field, or null when nothing is output.
	 *
	 * @param Meta|false $meta         The meta values for the post, or false when unavailable.
	 * @param string     $output_field The rendered output field name.
	 *
	 * @return string|null The rendered value, or null when empty or unavailable.
	 */
	private function rendered( $meta, string $output_field ): ?string {
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

	/**
	 * Applies a validated input patch onto an indexable.
	 *
	 * Only fields present in the input are touched (patch semantics); a present but
	 * empty/null value clears the field by setting its column to null. The mutated
	 * indexable is the desired state, which the caller cascades to post meta. Flags
	 * left out of the patch keep their current value, so advanced-robots flags merge
	 * for free.
	 *
	 * @param array<string, int|string|bool|null> $input     The validated input patch.
	 * @param Indexable                           $indexable The indexable to mutate.
	 *
	 * @return array<string> The indexable columns the patch touched, so the caller can cascade
	 *                       only those to post meta.
	 */
	public function apply_to_indexable( array $input, Indexable $indexable ): array {
		$changed_columns = [];

		foreach ( $this->get_editable_string_fields() as $input_key => $field ) {
			if ( \array_key_exists( $input_key, $input ) ) {
				$value                = $input[ $input_key ];
				$column               = $field['column'];
				$indexable->{$column} = ( $value === null || $value === '' ) ? null : (string) $value;
				$changed_columns[]    = $column;
			}
		}

		foreach ( self::BOOLEAN_FIELDS as $input_key => $column ) {
			if ( \array_key_exists( $input_key, $input ) ) {
				$indexable->{$column} = (bool) $input[ $input_key ];
				$changed_columns[]    = $column;
			}
		}

		if ( \array_key_exists( 'noindex', $input ) ) {
			// Tri-state: null resets to the post-type default, true = noindex, false = index.
			$indexable->is_robots_noindex = ( $input['noindex'] === null ) ? null : (bool) $input['noindex'];
			$changed_columns[]            = 'is_robots_noindex';
		}

		return $changed_columns;
	}
}
