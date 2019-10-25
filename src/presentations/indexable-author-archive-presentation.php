<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Post_Type_Helper;
use Yoast\WP\Free\Helpers\Rel_Adjacent_Helper;
use Yoast\WP\Free\Wrappers\WP_Query_Wrapper;

/**
 * Class Indexable_Author_Archive_Presentation
 */
class Indexable_Author_Archive_Presentation extends Indexable_Presentation {

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
	protected $post_type_helper;

	/**
	 * Holds the rel adjacent helper instance.
	 *
	 * @var Rel_Adjacent_Helper
	 */
	protected $rel_adjacent;

	/**
	 * Indexable_Author_Archive_Presentation constructor.
	 *
	 * @param WP_Query_Wrapper    $wp_query_wrapper The wp query wrapper.
	 * @param Post_Type_Helper    $post_type_helper The post type helper.
	 * @param Rel_Adjacent_Helper $rel_adjacent     The rel adjacent helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct(
		WP_Query_Wrapper $wp_query_wrapper,
		Post_Type_Helper $post_type_helper,
		Rel_Adjacent_Helper $rel_adjacent
	) {
		$this->wp_query_wrapper = $wp_query_wrapper;
		$this->post_type_helper = $post_type_helper;
		$this->rel_adjacent     = $rel_adjacent;
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

		$current_page = $this->current_page->get_current_archive_page();
		if ( $current_page > 1 ) {
			return $this->rel_adjacent->get_paginated_url( $this->model->permalink, $current_page );
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
		$title             = $this->options_helper->get( $option_titles_key );
		if ( $title ) {
			return $title;
		}

		return $this->options_helper->get_title_default( $option_titles_key );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_title() {
		return $this->title;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		$option_titles_key = 'metadesc-author-wpseo';
		$description       = $this->options_helper->get( $option_titles_key );
		if ( $description ) {
			return $description;
		}

		return $this->options_helper->get_title_default( $option_titles_key );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = $this->robots_helper->get_base_values( $this->model );

		// Global option: "Show author archives in search results".
		if ( $this->options_helper->get( 'noindex-author-wpseo', false ) ) {
			$robots['index'] = 'noindex';

			return $this->robots_helper->after_generate( $robots );
		}

		$current_author = $this->wp_query_wrapper->get_query()->get_queried_object();

		// Safety check. The call to `get_user_data` could return false (called in `get_queried_object`).
		if ( $current_author === false ) {
			$robots['index'] = 'noindex';

			return $this->robots_helper->after_generate( $robots );
		}

		$public_post_types = $this->post_type_helper->get_public_post_types();

		// Global option: "Show archives for authors without posts in search results".
		if ( $this->options_helper->get( 'noindex-author-noposts-wpseo', false ) && $this->user->count_posts( $current_author->ID, $public_post_types ) === 0 ) {
			$robots['index'] = 'noindex';

			return $this->robots_helper->after_generate( $robots );
		}

		// User option: "Do not allow search engines to show this author's archives in search results".
		if ( $this->user->get_meta( $current_author->ID, 'wpseo_noindex_author', true ) === 'on' ) {
			$robots['index'] = 'noindex';

			return $this->robots_helper->after_generate( $robots );
		}

		return $this->robots_helper->after_generate( $robots );
	}
}
