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
class WPSEO_Schema_Breadcrumb extends WPSEO_JSON_LD implements WPSEO_WordPress_Integration {
	/**
	 * Registers hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wpseo_json_ld', [ $this, 'breadcrumb' ] );
	}

	/**
	 * Outputs code to allow recognition of page's position in the site hierarchy
	 *
	 * @Link https://developers.google.com/search/docs/data-types/breadcrumb
	 *
	 * @return void
	 */
	public function breadcrumb() {
		$breadcrumbs_enabled = current_theme_supports( 'yoast-seo-breadcrumbs' );
		if ( ! $breadcrumbs_enabled ) {
			$breadcrumbs_enabled = WPSEO_Options::get( 'breadcrumbs-enable', false );
		}

		if ( is_front_page() || ! $breadcrumbs_enabled ) {
			return;
		}

		$data = array(
			'@context'        => 'https://schema.org',
			'@type'           => 'BreadcrumbList',
			'itemListElement' => array(),
		);

		$breadcrumbs_instance = WPSEO_Breadcrumbs::get_instance();
		$breadcrumbs          = $breadcrumbs_instance->get_links();
		$broken               = false;

		foreach ( $breadcrumbs as $index => $breadcrumb ) {
			if ( ! empty( $breadcrumb['hide_in_schema'] ) ) {
				continue;
			}

			if ( ! array_key_exists( 'url', $breadcrumb ) || ! array_key_exists( 'text', $breadcrumb ) ) {
				$broken = true;
				break;
			}

			$data['itemListElement'][] = array(
				'@type'    => 'ListItem',
				'position' => ( $index + 1 ),
				'item'     => array(
					'@id'  => $breadcrumb['url'],
					'name' => $breadcrumb['text'],
				),
			);
		}

		// Only output if JSON is correctly formatted.
		if ( ! $broken ) {
			$this->output( $data, 'breadcrumb' );
		}
	}

}
