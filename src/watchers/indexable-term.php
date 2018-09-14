<?php
/**
 * Term/Taxonomy watcher to fill the related Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Yoast_Model;
use Yoast\YoastSEO\Models\Indexable;

/**
 * Watcher for terms to fill the related Indexable.
 */
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
		try {
			$indexable = $this->get_indexable( $term_id, $taxonomy, false );
			$indexable->delete();
		} catch ( No_Indexable_Found $exception ) {
			return;
		}
	}

	/**
	 * Update the taxonomy meta data on save.
	 *
	 * Note: This method is missing functionality to update internal links and incoming links.
	 *       As this functionality is currently not available for terms, it has not been added in this
	 *       class yet.
	 *
	 * @param int    $term_id          ID of the term to save data for.
	 * @param int    $taxonomy_term_id The taxonomy_term_id for the term.
	 * @param string $taxonomy         The taxonomy the term belongs to.
	 *
	 * @return void
	 */
	public function save_meta( $term_id, $taxonomy_term_id, $taxonomy ) {
		try {
			$indexable = $this->get_indexable( $term_id, $taxonomy );
		} catch ( No_Indexable_Found $exception ) {
			return;
		}

		$indexable->permalink = $this->get_permalink( $term_id, $taxonomy );

		$term_meta = $this->get_meta_data( $term_id, $taxonomy );

		foreach ( $this->get_meta_lookup() as $meta_key => $indexable_key ) {
			$indexable->{$indexable_key} = $term_meta[ $meta_key ];
		}

		$indexable->primary_focus_keyword_score = $this->get_keyword_score( $term_meta['wpseo_focuskw'], $term_meta['wpseo_linkdex'] );

		$indexable->is_robots_noindex = $this->get_noindex_value( $term_meta['wpseo_noindex'] );

		// Not implemented yet.
		$indexable->is_cornerstone     = 0;
		$indexable->is_robots_nofollow = 0;

		$indexable->save();

		if ( ! empty( $indexable->id ) ) {
			$this->save_social_meta( $indexable, $term_meta );
		}
	}

	/**
	 * Retrieves an indexable for a term.
	 *
	 * @param int    $term_id     The term the indexable is based upon.
	 * @param string $taxonomy    The taxonomy the indexable belongs to.
	 * @param bool   $auto_create Optional. Creates an indexable if it does not exist yet.
	 *
	 * @return Indexable The indexable found for the supplied term.
	 *
	 * @throws No_Indexable_Found Exception when no indexable could be found for the supplied term.
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

		if ( ! $indexable ) {
			throw No_Indexable_Found::from_term_id( $term_id, $taxonomy );
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

			'wpseo_focuskw' => 'primary_focus_keyword',

			'wpseo_title'         => 'title',
			'wpseo_desc'          => 'description',
			'wpseo_content_score' => 'readability_score',

			'wpseo_bctitle' => 'breadcrumb_title',
		);

		return $meta_to_indexable;
	}

	/**
	 * Converts the meta noindex value to the indexable value.
	 *
	 * @param string $meta_value Term meta to base the value on.
	 *
	 * @return bool|null
	 */
	protected function get_noindex_value( $meta_value ) {
		switch ( (string) $meta_value ) {
			case 'noindex':
				return true;
			case 'index':
				return false;
		}

		return null;
	}

	/**
	 * Retrieves the meta data for a term.
	 *
	 * @codeCoverageIgnore
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
	 * @codeCoverageIgnore
	 *
	 * @param int    $term_id  The term to use.
	 * @param string $taxonomy Taxonomy to use.
	 *
	 * @return string|\WP_Error The permalink for the term.
	 */
	protected function get_permalink( $term_id, $taxonomy ) {
		return \get_term_link( $term_id, $taxonomy );
	}

	/**
	 * Determines the focus keyword score.
	 *
	 * @param string $keyword The focus keyword that is set.
	 * @param int    $score   The score saved on the meta data.
	 *
	 * @return null|int Score to use.
	 */
	protected function get_keyword_score( $keyword, $score ) {
		if ( empty( $keyword ) ) {
			return null;
		}

		return $score;
	}

	/**
	 * Lookup table for the social meta fields.
	 *
	 * @return array The social meta fields.
	 */
	protected function social_meta_lookup() {
		return array(
			'wpseo_opengraph-title'       => 'og_title',
			'wpseo_opengraph-description' => 'og_description',
			'wpseo_opengraph-image'       => 'og_image',
			'wpseo_twitter-title'         => 'twitter_title',
			'wpseo_twitter-description'   => 'twitter_description',
			'wpseo_twitter-image'         => 'twitter_image',
		);
	}

	/**
	 * Saves the social meta data.
	 *
	 * @param Indexable $indexable The indexable to save the id for.
	 * @param array     $term_meta The term meta data.
	 *
	 * @codeCoverageIgnore
	 */
	protected function save_social_meta( $indexable, $term_meta ) {
		$indexable_post_meta = new Indexable_Meta( $indexable->id );

		foreach ( $this->social_meta_lookup() as $meta_key => $indexable_key ) {
			$indexable_post_meta->set_meta( $indexable_key, $term_meta[ $meta_key ] );
		}
	}
}
