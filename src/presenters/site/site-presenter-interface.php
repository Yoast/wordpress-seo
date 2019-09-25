<?php
/**
 * Interface for site presenters.
 *
 * @package Yoast\YoastSEO\Presenters\Site
 */

namespace Yoast\WP\Free\Presenters\Site;

/**
 * Interface Site_Presenter_Interface
 */
interface Site_Presenter_Interface {
	/**
	 * Presents a site wide meta tag.
	 *
	 * @return string HTML to be output on the front-end.
	 */
	public function present();
}
