<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use WPSEO_Taxonomy_Meta;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Cascades indexable columns to the term SEO meta, the source of truth for terms.
 *
 * Term SEO data lives in the wpseo_taxonomy_meta option. Its validation rebuilds the
 * stored meta from the defaults, dropping any key not passed in, so a patch has to be
 * merged onto the full stored meta before it is saved.
 */
class Term_SEO_Meta_Writer {

	/**
	 * Maps the writable indexable columns to their term meta key.
	 *
	 * @var array<string, string>
	 */
	private const COLUMN_META_KEYS = [
		'title'                  => 'wpseo_title',
		'description'            => 'wpseo_desc',
		'canonical'              => 'wpseo_canonical',
		'open_graph_title'       => 'wpseo_opengraph-title',
		'open_graph_description' => 'wpseo_opengraph-description',
		'twitter_title'          => 'wpseo_twitter-title',
		'twitter_description'    => 'wpseo_twitter-description',
		'is_cornerstone'         => 'wpseo_is_cornerstone',
		'is_robots_noindex'      => 'wpseo_noindex',
	];

	/**
	 * Writes the given columns of a term indexable to the term meta.
	 *
	 * @param Indexable     $indexable The term indexable holding the desired state.
	 * @param array<string> $columns   The indexable columns to write.
	 *
	 * @return bool Whether the term meta could be written.
	 */
	public function write_columns( Indexable $indexable, array $columns ): bool {
		$term_id  = (int) $indexable->object_id;
		$taxonomy = (string) $indexable->object_sub_type;
		$meta     = $this->get_stored_meta( $term_id, $taxonomy );

		if ( ! \is_array( $meta ) ) {
			return false;
		}

		foreach ( $columns as $column ) {
			if ( isset( self::COLUMN_META_KEYS[ $column ] ) ) {
				$meta[ self::COLUMN_META_KEYS[ $column ] ] = $this->to_meta_value( $column, $indexable->{$column} );
			}
		}

		$this->save_meta( $term_id, $taxonomy, $meta );

		return true;
	}

	/**
	 * Returns the full stored term meta, merged with the defaults.
	 *
	 * @param int    $term_id  The term ID.
	 * @param string $taxonomy The taxonomy of the term.
	 *
	 * @return array<string, string>|false The stored term meta, or false when the term does not exist.
	 */
	protected function get_stored_meta( int $term_id, string $taxonomy ) {
		return WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $taxonomy );
	}

	/**
	 * Validates and saves the full term meta, through the same validation as the term editor.
	 *
	 * @param int                   $term_id  The term ID.
	 * @param string                $taxonomy The taxonomy of the term.
	 * @param array<string, string> $meta     The full term meta.
	 *
	 * @return void
	 */
	protected function save_meta( int $term_id, string $taxonomy, array $meta ): void {
		WPSEO_Taxonomy_Meta::set_values( $term_id, $taxonomy, $meta );
	}

	/**
	 * Encodes an indexable column value the way the term meta stores it.
	 *
	 * @param string           $column The indexable column.
	 * @param string|bool|null $value  The column value.
	 *
	 * @return string The term meta value.
	 */
	private function to_meta_value( string $column, $value ): string {
		if ( $column === 'is_robots_noindex' ) {
			if ( $value === null ) {
				return 'default';
			}

			return ( $value ) ? 'noindex' : 'index';
		}

		if ( $column === 'is_cornerstone' ) {
			return ( $value ) ? '1' : '0';
		}

		return (string) $value;
	}
}
