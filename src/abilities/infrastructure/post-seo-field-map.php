<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use WPSEO_Rank;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Surfaces\Values\Meta;

/**
 * Translates between the ability input, an indexable, and the post SEO data value object.
 *
 * This is the single source of truth for the field contract shared by the read
 * (collector) and write (updater) abilities. The write path applies the input
 * onto an indexable; persistence to post meta is delegated to
 * Indexable_To_Postmeta_Helper so the encodings live in one place.
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
	 * Maps the string input fields to the indexable column they write to.
	 *
	 * @var array<string, string>
	 */
	private const STRING_FIELDS = [
		'seo_title'              => 'title',
		'meta_description'       => 'description',
		'focus_keyphrase'        => 'primary_focus_keyword',
		'canonical'              => 'canonical',
		'open_graph_title'       => 'open_graph_title',
		'open_graph_description' => 'open_graph_description',
		'twitter_title'          => 'twitter_title',
		'twitter_description'    => 'twitter_description',
		'schema_page_type'       => 'schema_page_type',
		'schema_article_type'    => 'schema_article_type',
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

		foreach ( self::STRING_FIELDS as $input_key => $column ) {
			if ( \array_key_exists( $input_key, $input ) ) {
				$value                = $input[ $input_key ];
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
