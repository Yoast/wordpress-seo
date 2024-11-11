<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\General\Domain\Taxonomy_Filters;

/**
 * This interface describes a Taxonomy Filter implementation.
 */
interface Taxonomy_Filter_Interface {

	/**
	 * Gets the filtering taxonomy.
	 *
	 * @return string
	 */
	public function get_filtering_taxonomy(): string;

	/**
	 * Gets the filtered content type.
	 *
	 * @return string
	 */
	public function get_filtered_content_type(): string;
}
