<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Services
 */

/**
 * Represents the indexable term service.
 */
class WPSEO_Indexable_Service_Term_Provider implements WPSEO_Indexable_Service_Provider {

	/**
	 * Returns an array with data for the target object.
	 *
	 * @param integer $object_id The target object id.
	 *
	 * @return array The retrieved data.
	 */
	public function get( $object_id ) {
		$term = get_term( $object_id );

		return array(
			'object_id'                   => $object_id,
			'object_type'                 => 'term',
			'object_subtype'              => $term->taxonomy,
			'permalink'                   => get_term_link( $term ),
			'canonical'                   => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'canonical' ),
			'title'                       => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'title' ),
			'description'                 => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'metadesc' ),
			'breadcrumb_title'            => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'bctitle' ),
			'og_title'                    => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'opengraph-title' ),
			'og_description'              => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'opengraph-description' ),
			'og_image'                    => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'opengraph-image' ),
			'twitter_title'               => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'twitter-title' ),
			'twitter_description'         => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'twitter-description' ),
			'twitter_image'               => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'twitter-image' ),
			'is_robots_noindex'           => WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'noindex' ),
			'is_robots_nofollow'          => null,
			'is_robots_noarchive'         => null,
			'is_robots_noimageindex'      => null,
			'is_robots_nosnippet'         => null,
			'primary_focus_keyword'       => WPSEO_Meta::get_value( 'focuskw', $object_id ),
			'primary_focus_keyword_score' => WPSEO_Meta::get_value( 'linkdex', $object_id ),
			'readability_score'           => WPSEO_Meta::get_value( 'linkdex', $object_id ),
			'is_cornerstone'              => false,
			'link_count'                  => null,
			'incoming_link_count'         => null,
			'created_at'                  => null,
			'updated_at'                  => null,
		);
	}

	/**
	 * Checks if the given object id belongs to an indexable.
	 *
	 * @param int $object_id The object id.
	 *
	 * @return bool Whether the object id is indexable.
	 */
	public function is_indexable( $object_id ) {
		return true;
	}
}
