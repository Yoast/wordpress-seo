<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Presentations\Generators\Schema
 */

namespace Yoast\WP\SEO\Presentations\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;

/**
 * Returns schema Breadcrumb data.
 *
 * @since 10.2
 */
class Breadcrumb extends Abstract_Schema_Piece {

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page;

	/**
	 * Breadcrumb constructor.
	 *
	 * @param Current_Page_Helper $current_page The current page helper.
	 *
	 * @codeCoverageIgnore Constructor.
	 */
	public function __construct( Current_Page_Helper $current_page ) {
		$this->current_page = $current_page;
	}

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		if ( $context->indexable->object_type === 'system-page' && $context->indexable->object_sub_type === '404' ) {
			return false;
		}

		if ( $context->indexable->object_type === 'home-page' || $this->current_page->is_home_static_page() ) {
			return false;
		}

		if ( $context->breadcrumbs_enabled ) {
			return true;
		}

		return false;
	}

	/**
	 * Returns Schema breadcrumb data to allow recognition of page's position in the site hierarchy.
	 *
	 * @link https://developers.google.com/search/docs/data-types/breadcrumb
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool|array Array on success, false on failure.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$breadcrumbs   = $context->presentation->breadcrumbs;
		$list_elements = [];

		// Only output breadcrumbs that are not hidden.
		$breadcrumbs = array_filter( $breadcrumbs, [ $this, 'not_hidden' ] );

		reset( $breadcrumbs );

		/*
		 * Check whether at least one of the breadcrumbs is broken.
		 * If so, do not output anything.
		 */
		foreach ( $breadcrumbs as $breadcrumb ) {
			if ( $this->is_broken( $breadcrumb ) ) {
				return false;
			}
		}


		// Create the last breadcrumb.
		$last_breadcrumb = array_pop( $breadcrumbs );
		$breadcrumbs[]   = $this->format_last_breadcrumb( $last_breadcrumb, $context );

		// Add a paginated state if the current page is paged.
		if ( $this->current_page->is_paged() ) {
			$breadcrumbs[] = [
				'url'  => $context->canonical,
				'text' => $context->title,
			];
		}

		// Create intermediate breadcrumbs.
		foreach ( $breadcrumbs as $index => $breadcrumb ) {
			$list_elements[] = $this->create_breadcrumb( $index, $breadcrumb );
		}

		return [
			'@type'           => 'BreadcrumbList',
			'@id'             => $context->canonical . $this->id->breadcrumb_hash,
			'itemListElement' => $list_elements,
		];
	}

	/**
	 * Returns a breadcrumb array.
	 *
	 * @param int   $index      The position in the list.
	 * @param array $breadcrumb The position in the list.
	 *
	 * @return array A breadcrumb listItem.
	 */
	private function create_breadcrumb( $index, $breadcrumb ) {
		return [
			'@type'    => 'ListItem',
			'position' => ( $index + 1 ),
			'item'     => [
				'@type' => 'WebPage',
				'@id'   => $breadcrumb['url'],
				'url'   => $breadcrumb['url'], // For future proofing, we're trying to change the standard for this.
				'name'  => $breadcrumb['text'],
			],
		];
	}

	/**
	 * Creates the last breadcrumb in the breadcrumb list.
	 * Provides a fallback for the URL and text:
	 *  - URL falls back to the canonical of current page.
	 *  - text falls back to the title of current page.
	 *
	 * @param array             $breadcrumb The position in the list.
	 * @param Meta_Tags_Context $context    The meta tags context.
	 *
	 * @return array The last of the breadcrumbs.
	 */
	private function format_last_breadcrumb( $breadcrumb, $context ) {
		if ( empty( $breadcrumb['url'] ) ) {
			$breadcrumb['url'] = $context->canonical;
		}
		if ( empty( $breadcrumb['text'] ) ) {
			$breadcrumb['text'] = $context->title;
		}

		return $breadcrumb;
	}

	/**
	 * Tests if the breadcrumb is broken.
	 * A breadcrumb is considered broken when it has no URL or text.
	 *
	 * @param array $breadcrumb The breadcrumb to test.
	 *
	 * @return bool `true` if the breadcrumb is broken.
	 */
	private function is_broken( $breadcrumb ) {
		return ! \array_key_exists( 'url', $breadcrumb ) || ! \array_key_exists( 'text', $breadcrumb );
	}

	/**
	 * Checks whether the breadcrumb is not set to be hidden.
	 *
	 * @param array $breadcrumb The breadcrumb array.
	 *
	 * @return bool If the breadcrumb should not be hidden.
	 */
	private function not_hidden( $breadcrumb ) {
		return empty( $breadcrumb['hide_in_schema'] );
	}
}
