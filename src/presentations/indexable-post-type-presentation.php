<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Pagination_Helper;
use Yoast\WP\Free\Helpers\Post_Type_Helper;
use Yoast\WP\Free\Helpers\Date_Helper;

/**
 * Class Indexable_Post_Type_Presentation
 */
class Indexable_Post_Type_Presentation extends Indexable_Presentation {

	/**
	 * Holds the Post_Type_Helper instance.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type;

	/**
	 * Holds the Date_Helper instance.
	 *
	 * @var Date_Helper
	 */
	protected $date;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper
	 */
	protected $pagination;

	/**
	 * Indexable_Post_Type_Presentation constructor.
	 *
	 * @param Post_Type_Helper  $post_type  The post type helper.
	 * @param Date_Helper       $date       The date helper.
	 * @param Pagination_Helper $pagination The pagination helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct(
		Post_Type_Helper $post_type,
		Date_Helper $date,
		Pagination_Helper $pagination
	) {
		$this->post_type  = $post_type;
		$this->date       = $date;
		$this->pagination = $pagination;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_canonical() {
		return $this->build_paginated_canonical( false );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_rel_prev() {
		return $this->build_rel_prev( false );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_rel_next() {
		return $this->build_rel_next( false );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		// Get SEO title as entered in Search appearance.
		$post_type = $this->model->object_sub_type;
		$title     = $this->options_helper->get( 'title-' . $this->model->object_sub_type );
		if ( $title ) {
			return $title;
		}

		// Get installation default title.
		return $this->options_helper->get_title_default( 'title-' . $post_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return $this->options_helper->get( 'metadesc-' . $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_og_description() {
		if ( $this->model->og_description ) {
			$og_description = $this->model->og_description;
		}

		if ( empty( $og_description ) ) {
			$og_description = $this->meta_description;
		}

		if ( empty( $og_description ) ) {
			$og_description = $this->post_type->get_the_excerpt( $this->model->object_id );
		}

		return $this->post_type->strip_shortcodes( $og_description );
	}

	/**
	 * Generates the open graph images.
	 *
	 * @return array The open graph images.
	 */
	public function generate_og_images() {
		if ( \post_password_required() ) {
			return [];
		}

		return parent::generate_og_images();
	}

	/**
	 * @inheritDoc
	 */
	public function generate_og_type() {
		return 'article';
	}

	/**
	 * Generates the open graph article author.
	 *
	 * @return string The open graph article author.
	 */
	public function generate_og_article_author() {
		$post = $this->replace_vars_object;

		$og_article_author = $this->user->get_the_author_meta( 'facebook', $post->post_author );

		if ( $og_article_author ) {
			return $og_article_author;
		}

		return '';
	}

	/**
	 * Generates the open graph article publisher.
	 *
	 * @return string The open graph article publisher.
	 */
	public function generate_og_article_publisher() {
		$og_article_publisher = $this->context->open_graph_publisher;

		if ( $og_article_publisher ) {
			return $og_article_publisher;
		}

		return '';
	}

	/**
	 * Generates the open graph article published time.
	 *
	 * @return string The open graph article published time.
	 */
	public function generate_og_article_published_time() {
		if ( $this->model->object_sub_type !== 'post' ) {
			/**
			 * Filter: 'wpseo_opengraph_show_publish_date' - Allow showing publication date for other post types.
			 *
			 * @param string $post_type The current URL's post type.
			 *
			 * @api bool Whether or not to show publish date.
			 */
			if ( ! apply_filters( 'wpseo_opengraph_show_publish_date', false, $this->post_type->get_post_type( $this->context->post ) ) ) {
				return '';
			}
		}

		return $this->date->mysql_date_to_w3c_format( $this->context->post->post_date_gmt );
	}

	/**
	 * Generates the open graph article modified time.
	 *
	 * @return string The open graph article modified time.
	 */
	public function generate_og_article_modified_time() {
		if ( $this->context->post->post_modified_gmt !== $this->context->post->post_date_gmt ) {
			return $this->date->mysql_date_to_w3c_format( $this->context->post->post_modified_gmt );
		}

		return '';
	}

