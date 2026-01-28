<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Bypass_Post_Meta_Feature_Flag_Conditional;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Bypass get_post_meta and the like and route them to indexables.
 */
class Bypass_Post_Meta implements Integration_Interface {

	/**
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	private $map_meta_indexable = [
		'focuskw'       => 'primary_focus_keyword',
		'title'         => 'title',
		'metadesc'      => 'description',
		'linkdex'       => 'primary_focus_keyword_score',
		'content_score' => 'readability_score',
	];

	/**
	 * Bypass_Post_Meta constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Initializes the integration.
	 */
	public function register_hooks() {
		add_filter( 'get_post_metadata', [ $this, 'filter_get_meta' ], 1, 5 );
		add_filter( 'get_term_metadata', [ $this, 'filter_get_meta' ], 1, 5 );
		add_filter( 'get_user_metadata', [ $this, 'filter_get_meta' ], 1, 5 );
		add_filter( 'update_post_metadata', [ $this, 'filter_update_post_meta' ], 1, 5 );
		add_filter( 'update_term_metadata', [ $this, 'filter_update_term_meta' ], 1, 5 );
		add_filter( 'update_user_metadata', [ $this, 'filter_update_user_meta' ], 1, 5 );
	}

	/**
	 * Filter updating the post meta.
	 *
	 * @param null|bool $check      Whether to allow updating metadata for the given type.
	 * @param int       $object_id  ID of the object metadata is for.
	 * @param string    $meta_key   Metadata key.
	 * @param mixed     $meta_value Metadata value. Must be serializable if non-scalar.
	 * @param mixed     $prev_value Optional. Previous value to check before updating.
	 *                              If specified, only update existing metadata entries with
	 *                              this value. Otherwise, update all entries.     *
	 *
	 * @return bool
	 */
	public function filter_update_post_meta( $check, $object_id, $meta_key, $meta_value, $prev_value ) {
		return $this->filter_update_meta( $check, $object_id, $meta_key, $meta_value, 'post' );
	}

	/**
	 * Filter updating the post meta.
	 *
	 * @param null|bool $check      Whether to allow updating metadata for the given type.
	 * @param int       $object_id  ID of the object metadata is for.
	 * @param string    $meta_key   Metadata key.
	 * @param mixed     $meta_value Metadata value. Must be serializable if non-scalar.
	 * @param mixed     $prev_value Optional. Previous value to check before updating.
	 *                              If specified, only update existing metadata entries with
	 *                              this value. Otherwise, update all entries.     *
	 *
	 * @return bool
	 */
	public function filter_update_term_meta( $check, $object_id, $meta_key, $meta_value, $prev_value ) {
		return $this->filter_update_meta( $check, $object_id, $meta_key, $meta_value, 'term' );
	}

	/**
	 * Filter updating the post meta.
	 *
	 * @param null|bool $check      Whether to allow updating metadata for the given type.
	 * @param int       $object_id  ID of the object metadata is for.
	 * @param string    $meta_key   Metadata key.
	 * @param mixed     $meta_value Metadata value. Must be serializable if non-scalar.
	 * @param mixed     $prev_value Optional. Previous value to check before updating.
	 *                              If specified, only update existing metadata entries with
	 *                              this value. Otherwise, update all entries.     *
	 *
	 * @return bool
	 */
	public function filter_update_user_meta( $check, $object_id, $meta_key, $meta_value, $prev_value ) {
		return $this->filter_update_meta( $check, $object_id, $meta_key, $meta_value, 'user' );
	}

	/**
	 * Filter updating a meta field.
	 *
	 * @param null|bool $check      Whether to allow updating metadata for the given type.
	 * @param int       $object_id  ID of the object metadata is for.
	 * @param string    $meta_key   Metadata key.
	 * @param mixed     $meta_value Metadata value. Must be serializable if non-scalar.
	 * @param mixed     $meta_type  One of 'user', 'post' or 'term'.
	 *
	 * @return bool
	 */
	private function filter_update_meta( $check, $object_id, $meta_key, $meta_value, $meta_type ) {
		if ( strpos( $meta_key, '_yoast_wpseo_' ) === 0 ) {
			$key = str_replace( '_yoast_wpseo_', '', $meta_key );
			if ( ! isset( $this->map_meta_indexable[ $key ] ) ) {
				return $check;
			}
			$field             = $this->map_meta_indexable[ $key ];
			$indexable         = $this->indexable_repository->find_by_id_and_type( $object_id, $meta_type, false );
			$indexable->$field = $meta_value;

			return $indexable->save();
		}

		return $check;
	}

	/**
	 * Filters get_{post|term|user}_meta to retrieve the value from Indexables instead.
	 *
	 * @param mixed  $value     The value to return, either a single metadata value or an array
	 *                          of values depending on the value of `$single`. Default null.
	 * @param int    $object_id ID of the object metadata is for.
	 * @param string $meta_key  Metadata key.
	 * @param bool   $single    Whether to return only the first value of the specified `$meta_key`.
	 * @param string $meta_type Type of object metadata is for. Accepts 'post', 'comment', 'term', 'user',
	 *                          or any other object type with an associated meta table.
	 *
	 * @return mixed
	 */
	public function filter_get_meta( $value, $object_id, $meta_key, $single, $meta_type = 'post' ) {
		if ( strpos( $meta_key, '_yoast_wpseo_' ) === 0 ) {
			$key = str_replace( '_yoast_wpseo_', '', $meta_key );
			if ( ! isset( $this->map_meta_indexable[ $key ] ) ) {
				return $value;
			}
			$field     = $this->map_meta_indexable[ $key ];
			$indexable = $this->indexable_repository->find_by_id_and_type( $object_id, $meta_type, false );

			return $indexable->$field;
		}

		return $value;
	}

	/**
	 * This integration is only active when the database migrations have been run.
	 *
	 * @return array|string[] The conditionals.
	 */
	public static function get_conditionals() {
		return [ Bypass_Post_Meta_Feature_Flag_Conditional::class ];
	}
}
