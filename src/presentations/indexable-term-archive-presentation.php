<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Rel_Adjacent_Helper;
use Yoast\WP\Free\Helpers\Taxonomy_Helper;
use Yoast\WP\Free\Wrappers\WP_Query_Wrapper;

/**
 * Class Indexable_Presentation
 *
 * @property \WP_Term $replace_vars_object
 */
class Indexable_Term_Archive_Presentation extends Indexable_Presentation {

	/**
	 * Holds the WP query wrapper instance.
	 *
	 * @var WP_Query_Wrapper
	 */
	private $wp_query_wrapper;

	/**
	 * Holds the taxonomy helper instance.
	 *
	 * @var Taxonomy_Helper
	 */
	private $taxonomy;

	/**
	 * Holds the rel adjacent helper instance.
	 *
	 * @var Rel_Adjacent_Helper
	 */
	private $rel_adjacent;

	/**
	 * Indexable_Post_Type_Presentation constructor.
	 *
	 * @param WP_Query_Wrapper    $wp_query_wrapper The wp query wrapper.
	 * @param Taxonomy_Helper     $taxonomy         The Taxonomy helper.
	 * @param Rel_Adjacent_Helper $rel_adjacent     The rel-adjacent helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct(
		WP_Query_Wrapper $wp_query_wrapper,
		Taxonomy_Helper $taxonomy,
		Rel_Adjacent_Helper $rel_adjacent
	) {
		$this->wp_query_wrapper = $wp_query_wrapper;
		$this->taxonomy         = $taxonomy;
		$this->rel_adjacent     = $rel_adjacent;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_canonical() {
		if ( $this->is_multiple_terms_query() ) {
			return '';
		}

		if ( $this->model->canonical ) {
			return $this->model->canonical;
		}

		if ( ! $this->model->permalink ) {
			return '';
		}

		$current_page = $this->current_page->get_current_archive_page();
		if ( $current_page > 1 ) {
			return $this->rel_adjacent->get_paginated_url( $this->model->permalink, $current_page );
		}

		return $this->model->permalink;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return $this->options_helper->get( 'metadesc-tax-' . $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_replace_vars_object() {
		return \get_term( $this->model->object_id, $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_og_description() {
		$og_description = parent::generate_og_description();
		if ( $og_description ) {
			return $og_description;
		}

		return $this->taxonomy->get_term_description( $this->model->object_id );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_description() {
		$twitter_description = parent::generate_twitter_description();
		if ( $twitter_description ) {
			return $twitter_description;
		}

		return $this->taxonomy->get_term_description( $this->model->object_id );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = $this->robots_helper->get_base_values( $this->model );

		/**
		 * If its a multiple terms archive page return a noindex.
		 */
		if ( $this->current_page->is_multiple_terms_page() ) {
			$robots['index'] = 'noindex';

			return $this->robots_helper->after_generate( $robots );
		}

		/**
		 * First we get the no index option for this taxonomy, because it can be overwritten the indexable value for
		 * this specific term.
		 */
		if ( ! $this->taxonomy->is_indexable( $this->replace_vars_object->taxonomy ) ) {
			$robots['index'] = 'noindex';
		}

		/**
		 * Overwrite the index directive when there is a term specific directive set.
		 */
		if ( $this->model->is_robots_noindex !== null ) {
			$robots['index'] = ( $this->model->is_robots_noindex ) ? 'noindex' : 'index';
		}

		return $this->robots_helper->after_generate( $robots );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		$title = $this->options_helper->get_title_default( 'title-tax-' . $this->replace_vars_object->taxonomy );

		return $title;
	}

	/**
	 * Checks if term archive query is for multiple terms (/term-1,term-2/ or /term-1+term-2/).
	 *
	 * @return bool Whether the query contains multiple terms.
	 */
	protected function is_multiple_terms_query() {
		$queried_terms = $this->wp_query_wrapper->get_query()->tax_query->queried_terms;

		if ( empty( $queried_terms[ $this->replace_vars_object->taxonomy ]['terms'] ) ) {
			return false;
		}

		return \count( $queried_terms[ $this->replace_vars_object->taxonomy ]['terms'] ) > 1;
	}
}
