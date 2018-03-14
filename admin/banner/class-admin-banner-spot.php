<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Banner
 */

/**
 * Represents the an admin banner spot.
 */
class WPSEO_Admin_Banner_Spot {

	/** @var string */
	private $title;

	/** @var string */
	private $description = '';

	/** @var string */
	private $extra = '';

	/** @var WPSEO_Admin_Banner[] */
	private $banners = array();

	/**
	 * WPSEO_Admin_Banner_Spot constructor.
	 *
	 * @param string                      $title           The title for the spot.
	 * @param WPSEO_Admin_Banner_Renderer $banner_renderer The renderer for the banner.
	 */
	public function __construct( $title, WPSEO_Admin_Banner_Renderer $banner_renderer = null ) {
		$this->title           = $title;
		$this->banner_renderer = ( is_null( $banner_renderer ) ? new WPSEO_Admin_Banner_Renderer() : $banner_renderer );
	}

	/**
	 * Returns the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return $this->title;
	}

	/**
	 * Returns the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return $this->description;
	}

	/**
	 * Returns the extra content.
	 *
	 * @return string
	 */
	public function get_extra() {
		return $this->extra;
	}

	/**
	 * Sets the description
	 *
	 * @param string $description The description.
	 */
	public function set_description( $description ) {
		$this->description = $description;
	}

	/**
	 * Sets the "extra"
	 *
	 * @param string $extra The "extra".
	 */
	public function set_extra( $extra ) {
		$this->extra = $extra;
	}

	/**
	 * Adds an admin banner.
	 *
	 * @param WPSEO_Admin_Banner $banner The banner to add.
	 */
	public function add_banner( WPSEO_Admin_Banner $banner ) {
		$this->banners[] = $banner;
	}

	/**
	 * Renders the banner.
	 *
	 * @return string
	 */
	public function render_banner() {
		if ( ! $this->has_banners() ) {
			return '';
		}

		return $this->banner_renderer->render( $this->get_random_banner() );
	}

	/**
	 * Checks if there are any banners set.
	 *
	 * @return bool
	 */
	public function has_banners() {
		return ! empty( $this->banners );
	}

	/**
	 * Returns a random banner.
	 *
	 * @return null|WPSEO_Admin_Banner
	 */
	protected function get_random_banner() {
		return $this->banners[ array_rand( $this->banners, 1 ) ];
	}
}
