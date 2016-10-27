<?php
/**
 * @package WPSEO\Admin\Banner
 */

/**
 * Represents the an admin banner spot.
 */
class WPSEO_Admin_Banner_Spot {

	/** @var string */
	private $title;

	/** @var string  */
	private $description;

	/** @var WPSEO_Admin_Banner[] */
	private $banners = array();

	/**
	 * WPSEO_Admin_Banner_Spot constructor.
	 *
	 * @param string $title       The title for the spot.
	 * @param string $description The description for the spot.
	 */
	public function __construct( $title, $description ) {
		$this->title = $title;
		$this->description = $description;
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
	 * Adds an admin banner.
	 *
	 * @param WPSEO_Admin_Banner $banner The banner to add.
	 */
	public function add_banner( WPSEO_Admin_Banner $banner ) {
		$this->banners[] = $banner;
	}

	/**
	 * Returns a random banner.
	 *
	 * @return null|WPSEO_Admin_Banner
	 */
	public function get_random_banner() {

		if ( empty( $this->banners ) ) {
			return null;
		}

		$total_banners = count( $this->banners );
		if ( $total_banners === 1 ) {
			return $this->banners[0];
		}

		$random_banner = rand( 0, ( $total_banners - 1 ) );

		return $this->banners[ $random_banner ];
	}
}
