<?php

/**
 * Represents the render object for generating the html for the given banner.
 */
class WPSEO_Admin_Banner_Renderer {

	/**
	 * Renders the admin banner.
	 *
	 * @param WPSEO_Admin_Banner $banner
	 *
	 * @return string
	 */
	public function render( WPSEO_Admin_Banner $banner ) {

		$output  = '<a target="_blank" href="' . $banner->get_url() . '">';
		$output .= '<img width="' . $banner->get_width() . '" height="' . $banner->get_height() . '" src="' . plugins_url( 'images/' . $banner->get_image(), WPSEO_FILE ) . '" alt="' . esc_attr( $banner->get_alt() ) . '"/>';
		$output .= '</a><br/><br/>';

		return $output;
	}


}