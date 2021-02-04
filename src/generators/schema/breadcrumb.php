<?php

namespace Yoast\WP\SEO\Generators\Schema;

use Yoast\WP\SEO\Config\Schema_IDs;

/**
 * Returns schema Breadcrumb data.
 */
class Breadcrumb extends Abstract_Schema_Piece {

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( $this->context->indexable->object_type === 'system-page' && $this->context->indexable->object_sub_type === '404' ) {
			return false;
		}

		return true;
	}

	/**
	 * Returns Schema breadcrumb data to allow recognition of page's position in the site hierarchy.
	 *
	 * @link https://developers.google.com/search/docs/data-types/breadcrumb
	 *
	 * @return bool|array Array on success, false on failure.
	 */
	public function generate() {
		$breadcrumbs   = $this->context->presentation->breadcrumbs;
		$list_elements = [];

		// In case of pagination, replace the last breadcrumb, because it only contains "Page [number]" and has no URL.
		if ( $this->helpers->current_page->is_paged() || ( $this->context->indexable->number_of_pages > 1 ) ) {
			\array_pop( $breadcrumbs );

			$breadcrumbs[] = [
				'url'  => $this->context->canonical,
				'text' => $this->context->title,
			];
		}

		// Only output breadcrumbs that are not hidden.
		$breadcrumbs = \array_filter( $breadcrumbs, [ $this, 'not_hidden' ] );

		\reset( $breadcrumbs );

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
		$last_breadcrumb = \array_pop( $breadcrumbs );
		$breadcrumbs[]   = $this->format_last_breadcrumb( $last_breadcrumb );

		// If this is a static front page, prevent nested pages from creating a trail.
		if ( $this->helpers->current_page->is_home_static_page() ) {

			// Check if we're dealing with a nested page.
			if ( \count( $breadcrumbs ) > 1 ) {

				// Store the breadcrumbs home variable before dropping the parent page from the Schema.
				$breadcrumbs_home = $breadcrumbs[0]['text'];
				$breadcrumbs      = [ \array_pop( $breadcrumbs ) ];

				// Make the child page show the breadcrumbs home variable rather than its own title.
				$breadcrumbs[0]['text'] = $breadcrumbs_home;
			}
		}

		// Create intermediate breadcrumbs.
		foreach ( $breadcrumbs as $index => $breadcrumb ) {
			$list_elements[] = $this->create_breadcrumb( $index, $breadcrumb );
		}

		return [
			'@type'           => 'BreadcrumbList',
			'@id'             => $this->context->canonical . Schema_IDs::BREADCRUMB_HASH,
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
				'name'  => $this->helpers->schema->html->smart_strip_tags( $breadcrumb['text'] ),
			],
		];
	}

	/**
	 * Creates the last breadcrumb in the breadcrumb list.
	 * Provides a fallback for the URL and text:
	 *  - URL falls back to the canonical of current page.
	 *  - text falls back to the title of current page.
	 *
	 * @param array $breadcrumb The position in the list.
	 *
	 * @return array The last of the breadcrumbs.
	 */
	private function format_last_breadcrumb( $breadcrumb ) {
		if ( empty( $breadcrumb['url'] ) ) {
			$breadcrumb['url'] = $this->context->canonical;
		}
		if ( empty( $breadcrumb['text'] ) ) {
			$breadcrumb['text'] = $this->helpers->schema->html->smart_strip_tags( $this->context->title );
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
