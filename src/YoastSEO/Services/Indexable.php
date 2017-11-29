<?php

namespace Yoast\YoastSEO\Services;

use Yoast\WordPress\Integration;
use Yoast\Yoast_Model;

class Indexable implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'wp_insert_post', array( $this, 'save_post_meta' ), PHP_INT_MAX, 2 );
	}

	/**
	 * @param int $id Post ID.
	 */
	public function save_post_meta( $id, $post ) {
		$post_type = get_post_type( $id );

		/** @var \Yoast\YoastSEO\Models\Indexable $model */
		$model = Yoast_Model::factory( 'Indexable' )
							->where( 'object_id', $id )
							->where( 'object_type', 'post' )
							->where( 'object_sub_type', $post_type )
							->find_one();

		if ( ! $model ) {
			$model                  = Yoast_Model::factory( 'Indexable' )->create();
			$model->object_id       = $id;
			$model->object_type     = 'post';
			$model->object_sub_type = get_post_type( $id );
		}

		// Implement filling of meta values.
		$post_meta = \get_post_meta( $id );

		$model->post_date_gmt          = $post->post_date_gmt;
		$model->post_modified_date_gmt = $post->post_modified_gmt;

		$model->permalink = get_permalink( $id );

		$this->set_meta_value( $model, $post_meta, 'canonical', '_yoast_wpseo_canonical' );

		$this->set_meta_value( $model, $post_meta, 'content_score', '_yoast_wpseo_content_score' );

		$this->set_meta_value( $model, $post_meta, 'robots_advanced', '_yoast_wpseo_meta-robots-adv' );
		$this->set_meta_value( $model, $post_meta, 'robots_noindex', '_yoast_wpseo_meta-robots-noindex' );
		$this->set_meta_value( $model, $post_meta, 'robots_nofollow', '_yoast_wpseo_meta-robots-nofollow' );

		$this->set_meta_value( $model, $post_meta, 'title', '_yoast_wpseo_title' );
		$this->set_meta_value( $model, $post_meta, 'description', '_yoast_wpseo_metadesc' );
		$this->set_meta_value( $model, $post_meta, 'breadcrumb_title', '_yoast_wpseo_bctitle' );

		$this->set_meta_value( $model, $post_meta, 'cornerstone', '_yst_is_cornerstone' );

		$this->set_meta_value( $model, $post_meta, 'og_title', '_yoast_wpseo_opengraph-title' );
		$this->set_meta_value( $model, $post_meta, 'og_image_url', '_yoast_wpseo_opengraph-image' );
		$this->set_meta_value( $model, $post_meta, 'og_description', '_yoast_wpseo_opengraph-description' );

		$this->set_meta_value( $model, $post_meta, 'twitter_title', '_yoast_wpseo_twitter-title' );
		$this->set_meta_value( $model, $post_meta, 'twitter_image_url', '_yoast_wpseo_twitter-image' );
		$this->set_meta_value( $model, $post_meta, 'twitter_description', '_yoast_wpseo_twitter-description' );

		try {
			$seo_meta = Yoast_Model::factory( 'SEO_Meta' )
								   ->where( 'object_id', $id )
								   ->find_one();

			if ( $seo_meta ) {
				$model->internal_link_count = $seo_meta->internal_link_count;
				$model->incoming_link_count = $seo_meta->incoming_link_count;
			}
		} catch ( \Exception $exception ) {

		}

		// Optimize?
		$model->save();
	}

	protected function set_meta_value( $model, $post_meta, $target, $source ) {
		if ( ! isset( $post_meta[ $source ] ) ) {
			return;
		}

		$model->{$target} = $post_meta[ $source ][0];
	}
}
