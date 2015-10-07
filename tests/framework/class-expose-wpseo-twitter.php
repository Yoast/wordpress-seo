<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Exposes the protected functions of the WPSEO Twitter class for testing
 */
class Expose_WPSEO_Twitter extends WPSEO_Twitter {

	public function type() {
		return parent::type();
	}

	public function site_twitter() {
		return parent::site_twitter();
	}

	public function author() {
		return parent::author();
	}

	public function title() {
		return parent::title();
	}

	public function description() {
		return parent::description();
	}

	public function image_output( $img, $tag = false ) {
		return parent::image_output( $img );
	}

	public function image() {
		return parent::image();
	}
}