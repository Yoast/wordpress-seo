<?php
/**
 * Surface for the indexables.
 *
 * @package Yoast\YoastSEO\Surfaces
 */

namespace Yoast\WP\Free\Surfaces;

use Yoast\WP\Free\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Class Current_Page_Surface
 */
class Current_Page_Surface {

	/**
	 * @var Meta_Tags_Context_Memoizer;
	 */
	private $meta_tags_context_memoizer;

	/**
	 * Current_Page_Surface constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer $meta_tags_context_memoizer The meta tags context memoizer.
	 */
	public function __construct( Meta_Tags_Context_Memoizer $meta_tags_context_memoizer ) {
		$this->meta_tags_context_memoizer = $meta_tags_context_memoizer;
	}

	/**
	 * Returns the title of the current page.
	 *
	 * @return string The title.
	 */
	public function get_title() {
		$meta_tags_context = $this->meta_tags_context_memoizer->for_current_page();

		return $meta_tags_context->title;
	}

	/**
	 * Returns the meta description of the current page.
	 *
	 * @return string The meta description.
	 */
	public function get_description() {
		$meta_tags_context = $this->meta_tags_context_memoizer->for_current_page();

		return $meta_tags_context->description;
	}

	/**
	 * Returns the canonical of the current page.
	 *
	 * @return string The canonical.
	 */
	public function get_canonical() {
		$meta_tags_context = $this->meta_tags_context_memoizer->for_current_page();

		return $meta_tags_context->canonical;
	}

	/**
	 * Returns the robots of the current page.
	 *
	 * @return string[] The robots.
	 */
	public function get_robots() {
		$meta_tags_context = $this->meta_tags_context_memoizer->for_current_page();

		return $meta_tags_context->presentation->robots;
	}
}
