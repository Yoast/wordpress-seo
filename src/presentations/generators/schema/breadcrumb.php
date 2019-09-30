<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

/**
 * Returns schema Breadcrumb data.
 *
 * @since 10.2
 */
class Breadcrumb extends Abstract_Schema_Piece {
	/**
	 * Current position in the List.
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( $this->current_page_helper->is_error_page() ) {
			return false;
		}

		if ( $this->current_page_helper->is_home_static_page() || $this->current_page_helper->is_home_posts_page() ) {
			return false;
		}

		if ( $this->context->breadcrumbs_enabled ) {
			return true;
		}

		return false;
	}

	/**
	 * Returns Schema breadcrumb data to allow recognition of page's position in the site hierarchy.
	 *
	 * @link https://developers.google.com/search/docs/data-types/breadcrumb
	 *
	 * @return bool|array Array on success, false on failure.
	 */
	public function generate() {
		$breadcrumbs_instance = \WPSEO_Breadcrumbs::get_instance();
		$breadcrumbs          = $breadcrumbs_instance->get_links();
		$broken               = false;
		$list_elements        = array();

		foreach ( $breadcrumbs as $index => $breadcrumb ) {
			if ( ! empty( $breadcrumb['hide_in_schema'] ) ) {
				continue;
			}

			if ( ! \array_key_exists( 'url', $breadcrumb ) || ! \array_key_exists( 'text', $breadcrumb ) ) {
				$broken = true;
				break;
			}
			$list_elements[] = $this->add_breadcrumb( $index, $breadcrumb );
			$this->index     = $index;
		}

		if ( \is_paged() ) {
			$list_elements[] = $this->add_paginated_state();
		}

		$data = array(
			'@type'           => 'BreadcrumbList',
			'@id'             => $this->context->canonical . $this->id_helper->breadcrumb_hash,
			'itemListElement' => $list_elements,
		);

		// Only output if JSON is correctly formatted.
		if ( ! $broken ) {
			return $data;
		}

		return false;
	}

	/**
	 * Returns a breadcrumb array.
	 *
	 * @param int   $index      The position in the list.
	 * @param array $breadcrumb The breadcrumb array.
	 *
	 * @return array A breadcrumb listItem.
	 */
	private function add_breadcrumb( $index, $breadcrumb ) {
		if ( empty( $breadcrumb['url'] ) ) {
			if ( \is_paged() ) {
				// Retrieve the un-paginated state of the current page.
				// @todo this _really_ needs to be replaced by something else, but we don't have the unpaged canonical I think.
				$breadcrumb['url'] = \WPSEO_Frontend::get_instance()->canonical( false, true );
			}
			else {
				$breadcrumb['url'] = $this->context->canonical;
			}
		}

		if ( empty( $breadcrumb['text'] ) ) {
			$breadcrumb['url'] = $this->context->title;
		}

		return array(
			'@type'    => 'ListItem',
			'position' => ( $index + 1 ),
			'item'     => array(
				'@type' => 'WebPage',
				'@id'   => $breadcrumb['url'],
				'url'   => $breadcrumb['url'], // For future proofing, we're trying to change the standard for this.
				'name'  => $breadcrumb['text'],
			),
		);
	}

	/**
	 * Adds the paginated state to the breadcrumb array.
	 *
	 * @return array A breadcrumb listItem.
	 */
	private function add_paginated_state() {
		$this->index++;
		return $this->add_breadcrumb(
			$this->index,
			array(
				'url'  => $this->context->canonical,
				'text' => $this->context->title,
			)
		);
	}
}
