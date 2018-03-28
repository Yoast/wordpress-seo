<?php


class WPSEO_Indexable_Service_Post_Provider implements WPSEO_Indexable_Service_Provider {

	/**
	 * Returns an array with data for the target object.
	 *
	 * @param integer $object_id The target object id.
	 *
	 * @return array The retrieved data.
	 */
	public function get( $object_id ) {
		$meta_robots_adv = explode( ',',  WPSEO_Meta::get_value( 'meta-robots-adv', $object_id ) );

		$link_count = new WPSEO_Link_Column_Count();
		$link_count->set( array( $object_id ) );

		return array(
			'object_id'                   => $object_id,
			'object_type'                 => 'post',
			'object_subtype'              => get_post_type( $object_id ),
			'permalink'                   => get_permalink( $object_id ),
			'canonical'                   => WPSEO_Meta::get_value( 'canonical', $object_id ),
			'title'                       => WPSEO_Meta::get_value( 'title', $object_id ),
			'description'                 => WPSEO_Meta::get_value( 'metadesc', $object_id ),
			'breadcrumb_title'            => WPSEO_Meta::get_value( 'bctitle', $object_id ),
			'og_title'                    => WPSEO_Meta::get_value( 'opengraph-title', $object_id ),
			'og_description'              => WPSEO_Meta::get_value( 'opengraph-description', $object_id ),
			'og_image'                    => WPSEO_Meta::get_value( 'opengraph-image', $object_id ),
			'twitter_title'               => WPSEO_Meta::get_value( 'twitter-title', $object_id ),
			'twitter_description'         => WPSEO_Meta::get_value( 'twitter-description', $object_id ),
			'twitter_image'               => WPSEO_Meta::get_value( 'twitter-image', $object_id ),
			'is_robots_noindex'           => WPSEO_Meta::get_value( 'meta-robots-noindex', $object_id ),
			'is_robots_nofollow'          => WPSEO_Meta::get_value( 'meta-robots-nofollow', $object_id ),
			'is_robots_noarchive'         => in_array( 'noarchive', $meta_robots_adv, true ),
			'is_robots_noimageindex'      => in_array( 'noimageindex', $meta_robots_adv, true ),
			'is_robots_nosnippet'         => in_array( 'nosnippet', $meta_robots_adv, true ),
			'primary_focus_keyword'       => WPSEO_Meta::get_value( 'focuskw', $object_id ),
			'primary_focus_keyword_score' => WPSEO_Meta::get_value( 'linkdex', $object_id ),
			'readability_score'           => WPSEO_Meta::get_value( 'linkdex', $object_id ),
			'is_cornerstone'              => WPSEO_Meta::get_value( 'content_score', $object_id ) === '1',
			'link_count'                  => $link_count->get( $object_id, 'internal_link_count' ),
			'incoming_link_count'         => $link_count->get( $object_id, 'incoming_link_count' ),
			'created_at'                  => null,
			'updated_at'                  => null,
		);
	}

	/**
	 * Checks if the given object id is indexable.
	 *
	 * @param integer $object_id The target object id.
	 *
	 * @return bool Whether the object is indexable.
	 */
	public function is_indexable( $object_id ) {
		if ( get_post( $object_id ) === null ) {
		 	return false;
		}

		if ( wp_is_post_revision( $object_id ) || wp_is_post_autosave( $object_id ) ) {
			return false;
		}

		if ( get_post_status ( $object_id ) === 'private' ) {
			return false;
		}


		return true;
	}
}