<?php
/**
 * @package WPSEO\Admin\Banner
 */

/**
 * Represents the render object for generating the html for the given banner spot.
 */
class WPSEO_Admin_Banner_Spot_Renderer {

	/**
	 * Renders the admin banner spot.
	 *
	 * @param WPSEO_Admin_Banner_Spot     $banner_spot     The spot to render.
	 * @param WPSEO_Admin_Banner_Renderer $banner_renderer The banner renderer, for rendering the banner.
	 *
	 * @return string
	 */
	public function render( WPSEO_Admin_Banner_Spot $banner_spot, WPSEO_Admin_Banner_Renderer $banner_renderer ) {
		$banner = $banner_spot->get_random_banner();

		if ( $banner === null ) {
			return '';
		}

		$output  = '<div class="yoast-sidebar__spot"><strong>' . $banner_spot->get_title() . '</strong>';
		$output .= '<p>' . $banner_spot->get_description() . '</p>';
		$output .= $banner_renderer->render( $banner );
		$output .= '</div>';

		return $output;
	}
}
