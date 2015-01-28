<?php
/**
 * @package    WPSEO
 * @subpackage Unittests
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

	public function site_domain() {
		return parent::site_domain();
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

	public function url() {
		return parent::url();
	}

	public function image_output( $img, $tag = 'image:src' ) {
		return parent::image_output( $img, $tag );
	}

	public function image() {
		return parent::image();
	}
}