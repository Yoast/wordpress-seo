<?php

namespace Yoast\WP\SEO\Editors\Domain\Seo;

interface Seo_Plugin_Data_Interface {

	/**
	 * @return array An array representation of the piece of SEO plugin data.
	 */
	public function to_array(): array;

	/**
	 * @return array An legacy array representation of the piece of SEO plugin data.
	 */
	public function to_legacy_array(): array;
}
