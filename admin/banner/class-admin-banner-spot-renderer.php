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
	 * @param WPSEO_Admin_Banner_Spot $banner_spot The spot to render.
	 *
	 * @return string
	 */
	public function render( WPSEO_Admin_Banner_Spot $banner_spot ) {
		$output = '<div class="yoast-sidebar__spot">';
		if ( $banner_spot->get_title() !== '' ) {
			$output .= '<strong>' . $banner_spot->get_title() . '</strong>';
		}

		if ( $banner_spot->get_extra() !== '' ) {
			$output .= $banner_spot->get_extra();
		}

		if ( $banner_spot->get_description() !== '' ) {
			$output .= '<p>' . $banner_spot->get_description() . '</p>';
		}

		$output .= $banner_spot->render_banner();
		$output .= '</div>';

		return $output;
	}
}
