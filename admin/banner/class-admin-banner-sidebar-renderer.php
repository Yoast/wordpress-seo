<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Banner
 */

/**
 * Represents the render object for generating the html for the banner sidebar
 */
class WPSEO_Admin_Banner_Sidebar_Renderer {

	/** @var  WPSEO_Admin_Banner_Spot_Renderer */
	protected $spot_renderer;

	/**
	 * Sets the spot renderer.
	 *
	 * @param WPSEO_Admin_Banner_Spot_Renderer $spot_renderer The spot renderer that has to be used.
	 */
	public function __construct( WPSEO_Admin_Banner_Spot_Renderer $spot_renderer ) {
		$this->spot_renderer = $spot_renderer;
	}

	/**
	 * Renders the admin banner sidebar.
	 *
	 * @param WPSEO_Admin_Banner_Sidebar $banner_sidebar The sidebar to render.
	 *
	 * @return string
	 */
	public function render( WPSEO_Admin_Banner_Sidebar $banner_sidebar ) {
		return sprintf( '
			<div class="wpseo_content_cell" id="sidebar-container">
				<div id="sidebar">
					<div class="wpseo_content_cell_title yoast-sidebar__title ">
						%1$s
					</div>
					%2$s
				</div>
			</div>',
			$banner_sidebar->get_title(),
			$this->render_banner_spots( $banner_sidebar->get_banner_spots() )
		);
	}

	/**
	 * Renders the admin banner spots.
	 *
	 * @param WPSEO_Admin_Banner_Spot[] $banner_spots The banner spots to render.
	 *
	 * @return string
	 */
	protected function render_banner_spots( array $banner_spots ) {
		$return = '';
		foreach ( $banner_spots as $banner_spot ) {
			$return .= $this->spot_renderer->render( $banner_spot );
		}

		return $return;
	}
}
