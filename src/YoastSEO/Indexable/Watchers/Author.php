<?php

namespace Yoast\YoastSEO\Indexable\Watchers;

use Yoast\WordPress\Integration;
use Yoast\Yoast_Model;
use Yoast\YoastSEO\Database\Models\Indexable;

class Author implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 */
	public function initialize() {
		add_action( 'profile_update', array( $this, 'save_meta' ), PHP_INT_MAX, 2 );
		add_action( 'deleted_user', array( $this, 'delete_meta' ) );
	}

	/**
	 * Deletes user meta.
	 *
	 * @param $user_id
	 */
	public function delete_meta( $user_id ) {
		/** @var Indexable $model */
		$model = Yoast_Model::factory( 'Indexable' )
							->where( 'object_id', $user_id )
							->where( 'object_type', 'user' )
							->find_one();

		if ( ! $model ) {
			return;
		}

		$model->delete();
	}

	/**
	 * @param int $user_id User ID.
	 */
	public function save_meta( $user_id ) {
		/** @var Indexable $model */
		$model = Yoast_Model::factory( 'Indexable' )
							->where( 'object_id', $user_id )
							->where( 'object_type', 'user' )
							->find_one();

		if ( ! $model ) {
			$model              = Yoast_Model::factory( 'Indexable' )->create();
			$model->object_id   = $user_id;
			$model->object_type = 'user';
		}

		$model->modified_date_gmt = gmdate( 'Y-m-d H:i:s' );


		$model->title           = get_the_author_meta( 'wpseo_title', $user_id );
		$model->description     = get_the_author_meta( 'wpseo_metadesc', $user_id );
		$model->sitemap_exclude = get_the_author_meta( 'wpseo_excludeauthorsitemap', $user_id ) === 'on';

		$model->permalink = get_author_posts_url( $user_id );

		$model->save();
	}
}
