<?php
/**
 * Presenter class for the document title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Title_Presenter
 */
class Title_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the document title.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The document title tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$title = $this->filter( $this->replace_vars( $presentation->title, $presentation ) );

		if ( is_string( $title ) && $title !== '' ) {
			return '<title>' . \esc_html( \wp_strip_all_tags( \stripslashes( $title ) ) ) . '</title>';
		}

		return '';
	}

	/**
	 * Run the document title through the `wpseo_title` filter.
	 *
	 * @param string $title The document title to filter.
	 *
	 * @return string $title The filtered document title.
	 */
	private function filter( $title ) {
		/**
		 * Filter: 'wpseo_title' - Allow changing the Yoast SEO generated title.
		 *
		 * @api string $title The title.
		 */
		return (string) trim( \apply_filters( 'wpseo_title', $title ) );
	}
}
