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
	 * @var Current_Page_Helper
	 */
	private $current_page;

	/**
	 * Breadcrumb constructor.
	 *
	 * @param Current_Page_Helper $current_page The current page helper.
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
		if ( $context->indexable->object_type === 'error-page' ) {
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
		$broken        = false;
		$list_elements = [];

		foreach ( $breadcrumbs as $index => $breadcrumb ) {
			if ( ! empty( $breadcrumb['hide_in_schema'] ) ) {
				continue;
			}

			if ( ! \array_key_exists( 'url', $breadcrumb ) || ! \array_key_exists( 'text', $breadcrumb ) ) {
				$broken = true;
				break;
			}
			$list_elements[] = $this->add_breadcrumb( $index, $breadcrumb, $context );
		}

		// Only output if JSON is correctly formatted.
		if ( $broken ) {
			return false;
		}

		if ( \is_paged() ) {
			$list_elements[] = $this->add_paginated_state( $index, $context );
		}

		return [
			'@type'           => 'BreadcrumbList',
			'@id'             => $context->canonical . $this->id_helper->breadcrumb_hash,
			'itemListElement' => $list_elements,
		];
	}

	/**
	 * Returns a breadcrumb array.
	 *
	 * @param int               $index      The position in the list.
	 * @param array             $breadcrumb The breadcrumb array.
	 * @param Meta_Tags_Context $context    The meta tags context.
	 *
	 * @return array A breadcrumb listItem.
	 */
	private function add_breadcrumb( $index, $breadcrumb, Meta_Tags_Context $context ) {
		if ( empty( $breadcrumb['url'] ) ) {
			$breadcrumb['url'] = $context->canonical;
		}

		if ( empty( $breadcrumb['text'] ) ) {
			$breadcrumb['text'] = $context->title;
		}

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
	 * Adds the paginated state to the breadcrumb array.
	 *
	 * @param int               $index   The index.
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array A breadcrumb listItem.
	 */
	private function add_paginated_state( $index, Meta_Tags_Context $context ) {
		return $this->add_breadcrumb(
			( $index + 1 ),
			[ 'url' => $context->canonical, 'text' => $context->title ],
			$context
		);
	}
}
