<?php

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Yoast_Model;
use Yoast\YoastSEO\Models\Indexable;

class Term implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
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
		/** @var Indexable $indexable */
		$indexable = Yoast_Model::of_type( 'Indexable' )
								->where( 'object_id', $term_id )
								->where( 'object_type', 'term' )
								->where( 'object_sub_type', $taxonomy )
								->find_one();

		if ( ! $indexable ) {
			return;
		}

		$indexable->delete();
	}

	/**
	 * Update the taxonomy meta data on save.
	 *
	 * @param int    $term_id          ID of the term to save data for.
	 * @param int    $taxonomy_term_id The taxonomy_term_id for the term.
	 * @param string $taxonomy         The taxonomy the term belongs to.
	 */
	public function save_meta( $term_id, $taxonomy_term_id, $taxonomy ) {
		/** @var Indexable $indexable */
		$indexable = Yoast_Model::of_type( 'Indexable' )
								->where( 'object_id', $term_id )
								->where( 'object_type', 'term' )
								->where( 'object_sub_type', $taxonomy )
								->find_one();

		if ( ! $indexable ) {
			/** @var Indexable $indexable */
			$indexable                  = Yoast_Model::of_type( 'Indexable' )->create();
			$indexable->object_id       = $term_id;
			$indexable->object_type     = 'term';
			$indexable->object_sub_type = $taxonomy;
		}

		$indexable->modified_date_gmt = gmdate( 'Y-m-d H:i:s' );

		$term_meta = \WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $taxonomy );

		$indexable->permalink = get_term_link( $term_id, $taxonomy );
		$indexable->canonical = $term_meta['wpseo_canonical'];

		$indexable->title         = $term_meta['wpseo_title'];
		$indexable->description   = $term_meta['wpseo_desc'];
		$indexable->content_score = $term_meta['wpseo_content_score'];

		$indexable->breadcrumb_title = $term_meta['wpseo_bctitle'];

		$indexable->og_title       = $term_meta['wpseo_opengraph-title'];
		$indexable->og_description = $term_meta['wpseo_opengraph-description'];
		$indexable->og_image_url   = $term_meta['wpseo_opengraph-image'];

		$indexable->twitter_title       = $term_meta['wpseo_twitter-title'];
		$indexable->twitter_description = $term_meta['wpseo_twitter-description'];
		$indexable->twitter_image_url   = $term_meta['wpseo_twitter-image'];

		$indexable->robots_noindex = $term_meta['wpseo_noindex'];

		switch ( $term_meta['wpseo_sitemap_include'] ) {
			case 'always':
				$indexable->sitemap_exclude = 0;
				break;
			case 'never':
				$indexable->sitemap_exclude = 1;
				break;
			default:
				$indexable->sitemap_exclude = null;
				break;
		}

		// Not implemented yet.
		$indexable->cornerstone     = 0;
		$indexable->robots_nofollow = 0;
		// $model->internal_link_count = null;
		// $model->incoming_link_count = null;

		$indexable->save();
	}
}
