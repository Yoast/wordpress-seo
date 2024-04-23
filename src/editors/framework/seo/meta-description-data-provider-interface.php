<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Editors\Framework\Seo;

interface Meta_Description_Data_Provider_Interface {

	/**
	 * Retrieves the meta description template.
	 *
	 * @return string The meta description template.
	 */
	public function get_meta_description_template(): string;

	/**
	 * Determines the date to be displayed in the snippet preview.
	 *
	 * @return string
	 */
	public function get_meta_description_date(): string;
}
