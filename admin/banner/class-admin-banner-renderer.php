<?php
/**
 * @package WPSEO\Admin\Banner
 */

/**
 * Represents the render object for generating the html for the given banner.
 */
class WPSEO_Admin_Banner_Renderer {

	/** @var string */
	protected $base_path = '';

	/**
	 * Renders the admin banner.
	 *
	 * @param WPSEO_Admin_Banner $banner The banner to render.
	 *
	 * @return string
	 */
	public function render( WPSEO_Admin_Banner $banner ) {
		$output  = '<a class="wpseo-banner__link" target="_blank" href="' . esc_url( $banner->get_url() ) . '">';
		$output .= '<img class="wpseo-banner__image" width="' . esc_attr( $banner->get_width() ) . '" height="' . esc_attr( $banner->get_height() ) . '" src="' . esc_attr( $this->get_image_path( $banner->get_image() ) ) . '" alt="' . esc_attr( $banner->get_alt() ) . '"/>';
		$output .= '</a>';

		return $output;
	}

	/**
	 * Sets the base path, where the images are located.
	 *
	 * @param string $base_path The image location.
	 */
	public function set_base_path( $base_path ) {
		$this->base_path = $base_path;
	}

	/**
	 * Returns the full path for the image.
	 *
	 * @param string $image The image path.
	 *
	 * @return string
	 */
	protected function get_image_path( $image ) {
		return rtrim( $this->base_path, '/' ) . '/' . ltrim( $image, '/' );
	}
}
