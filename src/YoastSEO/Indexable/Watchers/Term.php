<?php

namespace Yoast\YoastSEO\Indexable\Watchers;

use Yoast\WordPress\Integration;
use Yoast\Yoast_Model;

class Term implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 */
	public function add_hooks() {
		add_action( 'created_term', array( $this, 'save_meta' ), PHP_INT_MAX, 3 );
		add_action( 'edited_term', array( $this, 'save_meta' ), PHP_INT_MAX, 3 );

		add_action( 'deleted_term', array( $this, 'delete_meta' ), PHP_INT_MAX, 3 );
	}

	/**
	 * @param $term_id
	 * @param $taxonomy_term_id
	 * @param $taxonomy
	 */
	public function delete_meta( $term_id, $taxonomy_term_id, $taxonomy ) {
		/** @var \Yoast\YoastSEO\Models\Indexable $model */
		$model = Yoast_Model::factory( 'Indexable' )
							->where( 'object_id', $term_id )
							->where( 'object_type', 'term' )
							->where( 'object_sub_type', $taxonomy )
							->find_one();

		if ( ! $model ) {
			return;
		}

		$model->delete();
	}

	/**
	 * Update the taxonomy meta data on save.
	 *
	 * @param int    $term_id          ID of the term to save data for.
	 * @param int    $taxonomy_term_id The taxonomy_term_id for the term.
	 * @param string $taxonomy         The taxonomy the term belongs to.
	 */
	public function save_meta( $term_id, $taxonomy_term_id, $taxonomy ) {
		/** @var \Yoast\YoastSEO\Models\Indexable $model */
		$model = Yoast_Model::factory( 'Indexable' )
							->where( 'object_id', $term_id )
							->where( 'object_type', 'term' )
							->where( 'object_sub_type', $taxonomy )
							->find_one();

		if ( ! $model ) {
			$model                  = Yoast_Model::factory( 'Indexable' )->create();
			$model->object_id       = $term_id;
			$model->object_type     = 'term';
			$model->object_sub_type = $taxonomy;
		}

		$model->modified_date_gmt = gmdate( 'Y-m-d H:i:s' );

		$term_meta = \WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $taxonomy );

		$model->permalink = get_term_link( $term_id, $taxonomy );
		$model->canonical = $term_meta['wpseo_canonical'];

		$model->title         = $term_meta['wpseo_title'];
		$model->description   = $term_meta['wpseo_desc'];
		$model->content_score = $term_meta['wpseo_content_score'];

		$model->breadcrumb_title = $term_meta['wpseo_bctitle'];

		$model->og_title       = $term_meta['wpseo_opengraph-title'];
		$model->og_description = $term_meta['wpseo_opengraph-description'];
		$model->og_image_url   = $term_meta['wpseo_opengraph-image'];

		$model->twitter_title       = $term_meta['wpseo_twitter-title'];
		$model->twitter_description = $term_meta['wpseo_twitter-description'];
		$model->twitter_image_url   = $term_meta['wpseo_twitter-image'];

		$model->robots_noindex = $term_meta['wpseo_noindex'];

		switch ( $term_meta['wpseo_sitemap_include'] === 'always' ) {
			case 'always':
				$model->sitemap_exclude = 0;
				break;
			case 'never':
				$model->sitemap_exclude = 1;
				break;
			default:
				$model->sitemap_exclude = null;
				break;
		}

		// Not implemented yet.
		$model->cornerstone     = 0;
		$model->robots_nofollow = 0;
		// $model->internal_link_count = null;
		// $model->incoming_link_count = null;

		$model->save();
	}
}