	/**
	 * @inheritDoc
	 */
	public function generate_replace_vars_object() {
		return \get_post( $this->model->object_id );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = array_merge(
			$this->robots_helper->get_base_values( $this->model ),
			[
				'noimageindex' => ( $this->model->is_robots_noimageindex === true ) ? 'noimageindex' : null,
				'noarchive'    => ( $this->model->is_robots_noarchive === true ) ? 'noarchive' : null,
				'nosnippet'    => ( $this->model->is_robots_nosnippet === true ) ? 'nosnippet' : null,
			]
		);

		$private           = \get_post_status( $this->model->object_id ) === 'private';
		$post_type_noindex = ! $this->post_type->is_indexable( $this->model->object_sub_type );

		if ( $private || $post_type_noindex ) {
			$robots['index'] = 'noindex';
		}

		return $this->robots_helper->after_generate( $robots );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_description() {
		$twitter_description = parent::generate_twitter_description();

		if ( $twitter_description ) {
			return $twitter_description;
		}

		return $this->post_type->get_the_excerpt( $this->model->object_id );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_image() {
		if ( \post_password_required() ) {
			return '';
		}

		return parent::generate_twitter_image();
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_creator() {
		$twitter_creator = \ltrim( \trim( \get_the_author_meta( 'twitter', $this->context->post->post_author ) ), '@' );

		/**
		 * Filter: 'wpseo_twitter_creator_account' - Allow changing the Twitter account as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $twitter The twitter account name string.
		 */
		$twitter_creator = \apply_filters( 'wpseo_twitter_creator_account', $twitter_creator );

		if ( \is_string( $twitter_creator ) && $twitter_creator !== '' ) {
			return '@' . $twitter_creator;
		}

		$site_twitter = $this->options_helper->get( 'twitter_site', '' );
		if ( \is_string( $site_twitter ) && $site_twitter !== '' ) {
			return '@' . $site_twitter;
		}

		return '';
	}

	/**
	 * Creates a paginated canonical for the current page.
	 *
	 * @param boolean $add_pagination_base Whether the pagination base should be added.
	 *
	 * @return string The canonical.
	 */
	protected function build_paginated_canonical( $add_pagination_base ) {
		if ( $this->model->canonical ) {
			return $this->model->canonical;
		}

		$canonical = $this->model->permalink;

		// Fix paginated pages canonical, but only if the page is truly paginated.
		$current_page = $this->pagination->get_current_post_page_number();
		if ( $current_page > 1 ) {
			$number_of_pages = $this->model->number_of_pages;
			if ( $number_of_pages && $current_page <= $number_of_pages ) {
				$canonical = $this->pagination->get_paginated_url( $canonical, $current_page, $add_pagination_base );
			}
		}

		return $this->url->ensure_absolute_url( $canonical );
	}

	/**
	 * Creates a rel prev link for the current page.
	 *
	 * @param boolean $add_pagination_base Whether the pagination base should be added.
	 *
	 * @return string The rel prev link.
	 */
	protected function build_rel_prev( $add_pagination_base ) {
		if ( $this->model->number_of_pages === null ) {
			return '';
		}

		if ( $this->pagination->is_rel_adjacent_disabled() ) {
			return '';
		}

		$current_page = \max( 1, $this->pagination->get_current_post_page_number() );
		// Check if there is a previous page.
		if ( $current_page < 2 ) {
			return '';
		}
		// Check if the previous page is the first page.
		if ( $current_page === 2 ) {
			return $this->model->permalink;
		}

		return $this->pagination->get_paginated_url( $this->model->permalink, ( $current_page - 1 ), $add_pagination_base );
	}

	/**
	 * Creates a rel next link for the current page.
	 *
	 * @param boolean $add_pagination_base Whether the pagination base should be added.
	 *
	 * @return string The rel next link.
	 */
	protected function build_rel_next( $add_pagination_base ) {
		if ( $this->model->number_of_pages === null ) {
			return '';
		}

		if ( $this->pagination->is_rel_adjacent_disabled() ) {
			return '';
		}

		$current_page = \max( 1, $this->pagination->get_current_post_page_number() );
		if ( $this->model->number_of_pages <= $current_page ) {
			return '';
		}

		return $this->pagination->get_paginated_url( $this->model->permalink, ( $current_page + 1 ), $add_pagination_base );
	}

}
