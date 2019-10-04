<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\Free\Tests\Doubles\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Tests\Doubles\Presenters\Open_Graph;

use Yoast\WP\Free\Presenters\Open_Graph\Image_Presenter;

/**
 * Class Image_Presenter_Double
 */
class Image_Presenter_Double extends Image_Presenter {

	/**
	 * @inheritDoc
	 */
	public function filter( array $image ) {
		return parent::filter( $image );
	}
}
