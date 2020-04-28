<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\SEO\Presentations;

use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Class Indexable_Presentation
 *
 * @property \WP_Term $source
 */
class Indexable_Term_Archive_Presentation extends Indexable_Presentation {
	use Archive_Adjacent;

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
	 * Indexable_Post_Type_Presentation constructor.
	 *
	 * @param WP_Query_Wrapper $wp_query_wrapper The wp query wrapper.
	 * @param Taxonomy_Helper  $taxonomy         The Taxonomy helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct(
		WP_Query_Wrapper $wp_query_wrapper,
		Taxonomy_Helper $taxonomy
	) {
		$this->wp_query_wrapper = $wp_query_wrapper;
		$this->taxonomy         = $taxonomy;
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

		$current_page = $this->pagination->get_current_archive_page_number();
		if ( $current_page > 1 ) {
			return $this->pagination->get_paginated_url( $this->model->permalink, $current_page );
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

		return $this->options->get( 'metadesc-tax-' . $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_source() {
		return \get_term( $this->model->object_id, $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_open_graph_description() {
		$open_graph_description = parent::generate_open_graph_description();
		if ( $open_graph_description ) {
			return $open_graph_description;
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

		if ( $this->open_graph_description && $this->context->open_graph_enabled === true ) {
			return '';
		}

		return $this->taxonomy->get_term_description( $this->model->object_id );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = $this->get_base_robots();

		/**
		 * If its a multiple terms archive page return a noindex.
		 */
		if ( $this->current_page->is_multiple_terms_page() ) {
			$robots['index'] = 'noindex';

			return $this->filter_robots( $robots );
		}

		/**
		 * First we get the no index option for this taxonomy, because it can be overwritten the indexable value for
		 * this specific term.
		 */
		if ( ! $this->taxonomy->is_indexable( $this->source->taxonomy ) ) {
			$robots['index'] = 'noindex';
		}

		/**
		 * Overwrite the index directive when there is a term specific directive set.
		 */
		if ( $this->model->is_robots_noindex !== null ) {
			$robots['index'] = ( $this->model->is_robots_noindex ) ? 'noindex' : 'index';
		}

		return $this->filter_robots( $robots );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		// Get the SEO title as entered in Search Appearance.
		$title = $this->options->get( 'title-tax-' . $this->source->taxonomy );
		if ( $title ) {
			return $title;
		}

		// Get the installation default title.
		$title = $this->options->get_title_default( 'title-tax-' . $this->source->taxonomy );

		return $title;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_open_graph_type() {
		return 'article';
	}

	/**
	 * Checks if term archive query is for multiple terms (/term-1,term-2/ or /term-1+term-2/).
	 *
	 * @return bool Whether the query contains multiple terms.
	 */
	protected function is_multiple_terms_query() {
		$query = $this->wp_query_wrapper->get_query();

		if ( ! isset( $query->tax_query ) ) {
			return false;
		}

		$queried_terms = $query->tax_query->queried_terms;

		if ( empty( $queried_terms[ $this->source->taxonomy ]['terms'] ) ) {
			return false;
		}

		return \count( $queried_terms[ $this->source->taxonomy ]['terms'] ) > 1;
	}
}
