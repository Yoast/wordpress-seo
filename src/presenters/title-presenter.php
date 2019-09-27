<?php
/**
 * Presenter class for the document title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Title_Presenter
 */
class Title_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the meta description for a post.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$title = $this->filter( $this->replace_vars( $presentation->title, $presentation ) );

		if ( is_string( $title ) && $title !== '' ) {
			return '<title>' . \esc_html( \wp_strip_all_tags( \stripslashes( $title ) ) ) . '</title>';
		}

		return '';
	}

	/**
	 * Run the meta description content through the `wpseo_metadesc` filter.
	 *
	 * @param string $title The meta description to filter.
	 *
	 * @return string $title The filtered meta description.
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
