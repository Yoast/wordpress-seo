<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema Breadcrumb data.
 *
 * @since 10.2
 */
class WPSEO_Schema_Breadcrumb implements WPSEO_Graph_Piece {
	/**
	 * A value object with context variables.
	 *
	 * @var WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * WPSEO_Schema_Breadcrumb constructor.
	 *
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 */
	public function __construct( WPSEO_Schema_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( is_404() ) {
			return false;
		}

		if ( is_front_page() ) {
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
		$breadcrumbs_instance = WPSEO_Breadcrumbs::get_instance();
		$breadcrumbs          = $breadcrumbs_instance->get_links();
		$broken               = false;
		$list_elements        = array();

		foreach ( $breadcrumbs as $index => $breadcrumb ) {
			if ( ! empty( $breadcrumb['hide_in_schema'] ) ) {
				continue;
			}

			if ( ! array_key_exists( 'url', $breadcrumb ) || ! array_key_exists( 'text', $breadcrumb ) ) {
				$broken = true;
				break;
			}

			if ( empty( $breadcrumb['url'] ) ) {
				$breadcrumb['url'] = $this->context->canonical;
			}

			if ( empty( $breadcrumb['text'] ) ) {
				$breadcrumb['url'] = $this->context->title;
			}

			$list_elements[] = array(
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

		$data = array(
			'@type'           => 'BreadcrumbList',
			'@id'             => $this->context->canonical . WPSEO_Schema_Context::BREADCRUMB_HASH,
			'itemListElement' => $list_elements,
		);

		// Only output if JSON is correctly formatted.
		if ( ! $broken ) {
			return $data;
		}

		return false;
	}
}
