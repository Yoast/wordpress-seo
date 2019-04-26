<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Post_Indexable.
 */
class WPSEO_Post_Indexable extends WPSEO_Indexable {

	/**
	 * The updateable fields.
	 *
	 * @var array
	 */
	protected $updateable_fields = array(
		'canonical',
		'title',
		'description',
		'breadcrumb_title',
		'og_title',
		'og_description',
		'og_image',
		'twitter_title',
		'twitter_description',
		'twitter_image',
		'is_robots_noindex',
		'is_robots_nofollow',
		'is_robots_noarchive',
		'is_robots_noimageindex',
		'is_robots_nosnippet',
		'primary_focus_keyword',
		'primary_focus_keyword',
		'primary_focus_keyword_score',
		'readability_score',
		'is_cornerstone',
	);

	/**
	 * Creates a new Indexable from a passed object.
	 *
	 * @param int $object_id The object ID to create the object for.
	 *
	 * @return WPSEO_Indexable The indexable.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if the passed ID is not for an object of type 'post'.
	 */
	public static function from_object( $object_id ) {
		$post = WPSEO_Post_Object_Type::from_object( $object_id );

		$link_count = new WPSEO_Link_Column_Count();
		$link_count->set( array( $object_id ) );

		$post_object_id = $post->get_id();

		return new self(
			array(
				'object_id'                   => $post_object_id,
				'object_type'                 => $post->get_type(),
				'object_subtype'              => $post->get_subtype(),
				'permalink'                   => $post->get_permalink(),
				'canonical'                   => WPSEO_Meta::get_value( 'canonical', $post_object_id ),
				'title'                       => WPSEO_Meta::get_value( 'title', $post_object_id ),
				'description'                 => WPSEO_Meta::get_value( 'metadesc', $post_object_id ),
				'breadcrumb_title'            => WPSEO_Meta::get_value( 'bctitle', $post_object_id ),
				'og_title'                    => WPSEO_Meta::get_value( 'opengraph-title', $post_object_id ),
				'og_description'              => WPSEO_Meta::get_value( 'opengraph-description', $post_object_id ),
				'og_image'                    => WPSEO_Meta::get_value( 'opengraph-image', $post_object_id ),
				'twitter_title'               => WPSEO_Meta::get_value( 'twitter-title', $post_object_id ),
				'twitter_description'         => WPSEO_Meta::get_value( 'twitter-description', $post_object_id ),
				'twitter_image'               => WPSEO_Meta::get_value( 'twitter-image', $post_object_id ),
				'is_robots_noindex'           => self::get_robots_noindex_value( WPSEO_Meta::get_value( 'meta-robots-noindex', $post_object_id ) ),
				'is_robots_nofollow'          => WPSEO_Meta::get_value( 'meta-robots-nofollow', $post_object_id ) === '1',
				'is_robots_noarchive'         => self::has_advanced_meta_value( $post_object_id, 'noarchive' ),
				'is_robots_noimageindex'      => self::has_advanced_meta_value( $post_object_id, 'noimageindex' ),
				'is_robots_nosnippet'         => self::has_advanced_meta_value( $post_object_id, 'nosnippet' ),
				'primary_focus_keyword'       => WPSEO_Meta::get_value( 'focuskw', $post_object_id ),
				'primary_focus_keyword_score' => (int) WPSEO_Meta::get_value( 'linkdex', $post_object_id ),
				'readability_score'           => (int) WPSEO_Meta::get_value( 'content_score', $post_object_id ),
				'is_cornerstone'              => WPSEO_Meta::get_value( 'is_cornerstone', $post_object_id ) === '1',
				'link_count'                  => (int) $link_count->get( $post_object_id ),
				'incoming_link_count'         => (int) $link_count->get( $post_object_id, 'incoming_link_count' ),
				'created_at'                  => null,
				'updated_at'                  => null,
			)
		);
	}

	/**
	 * Updates the data and returns a new instance.
	 *
	 * @param array $data The data to update into a new instance.
	 *
	 * @return WPSEO_Indexable A new instance with the updated data.
	 */
	public function update( $data ) {
		$data = array_merge( $this->data, $this->filter_updateable_data( $data ) );

		return new self( $data );
	}
}
