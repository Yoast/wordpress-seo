<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

class WPSEO_Indexable {

	/**
	 * @var array
	 */
	private $data;

	private static $validators = array(
		'WPSEO_Link_Validator',
		'WPSEO_Keyword_Validator',
		'WPSEO_Meta_Values_Validator',
		'WPSEO_Object_Type_Validator',
		'WPSEO_OpenGraph_Validator',
		'WPSEO_Robots_Validator',
		'WPSEO_Twitter_Validator',
	);

	/**
	 * Indexable constructor.
	 *
	 * @param $data
	 */
	public function __construct( $data ) {
		$is_valid = $this->validate_data( $data );

		if ( ! $is_valid ) {

		}

		$this->data = $data;
	}

	public static function from_object( $object_id, $object_type ) {
		// check if object exists and that object type is a valid type.



		$link_count = new WPSEO_Link_Column_Count();
		$link_count->set( array( $object_id ) );

		return new self(
			array(
				'object_id'                   => (int) $object_id,
				'object_type'                 => $object_type,
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
				'is_robots_noindex'           => self::get_robots_noindex_value( WPSEO_Meta::get_value( 'meta-robots-noindex', $object_id ) ),
				'is_robots_nofollow'          => WPSEO_Meta::get_value( 'meta-robots-nofollow', $object_id ) === '1',
				'is_robots_noarchive'         => self::has_advanced_meta_value( 'noarchive' ),
				'is_robots_noimageindex'      => self::has_advanced_meta_value( 'noimageindex' ),
				'is_robots_nosnippet'         => self::has_advanced_meta_value( 'nosnippet' ),
				'primary_focus_keyword'       => WPSEO_Meta::get_value( 'focuskw', $object_id ),
				'primary_focus_keyword_score' => (int) WPSEO_Meta::get_value( 'linkdex', $object_id ),
				'readability_score'           => (int) WPSEO_Meta::get_value( 'content_score', $object_id ),
				'is_cornerstone'              => WPSEO_Meta::get_value( 'is_cornerstone', $object_id ) === '1',
				'link_count'                  => (int) $link_count->get( $object_id ),
				'incoming_link_count'         => (int) $link_count->get( $object_id, 'incoming_link_count' ),
				'created_at'                  => null,
				'updated_at'                  => null,
			)
		);
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
	 * Determines whether the advanced robot metas value contains the passed value.
	 *
	 * @param int 	 $object_id	The ID of the object to check.
	 * @param string $value 	The name of the advanced robots meta value to look for.
	 *
	 * @return bool Whether or not the advanced robots meta values contains the passed string.
	 */
	protected function has_advanced_meta_value( $object_id, $value ) {
		return strpos( $this->get_meta_value( 'meta-robots-adv', $object_id ), $value ) !== false;
	}

	private function validate_data( $data ) {
		foreach ( $this->validators as $validator ) {
			$validator::validate( $data );
		}
	}

	public function update( $data ) {
		$data = array_merge( $this->data, $data );

		return new self( $data );
	}

	public function to_array() {
		return $this->data;
	}
}
