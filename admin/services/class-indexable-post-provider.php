<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Services
 */

/**
 * Represents the indexable post service.
 */
class WPSEO_Indexable_Service_Post_Provider implements WPSEO_Indexable_Service_Provider {

	/**
	 * Returns an array with data for the target object.
	 *
	 * @param integer $object_id The target object id.
	 *
	 * @return array The retrieved data.
	 */
	public function get( $object_id ) {

		if ( ! $this->is_indexable( $object_id ) ) {
			return array();
		}

		$link_count = new WPSEO_Link_Column_Count();
		$link_count->set( array( $object_id ) );

		return array(
			'object_id'                   => (int) $object_id,
			'object_type'                 => 'post',
			'object_subtype'              => get_post_type( $object_id ),
			'permalink'                   => get_permalink( $object_id ),
			'canonical'                   => $this->get_meta_value( 'canonical', $object_id ),
			'title'                       => $this->get_meta_value( 'title', $object_id ),
			'description'                 => $this->get_meta_value( 'metadesc', $object_id ),
			'breadcrumb_title'            => $this->get_meta_value( 'bctitle', $object_id ),
			'og_title'                    => $this->get_meta_value( 'opengraph-title', $object_id ),
			'og_description'              => $this->get_meta_value( 'opengraph-description', $object_id ),
			'og_image'                    => $this->get_meta_value( 'opengraph-image', $object_id ),
			'twitter_title'               => $this->get_meta_value( 'twitter-title', $object_id ),
			'twitter_description'         => $this->get_meta_value( 'twitter-description', $object_id ),
			'twitter_image'               => $this->get_meta_value( 'twitter-image', $object_id ),
			'is_robots_noindex'           => $this->get_robots_noindex_value( $this->get_meta_value( 'meta-robots-noindex', $object_id ) ),
			'is_robots_nofollow'          => $this->get_meta_value( 'meta-robots-nofollow', $object_id ) === '1',
			'is_robots_noarchive'         => strpos( $this->get_meta_value( 'meta-robots-adv', $object_id ), 'noarchive' ) !== false,
			'is_robots_noimageindex'      => strpos( $this->get_meta_value( 'meta-robots-adv', $object_id ), 'noimageindex' ) !== false,
			'is_robots_nosnippet'         => strpos( $this->get_meta_value( 'meta-robots-adv', $object_id ), 'nosnippet' ) !== false,
			'primary_focus_keyword'       => $this->get_meta_value( 'focuskw', $object_id ),
			'primary_focus_keyword_score' => (int) $this->get_meta_value( 'linkdex', $object_id ),
			'readability_score'           => (int) $this->get_meta_value( 'content_score', $object_id ),
			'is_cornerstone'              => $this->get_meta_value( 'is_cornerstone', $object_id ) === '1',
			'link_count'                  => (int) $link_count->get( $object_id ),
			'incoming_link_count'         => (int) $link_count->get( $object_id, 'incoming_link_count' ),
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
		if ( get_post( $object_id ) === null ) {
			return false;
		}

		if ( wp_is_post_autosave( $object_id ) ) {
			return false;
		}

		if ( wp_is_post_revision( $object_id ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Translates the meta value to a boolean value.
	 *
	 * @param string $value The value to translate.
	 *
	 * @return bool|null The translated value.
	 */
	protected function get_robots_noindex_value( $value ) {
		if ( $value === '1' ) {
			return true;
		}

		if ( $value === '2' ) {
			return false;
		}

		return null;
	}

	/**
	 * Returns the needed post meta field.
	 *
	 * @param string $field   The requested field.
	 * @param int    $post_id The post id.
	 *
	 * @return bool|mixed The value of the requested field.
	 */
	protected function get_meta_value( $field, $post_id ) {
		return WPSEO_Meta::get_value( $field, $post_id );
	}
}
