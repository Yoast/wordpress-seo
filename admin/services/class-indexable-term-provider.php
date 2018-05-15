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

		if ( ! $this->is_indexable( $object_id ) ) {
			return array();
		}

		return array(
			'object_id'                   => (int) $object_id,
			'object_type'                 => 'term',
			'object_subtype'              => $term->taxonomy,
			'permalink'                   => get_term_link( $term ),
			'canonical'                   => $this->get_meta_value( 'canonical', $term ),
			'title'                       => $this->get_meta_value( 'title', $term ),
			'description'                 => $this->get_meta_value( 'desc', $term ),
			'breadcrumb_title'            => $this->get_meta_value( 'bctitle', $term ),
			'og_title'                    => $this->get_meta_value( 'opengraph-title', $term ),
			'og_description'              => $this->get_meta_value( 'opengraph-description', $term ),
			'og_image'                    => $this->get_meta_value( 'opengraph-image', $term ),
			'twitter_title'               => $this->get_meta_value( 'twitter-title', $term ),
			'twitter_description'         => $this->get_meta_value( 'twitter-description', $term ),
			'twitter_image'               => $this->get_meta_value( 'twitter-image', $term ),
			'is_robots_noindex'           => $this->get_robots_noindex_value( $this->get_meta_value( 'noindex', $term ) ),
			'is_robots_nofollow'          => null,
			'is_robots_noarchive'         => null,
			'is_robots_noimageindex'      => null,
			'is_robots_nosnippet'         => null,
			'primary_focus_keyword'       => $this->get_meta_value( 'focuskw', $term ),
			'primary_focus_keyword_score' => (int) $this->get_meta_value( 'linkdex', $term ),
			'readability_score'           => (int) $this->get_meta_value( 'content_score', $term ),
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
		$term = get_term( $object_id );

		return ( $term !== null && ! is_wp_error( $term ) );
	}

	/**
	 * Translates the meta value to a boolean value.
	 *
	 * @param string $value The value to translate.
	 *
	 * @return bool|null The translated value.
	 */
	protected function get_robots_noindex_value( $value ) {
		if ( $value === 'noindex' ) {
			return true;
		}

		if ( $value === 'index' ) {
			return false;
		}

		return null;
	}

	/**
	 * Returns the needed term meta field.
	 *
	 * @param string $field The requested field.
	 * @param mixed  $term  The term object.
	 *
	 * @return bool|mixed The value of the requested field.
	 */
	protected function get_meta_value( $field, $term ) {
		return WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, $field );
	}
}
