<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Term_Indexable.
 */
class WPSEO_Term_Indexable extends WPSEO_Indexable {

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
		'primary_focus_keyword',
		'primary_focus_keyword',
		'primary_focus_keyword_score',
		'readability_score',
	);

	/**
	 * Creates a new Indexable from a passed object.
	 *
	 * @param int $object_id The object ID to create the object for.
	 *
	 * @return WPSEO_Indexable The indexable.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if the passed ID is not for an object of type 'term'.
	 */
	public static function from_object( $object_id ) {
		$term = WPSEO_Term_Object_Type::from_object( $object_id );

		$term_object_id = $term->get_id();

		return new self(
			array(
				'object_id'                   => $term_object_id,
				'object_type'                 => $term->get_type(),
				'object_subtype'              => $term->get_subtype(),
				'permalink'                   => $term->get_permalink(),
				'canonical'                   => self::get_meta_value( 'canonical', $term ),
				'title'                       => self::get_meta_value( 'title', $term ),
				'description'                 => self::get_meta_value( 'desc', $term ),
				'breadcrumb_title'            => self::get_meta_value( 'bctitle', $term ),
				'og_title'                    => self::get_meta_value( 'opengraph-title', $term ),
				'og_description'              => self::get_meta_value( 'opengraph-description', $term ),
				'og_image'                    => self::get_meta_value( 'opengraph-image', $term ),
				'twitter_title'               => self::get_meta_value( 'twitter-title', $term ),
				'twitter_description'         => self::get_meta_value( 'twitter-description', $term ),
				'twitter_image'               => self::get_meta_value( 'twitter-image', $term ),
				'is_robots_noindex'           => self::get_robots_noindex_value( self::get_meta_value( 'noindex', $term ) ),
				'is_robots_nofollow'          => null,
				'is_robots_noarchive'         => null,
				'is_robots_noimageindex'      => null,
				'is_robots_nosnippet'         => null,
				'primary_focus_keyword'       => self::get_meta_value( 'focuskw', $term ),
				'primary_focus_keyword_score' => (int) self::get_meta_value( 'linkdex', $term ),
				'readability_score'           => (int) self::get_meta_value( 'content_score', $term ),
				'is_cornerstone'              => false,
				'link_count'                  => null,
				'incoming_link_count'         => null,
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

	/**
	 * Returns the needed term meta field.
	 *
	 * @param string                 $field The requested field.
	 * @param WPSEO_Term_Object_Type $term  The term object.
	 *
	 * @return bool|mixed The value of the requested field.
	 */
	protected static function get_meta_value( $field, $term ) {
		return WPSEO_Taxonomy_Meta::get_term_meta( $term->get_id(), $term->get_subtype(), $field );
	}

	/**
	 * Converts the meta value to a boolean value.
	 *
	 * @param string $value The value to convert.
	 *
	 * @return bool|null The converted value.
	 */
	protected static function get_robots_noindex_value( $value ) {
		if ( $value === 'noindex' ) {
			return true;
		}

		if ( $value === 'index' ) {
			return false;
		}

		return null;
	}
}
