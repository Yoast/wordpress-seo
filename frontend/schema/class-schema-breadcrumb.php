<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Class WPSEO_Schema_Breadcrumb
 *
 * Outputs schema Breadcrumb code.
 *
 * @since 10.1
 */
class WPSEO_Schema_Breadcrumb implements WPSEO_Graph_Piece {
	/**
	 * Outputs code to allow recognition of page's position in the site hierarchy
	 *
	 * @link https://developers.google.com/search/docs/data-types/breadcrumb
	 *
	 * @return bool|array Array on success, false on failure.
	 */
	public function add_to_graph() {
		if ( ! $this->add_breadcrumbs() ) {
			return false;
		}

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
				$breadcrumb['url'] = WPSEO_Frontend::get_instance()->canonical( false );
			}

			if ( empty( $breadcrumb['text'] ) ) {
				$breadcrumb['url'] = WPSEO_Frontend::get_instance()->title( '' );
			}

			$list_elements[] = array(
				'@type'    => 'ListItem',
				'position' => ( $index + 1 ),
				'item'     => array(
					'@type' => 'WebPage',
					'@id'   => $breadcrumb['url'],
					'name'  => $breadcrumb['text'],
				),
			);
		}

		$data = array(
			'@type'           => 'BreadcrumbList',
			'@id'             => WPSEO_Frontend::get_instance()->canonical( false ) . '#breadcrumb',
			'itemListElement' => $list_elements,
		);

		// Only output if JSON is correctly formatted.
		if ( ! $broken ) {
			return $data;
		}

		return false;
	}

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @return bool
	 */
	private function add_breadcrumbs() {
		if ( is_front_page() ) {
			return false;
		}

		$breadcrumbs_enabled = current_theme_supports( 'yoast-seo-breadcrumbs' );
		if ( ! $breadcrumbs_enabled ) {
			$breadcrumbs_enabled = WPSEO_Options::get( 'breadcrumbs-enable', false );
		}
		if ( $breadcrumbs_enabled ) {
			return true;
		}

		return false;
	}
}
