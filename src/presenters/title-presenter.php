<?php
/**
 * Presenter class for the document title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class Title_Presenter
 */
class Title_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the document title.
	 *
	 * @param bool $output_title_tag Optional. Whether or not to output the title with the title tag (`<title>`) included. Defaults to true.
	 *
	 * @return string The document title tag.
	 */
	public function present( $output_title_tag = true ) {
		$title = $this->replace_vars( $this->presentation->title );
		$title = $this->filter( $title );
		$title = $this->helpers->string->strip_all_tags( \stripslashes( $title ) );
		$title = \trim( $title );

		if ( \is_string( $title ) && $title !== '' ) {
			if ( $output_title_tag ) {
				return '<title>' . \esc_html( $title ) . '</title>';
			}
			return \esc_html( $title );
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
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \apply_filters( 'wpseo_title', $title, $this->presentation );
	}
}
