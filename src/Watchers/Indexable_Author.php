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
		add_action( 'profile_update', array( $this, 'save_meta' ), PHP_INT_MAX, 2 );
		add_action( 'deleted_user', array( $this, 'delete_meta' ) );
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
		if ( $indexable ) {
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
		$model = $this->get_indexable( $user_id );

		$model->updated_at = gmdate( 'Y-m-d H:i:s' );
		$model->permalink = get_author_posts_url( $user_id );

		$model->title              = get_the_author_meta( 'wpseo_title', $user_id );
		$model->description        = get_the_author_meta( 'wpseo_metadesc', $user_id );
		$model->include_in_sitemap = get_the_author_meta( 'wpseo_excludeauthorsitemap', $user_id ) === 'on';

		$model->save();
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
}
