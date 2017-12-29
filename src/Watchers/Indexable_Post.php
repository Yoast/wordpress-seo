<?php

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Yoast_Model;
use Yoast\YoastSEO\Models\Indexable;

class Indexable_Post implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'wp_insert_post', array( $this, 'save_meta' ), PHP_INT_MAX, 1 );
		add_action( 'delete_post', array( $this, 'delete_meta' ) );
	}

	/**
	 * Deletes the meta when a post is deleted.
	 *
	 * @param int $post_id Post ID.
	 */
	public function delete_meta( $post_id ) {
		$post_type = get_post_type( $post_id );

		/** @var Indexable $indexable */
		$indexable = Yoast_Model::of_type( 'Indexable' )
								->where( 'object_id', $post_id )
								->where( 'object_type', 'post' )
								->where( 'object_sub_type', $post_type )
								->find_one();

		if ( ! $indexable ) {
			return;
		}

		$indexable->delete();
	}

	/**
	 * Saves post meta.
	 *
	 * @param int $post_id Post ID.
	 */
	public function save_meta( $post_id ) {
		if ( wp_is_post_revision( $post_id ) ) {
			return;
		}

		if ( wp_is_post_autosave( $post_id ) ) {
			return;
		}

		$post_type = get_post_type( $post_id );

		/** @var Indexable $indexable */
		$indexable = Yoast_Model::of_type( 'Indexable' )
								->where( 'object_id', $post_id )
								->where( 'object_type', 'post' )
								->where( 'object_sub_type', $post_type )
								->find_one();

		if ( ! $indexable ) {
			/** @var Indexable $indexable */
			$indexable                  = Yoast_Model::of_type( 'Indexable' )->create();
			$indexable->object_id       = $post_id;
			$indexable->object_type     = 'post';
			$indexable->object_sub_type = get_post_type( $post_id );
		}

		// Implement filling of meta values.
		$post_meta = \get_post_meta( $post_id );

		$indexable->permalink = get_permalink( $post_id );

		$this->set_meta_value( $indexable, $post_meta, 'canonical', '_yoast_wpseo_canonical' );
		$this->set_meta_value( $indexable, $post_meta, 'content_score', '_yoast_wpseo_content_score' );

		$noindex = (int) $post_meta['_yoast_wpseo_meta-robots-noindex'][0];
		switch ( $noindex ) {
			case 0:
				$indexable->robots_noindex = null;
				break;
			case 1:
				$indexable->robots_noindex = 1;
				break;
			case 2:
				$indexable->robots_noindex = 0;
				break;
		}

		$this->set_meta_value( $indexable, $post_meta, 'robots_nofollow', '_yoast_wpseo_meta-robots-nofollow' );

		// Set additional meta-robots values.
		$meta_robots_options = array( 'noimageindex', 'noarchive', 'nosnippet' );
		$meta_robots         = explode( ',', $post_meta['_yoast_wpseo_meta-robots-adv'][0] );
		foreach ( $meta_robots_options as $meta_robots_option ) {
			$indexable->{'robots_' . $meta_robots_option} = in_array( $meta_robots_option, $meta_robots, true ) ? 1 : null;
		}

		$this->set_meta_value( $indexable, $post_meta, 'title', '_yoast_wpseo_title' );
		$this->set_meta_value( $indexable, $post_meta, 'description', '_yoast_wpseo_metadesc' );
		$this->set_meta_value( $indexable, $post_meta, 'breadcrumb_title', '_yoast_wpseo_bctitle' );

		$this->set_meta_value( $indexable, $post_meta, 'cornerstone', '_yst_is_cornerstone' );

		$this->set_meta_value( $indexable, $post_meta, 'og_title', '_yoast_wpseo_opengraph-title' );
		$this->set_meta_value( $indexable, $post_meta, 'og_image', '_yoast_wpseo_opengraph-image' );
		$this->set_meta_value( $indexable, $post_meta, 'og_description', '_yoast_wpseo_opengraph-description' );

		$this->set_meta_value( $indexable, $post_meta, 'twitter_title', '_yoast_wpseo_twitter-title' );
		$this->set_meta_value( $indexable, $post_meta, 'twitter_image', '_yoast_wpseo_twitter-image' );
		$this->set_meta_value( $indexable, $post_meta, 'twitter_description', '_yoast_wpseo_twitter-description' );

		$indexable->include_in_sitemap = null;

		try {
			$seo_meta = Yoast_Model::of_type( 'SEO_Meta' )
								   ->where( 'object_id', $post_id )
								   ->find_one();

			if ( $seo_meta ) {
				$indexable->internal_link_count = $seo_meta->internal_link_count;
				$indexable->incoming_link_count = $seo_meta->incoming_link_count;
			}
		} catch ( \Exception $exception ) {

		}

		$indexable->save();
	}

	/**
	 * Helper function
	 *
	 * @todo convert to something prettier.
	 *
	 * @param Yoast_Model $model     Model.
	 * @param array       $post_meta Meta list.
	 * @param string      $target    Property to fill on the model.
	 * @param string      $source    Meta key from the list.
	 * @param null        $default   Default value if not set in meta data.
	 */
	protected function set_meta_value( $model, $post_meta, $target, $source, $default = null ) {
		if ( ! isset( $post_meta[ $source ] ) ) {
			$model->{$target} = $default;

			return;
		}

		$model->{$target} = $post_meta[ $source ][0];
	}
}
