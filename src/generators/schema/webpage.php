<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Generators\Schema
 */

namespace Yoast\WP\SEO\Generators\Schema;

use WP_Post;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;

/**
 * Returns schema WebPage data.
 *
 * @since 10.2
 */
class WebPage extends Abstract_Schema_Piece {

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page;

	/**
	 * The HTML helper.
	 *
	 * @var HTML_Helper
	 */
	private $html;

	/**
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	private $date;

	/**
	 * The language helper.
	 *
	 * @var Language_Helper
	 */
	private $language;

	/**
	 * WebPage constructor.
	 *
	 * @param Current_Page_Helper $current_page The current page helper.
	 * @param HTML_Helper         $html         The HTML helper.
	 * @param Date_Helper         $date         The date helper.
	 * @param Language_Helper     $language     The language helper.
	 */
	public function __construct(
		Current_Page_Helper $current_page,
		HTML_Helper $html,
		Date_Helper $date,
		Language_Helper $language
	) {
		$this->current_page = $current_page;
		$this->date         = $date;
		$this->html         = $html;
		$this->language     = $language;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		return $context->indexable->object_type !== 'system-page' && $context->indexable->object_sub_type !== '404';
	}

	/**
	 * Returns WebPage schema data.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array WebPage schema data.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$data = [
			'@type'      => $context->schema_page_type,
			'@id'        => $context->canonical . $this->id->webpage_hash,
			'url'        => $context->canonical,
			'name'       => $this->html->smart_strip_tags( $context->title ),
			'isPartOf'   => [
				'@id' => $context->site_url . $this->id->website_hash,
			],
		];

		if ( $this->current_page->is_front_page() ) {
			if ( $context->site_represents_reference ) {
				$data['about'] = $context->site_represents_reference;
			}
		}

		if ( $context->indexable->object_type === 'post' ) {
			$this->add_image( $data, $context );

			$data['datePublished'] = $this->date->format( $context->post->post_date_gmt );
			$data['dateModified']  = $this->date->format( $context->post->post_modified_gmt );

			if ( $context->indexable->object_sub_type === 'post' ) {
				$data = $this->add_author( $data, $context->post, $context );
			}
		}

		if ( ! empty( $context->description ) ) {
			$data['description'] = $this->html->smart_strip_tags( $context->description );
		}

		if ( $this->add_breadcrumbs( $context ) ) {
			$data['breadcrumb'] = [
				'@id' => $context->canonical . $this->id->breadcrumb_hash,
			];
		}

		$data = $this->language->add_piece_language( $data );
		$data = $this->add_potential_action( $data, $context );

		return $data;
	}

	/**
	 * Adds an author property to the $data if the WebPage is not represented.
	 *
	 * @param array             $data    The WebPage schema.
	 * @param WP_Post           $post    The post the context is representing.
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array The WebPage schema.
	 */
	public function add_author( $data, $post, Meta_Tags_Context $context ) {
		if ( $context->site_represents === false ) {
			$data['author'] = [ '@id' => $this->id->get_user_schema_id( $post->post_author, $context ) ];
		}

		return $data;
	}

	/**
	 * If we have an image, make it the primary image of the page.
	 *
	 * @param array             $data    WebPage schema data.
	 * @param Meta_Tags_Context $context The meta tags context.
	 */
	public function add_image( &$data, Meta_Tags_Context $context ) {
		if ( $context->has_image ) {
			$data['primaryImageOfPage'] = [ '@id' => $context->canonical . $this->id->primary_image_hash ];
		}
	}

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	private function add_breadcrumbs( Meta_Tags_Context $context ) {
		if ( $context->indexable->object_type === 'home-page' || $this->current_page->is_home_static_page() ) {
			return false;
		}

		if ( $context->breadcrumbs_enabled ) {
			return true;
		}

		return false;
	}

	/**
	 * Adds the potential action property to the WebPage Schema piece.
	 *
	 * @param array             $data    The WebPage data.
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array $data The WebPage data with the potential action added.
	 */
	private function add_potential_action( $data, Meta_Tags_Context $context ) {
		if ( $context->generate_schema_page_type() !== 'WebPage' ) {
			return $data;
		}

		/**
		 * Filter: 'wpseo_schema_webpage_potential_action_target' - Allows filtering of the schema WebPage potentialAction target.
		 *
		 * @api array $targets The URLs for the WebPage potentialAction target.
		 */
		$targets = \apply_filters( 'wpseo_schema_webpage_potential_action_target', [ $context->canonical ] );

		$data['potentialAction'][] = [
			'@type'  => 'ReadAction',
			'target' => $targets,
		];

		return $data;
	}
}
