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
		$banner = $this->get_random_banner( $banner_spot->get_banners() );

		$output  = '<div class="sidebar-spot"><strong>' . $banner_spot->get_title() . '</strong>';
		$output .= '<p>' . $banner_spot->get_description() . '</p>';
		$output .= $banner_renderer->render( $banner );
		$output .= '</div>';

		return $output;
	}

	/**
	 * Returns a random banner.
	 *
	 * @param WPSEO_Admin_Banner[] $banners Array with banners.
	 *
	 * @return WPSEO_Admin_Banner
	 */
	protected function get_random_banner( array $banners ) {
		$total_banners = count( $banners );
		$random_banner = 0;

		if ( $total_banners > 1 ) {
			$random_banner = rand( 0, $total_banners );
		}

		return $banners[ $random_banner ];

	}
}
