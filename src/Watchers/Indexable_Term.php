<?php

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Yoast_Model;
use Yoast\YoastSEO\Models\Indexable;

class Indexable_Term implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'created_term', array( $this, 'save_meta' ), PHP_INT_MAX, 3 );
		\add_action( 'edited_term', array( $this, 'save_meta' ), PHP_INT_MAX, 3 );
		\add_action( 'deleted_term', array( $this, 'delete_meta' ), PHP_INT_MAX, 3 );
	}

	/**
	 * Deletes a term from the index.
	 *
	 * @param int    $term_id          The Term ID to delete.
	 * @param int    $taxonomy_term_id The Taxonomy ID the Term belonged to.
	 * @param string $taxonomy         The taxonomy name the Term belonged to.
	 *
	 * @return void
	 */
	public function delete_meta( $term_id, $taxonomy_term_id, $taxonomy ) {
		$indexable = $this->get_indexable( $term_id, $taxonomy, false );
		if ( $indexable instanceof Yoast_Model ) {
			$indexable->delete();
		}
	}

	/**
	 * Update the taxonomy meta data on save.
	 *
	 * @param int    $term_id          ID of the term to save data for.
	 * @param int    $taxonomy_term_id The taxonomy_term_id for the term.
	 * @param string $taxonomy         The taxonomy the term belongs to.
	 *
	 * @return void
	 */
	public function save_meta( $term_id, $taxonomy_term_id, $taxonomy ) {
		/** @var Indexable $indexable */
		$indexable            = $this->get_indexable( $term_id, $taxonomy );
		$indexable->permalink = $this->get_permalink( $term_id, $taxonomy );

		$term_meta = $this->get_meta_data( $term_id, $taxonomy );

		foreach ( $this->get_meta_lookup() as $meta_key => $indexable_key ) {
			$indexable->{$indexable_key} = $term_meta[ $meta_key ];
		}

		$indexable->include_in_sitemap = $this->get_sitemap_include_value( $term_meta['wpseo_sitemap_include'] );

		// Not implemented yet.
		$indexable->cornerstone     = 0;
		$indexable->robots_nofollow = 0;
		// $model->internal_link_count = null;
		// $model->incoming_link_count = null;

		$indexable->save();
	}

	/**
	 * Retrieves an indexable for a term.
	 *
	 * @param int    $term_id     The term the indexable is based upon.
	 * @param string $taxonomy    The taxonomy the indexable belongs to.
	 * @param bool   $auto_create Optional. Creates an indexable if it does not exist yet.
	 *
	 * @return bool|Indexable
	 */
	protected function get_indexable( $term_id, $taxonomy, $auto_create = true ) {
		$indexable = Yoast_Model::of_type( 'Indexable' )
								->where( 'object_id', $term_id )
								->where( 'object_type', 'term' )
								->where( 'object_sub_type', $taxonomy )
								->find_one();

		if ( $auto_create && ! $indexable ) {
			/** @var Indexable $indexable */
			$indexable                  = Yoast_Model::of_type( 'Indexable' )->create();
			$indexable->object_id       = $term_id;
			$indexable->object_type     = 'term';
			$indexable->object_sub_type = $taxonomy;
		}

		return $indexable;
	}

	/**
	 * Retrieves the meta lookup table.
	 *
	 * @return array The lookup table.
	 */
	protected function get_meta_lookup() {
		$meta_to_indexable = array(
			'wpseo_canonical' => 'canonical',

			'wpseo_title'         => 'title',
			'wpseo_desc'          => 'description',
			'wpseo_content_score' => 'content_score',

			'wpseo_bctitle' => 'breadcrumb_title',

			'wpseo_opengraph-title'       => 'og_title',
			'wpseo_opengraph-description' => 'og_description',
			'wpseo_opengraph-image'       => 'og_image',

			'wpseo_twitter-title'       => 'twitter_title',
			'wpseo_twitter-description' => 'twitter_description',
			'wpseo_twitter-image'       => 'twitter_image',

			'wpseo_noindex' => 'robots_noindex',
		);

		return $meta_to_indexable;
	}

	/**
	 * Converts the meta sitemap include value to the indexable value.
	 *
	 * @param string $meta_value Term meta to base the value on.
	 *
	 * @return bool|null
	 */
	protected function get_sitemap_include_value( $meta_value ) {
		switch ( $meta_value ) {
			case 'always':
				return false;
			case 'never':
				return true;
		}

		return null;
	}

	/**
	 * Retrieves the meta data for a term.
	 *
	 * @param int    $term_id  Term to use.
	 * @param string $taxonomy Taxonomy to use.
	 *
	 * @return bool|array The meta data for the term.
	 */
	protected function get_meta_data( $term_id, $taxonomy ) {
		return \WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $taxonomy );
	}

	/**
	 * Retrieves the permalink for a term.
	 *
	 * @param int    $term_id  The term to use.
	 * @param string $taxonomy Taxonomy to use.
	 *
	 * @return string|\WP_Error The permalink for the term.
	 */
	protected function get_permalink( $term_id, $taxonomy ) {
		return \get_term_link( $term_id, $taxonomy );
	}
}
