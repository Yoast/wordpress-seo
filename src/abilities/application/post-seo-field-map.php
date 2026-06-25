<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WPSEO_Rank;
use Yoast\WP\SEO\Abilities\Domain\Post_SEO_Data;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Surfaces\Values\Meta;

/**
 * Translates between an indexable, the post SEO data value object, and post meta operations.
 *
 * This is the single source of truth for the field contract shared by the read
 * (collector) and write (updater) abilities. The robots and advanced-robots
 * encodings mirror Indexable_To_Postmeta_Helper.
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
	 * Maps simple string input fields to their post meta key.
	 *
	 * @var array<string, string>
	 */
	private const SIMPLE_FIELDS = [
		'seo_title'              => 'title',
		'meta_description'       => 'metadesc',
		'focus_keyphrase'        => 'focuskw',
		'canonical'              => 'canonical',
		'open_graph_title'       => 'opengraph-title',
		'open_graph_description' => 'opengraph-description',
		'twitter_title'          => 'twitter-title',
		'twitter_description'    => 'twitter-description',
		'schema_page_type'       => 'schema_page_type',
		'schema_article_type'    => 'schema_article_type',
	];

	/**
	 * Maps the advanced-robots input fields to their indexable column.
	 *
	 * @var array<string, string>
	 */
	private const ADVANCED_ROBOTS_FIELDS = [
		'noimageindex' => 'is_robots_noimageindex',
		'noarchive'    => 'is_robots_noarchive',
		'nosnippet'    => 'is_robots_nosnippet',
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
	 * Builds the post SEO data value object from an indexable.
	 *
	 * Alongside the raw stored fields, each rendered companion (`*_rendered`)
	 * carries the value as it is actually output on the front end: the global
	 * default template is applied where no custom value is set, and replacement
	 * variables are expanded.
	 *
	 * @param Indexable $indexable The indexable to read from.
	 *
	 * @return Post_SEO_Data The post SEO data.
	 */
	public function to_post_seo_data( $indexable ): Post_SEO_Data {
		$meta = $this->meta_surface->for_post( (int) $indexable->object_id );

		return new Post_SEO_Data(
			[
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
				'inclusive_language_score'        => $this->inclusive_language_rank( (int) $indexable->inclusive_language_score ),
			],
		);
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
	 * Builds the list of post meta operations for a patch.
	 *
	 * Only fields present in the input are touched (patch semantics). A present
	 * but empty/null value clears the field. The current indexable is needed so a
	 * patch of one advanced-robots flag preserves the others.
	 *
	 * @param array<string, int|string|bool|null> $input   The validated input patch.
	 * @param Indexable                           $current The current indexable, used to merge advanced-robots flags.
	 *
	 * @return array<int, array<string, string|int|null>> The operations, each ['key' => string, 'action' => 'set'|'delete', 'value' => string|int|null].
	 */
	public function to_meta_operations( array $input, $current ): array {
		$operations = [];

		foreach ( self::SIMPLE_FIELDS as $input_key => $meta_key ) {
			if ( ! \array_key_exists( $input_key, $input ) ) {
				continue;
			}

			$value = $input[ $input_key ];
			if ( $value === null || $value === '' ) {
				$operations[] = $this->delete_operation( $meta_key );
			}
			else {
				$operations[] = $this->set_operation( $meta_key, (string) $value );
			}
		}

		if ( \array_key_exists( 'is_cornerstone', $input ) ) {
			if ( $input['is_cornerstone'] ) {
				$operations[] = $this->set_operation( 'is_cornerstone', '1' );
			}
			else {
				$operations[] = $this->delete_operation( 'is_cornerstone' );
			}
		}

		if ( \array_key_exists( 'noindex', $input ) ) {
			$operations[] = $this->noindex_operation( $input['noindex'] );
		}

		if ( \array_key_exists( 'nofollow', $input ) ) {
			if ( $input['nofollow'] ) {
				$operations[] = $this->set_operation( 'meta-robots-nofollow', 1 );
			}
			else {
				$operations[] = $this->delete_operation( 'meta-robots-nofollow' );
			}
		}

		$advanced_operation = $this->advanced_robots_operation( $input, $current );
		if ( $advanced_operation !== null ) {
			$operations[] = $advanced_operation;
		}

		return $operations;
	}

	/**
	 * Builds the noindex meta operation.
	 *
	 * @param bool|null $noindex The desired noindex state, or null to reset to the default.
	 *
	 * @return array<string, string|int|null> The operation.
	 */
	private function noindex_operation( $noindex ): array {
		if ( $noindex === null ) {
			return $this->delete_operation( 'meta-robots-noindex' );
		}

		// 1 means noindex, 2 means index (follow the site default off), matching the metabox encoding.
		return $this->set_operation( 'meta-robots-noindex', ( $noindex ) ? 1 : 2 );
	}

	/**
	 * Builds the advanced-robots meta operation by merging the patch over the current state.
	 *
	 * @param array<string, int|string|bool|null> $input   The validated input patch.
	 * @param Indexable                           $current The current indexable.
	 *
	 * @return array<string, string|int|null>|null The operation, or null when no advanced-robots field was provided.
	 */
	private function advanced_robots_operation( array $input, $current ): ?array {
		$provided = \array_intersect_key( $input, self::ADVANCED_ROBOTS_FIELDS );
		if ( empty( $provided ) ) {
			return null;
		}

		$enabled = [];
		foreach ( self::ADVANCED_ROBOTS_FIELDS as $input_key => $indexable_column ) {
			if ( \array_key_exists( $input_key, $input ) ) {
				$is_enabled = (bool) $input[ $input_key ];
			}
			else {
				$is_enabled = (bool) $current->{$indexable_column};
			}

			if ( $is_enabled ) {
				$enabled[] = $input_key;
			}
		}

		if ( empty( $enabled ) ) {
			return $this->delete_operation( 'meta-robots-adv' );
		}

		return $this->set_operation( 'meta-robots-adv', \implode( ',', $enabled ) );
	}

	/**
	 * Returns the rank slug for an inclusive language score, treating zero as "not available".
	 *
	 * @param int $score The numeric inclusive language score.
	 *
	 * @return string The rank slug.
	 */
	private function inclusive_language_rank( int $score ): string {
		if ( $score === 0 ) {
			return WPSEO_Rank::NO_FOCUS;
		}

		return WPSEO_Rank::from_numeric_score( $score )->get_rank();
	}

	/**
	 * Builds a set operation.
	 *
	 * @param string     $key   The post meta key (without prefix).
	 * @param string|int $value The value to set.
	 *
	 * @return array<string, string|int|null> The operation.
	 */
	private function set_operation( string $key, $value ): array {
		return [
			'key'    => $key,
			'action' => 'set',
			'value'  => $value,
		];
	}

	/**
	 * Builds a delete operation.
	 *
	 * @param string $key The post meta key (without prefix).
	 *
	 * @return array<string, string|int|null> The operation.
	 */
	private function delete_operation( string $key ): array {
		return [
			'key'    => $key,
			'action' => 'delete',
			'value'  => null,
		];
	}
}
