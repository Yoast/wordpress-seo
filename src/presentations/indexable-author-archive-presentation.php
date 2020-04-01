<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\SEO\Presentations;

use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Class Indexable_Author_Archive_Presentation
 */
class Indexable_Author_Archive_Presentation extends Indexable_Presentation {
	use Archive_Adjacent;

	/**
	 * Holds the WP query wrapper instance.
	 *
	 * @var WP_Query_Wrapper
	 */
	protected $wp_query_wrapper;

	/**
	 * Holds the post type helper instance.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type;

	/**
	 * Indexable_Author_Archive_Presentation constructor.
	 *
	 * @param WP_Query_Wrapper $wp_query_wrapper The wp query wrapper.
	 * @param Post_Type_Helper $post_type The post type helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct(
		WP_Query_Wrapper $wp_query_wrapper,
		Post_Type_Helper $post_type
	) {
		$this->wp_query_wrapper = $wp_query_wrapper;
		$this->post_type        = $post_type;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_canonical() {
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
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		$option_titles_key = 'title-author-wpseo';
		$title             = $this->options->get( $option_titles_key );
		if ( $title ) {
			return $title;
		}

		return $this->options->get_title_default( $option_titles_key );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		$option_titles_key = 'metadesc-author-wpseo';
		$description       = $this->options->get( $option_titles_key );
		if ( $description ) {
			return $description;
		}

		return $this->options->get_title_default( $option_titles_key );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = parent::generate_robots();

		// Global option: "Show author archives in search results".
		if ( $this->options->get( 'noindex-author-wpseo', false ) ) {
			$robots['index'] = 'noindex';

			return $robots;
		}

		$current_author = $this->wp_query_wrapper->get_query()->get_queried_object();

		// Safety check. The call to `get_user_data` could return false (called in `get_queried_object`).
		if ( $current_author === false ) {
			$robots['index'] = 'noindex';

			return $robots;
		}

		$public_post_types = $this->post_type->get_public_post_types();

		// Global option: "Show archives for authors without posts in search results".
		if ( $this->options->get( 'noindex-author-noposts-wpseo', false ) && $this->user->count_posts( $current_author->ID, $public_post_types ) === 0 ) {
			$robots['index'] = 'noindex';

			return $robots;
		}

		// User option: "Do not allow search engines to show this author's archives in search results".
		if ( $this->user->get_meta( $current_author->ID, 'wpseo_noindex_author', true ) === 'on' ) {
			$robots['index'] = 'noindex';

			return $robots;
		}

		return $robots;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_open_graph_type() {
		return 'profile';
	}
}
