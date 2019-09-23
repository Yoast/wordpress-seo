<?php

namespace Yoast\WP\Free\Presenters;

interface Site_Presenter_Interface {
	/**
	 * Presents an indexable.
	 *
	 * @return string HTML to be output on the front-end.
	 */
	public function present();
}
