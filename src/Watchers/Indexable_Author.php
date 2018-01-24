<?php

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Yoast_Model;
use Yoast\YoastSEO\Models\Indexable;

class Indexable_Author implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'profile_update', array( $this, 'save_meta' ), PHP_INT_MAX, 2 );
		\add_action( 'deleted_user', array( $this, 'delete_meta' ) );
	}

	/**
	 * Deletes user meta.
	 *
	 * @param int $user_id User ID to delete the metadata of.
	 *
	 * @return void
	 */
	public function delete_meta( $user_id ) {
		$indexable = $this->get_indexable( $user_id, false );
		if ( $indexable instanceof Yoast_Model ) {
			$indexable->delete();
		}
	}

	/**
	 * Saves user meta.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return void
	 */
	public function save_meta( $user_id ) {
		$model            = $this->get_indexable( $user_id );
		$model->permalink = $this->get_permalink( $user_id );

		$meta_data = $this->get_meta_data( $user_id );

		$model->title              = $meta_data['wpseo_title'];
		$model->description        = $meta_data['wpseo_metadesc'];
		$model->include_in_sitemap = $this->get_sitemap_include_value( $meta_data['wpseo_excludeauthorsitemap'] );

		$model->save();
	}

	/**
	 * Retrieves the meta data for this indexable.
	 *
	 * @param int $user_id The user to fetch meta data for.
	 *
	 * @return array List of meta entries.
	 */
	protected function get_meta_data( $user_id ) {
		$keys = array(
			'wpseo_title',
			'wpseo_metadesc',
			'wpseo_excludeauthorsitemap'
		);

		$output = array();
		foreach ( $keys as $key ) {
			$output[ $key ] = $this->get_author_meta( $user_id, $key );
		}

		return $output;
	}

	/**
	 * Retrieves the indexable for a user.
	 *
	 * @param int  $user_id     The use to retrieve the indexable for.
	 * @param bool $auto_create Optional. Create the indexable when it does not exist yet.
	 *
	 * @return bool|Indexable
	 */
	protected function get_indexable( $user_id, $auto_create = true ) {
		$indexable = Yoast_Model::of_type( 'Indexable' )
								->where( 'object_id', $user_id )
								->where( 'object_type', 'user' )
								->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable              = Yoast_Model::of_type( 'Indexable' )->create();
			$indexable->object_id   = $user_id;
			$indexable->object_type = 'user';
		}

		return $indexable;
	}

	/**
	 * Retrieves the permalink of a user.
	 *
	 * @param int $user_id The user to fetch the permalink of.
	 *
	 * @return string The permalink.
	 */
	protected function get_permalink( $user_id ) {
		return \get_author_posts_url( $user_id );
	}

	/**
	 * @param $user_id
	 * @param $key
	 *
	 * @return string
	 */
	protected function get_author_meta( $user_id, $key ) {
		return \get_the_author_meta( $key, $user_id );
	}

	/**
	 * Converts the sitemap exclude meta value to the indexable value.
	 *
	 * @param string $meta_value Current meta value.
	 *
	 * @return bool Value to use in the indexable.
	 */
	protected function get_sitemap_include_value( $meta_value ) {
		return $meta_value !== 'on';
	}
}
