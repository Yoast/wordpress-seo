<?php
/**
 * Presenter class for the document title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class Title_Presenter
 */
class Title_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * @var String_Helper
	 */
	private $string;

	/**
	 * Title_Presenter constructor.
	 *
	 * @param String_Helper $string The string helper.
	 */
	public function __construct( String_Helper $string ) {
		$this->string = $string;
	}

	/**
	 * Returns the document title.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The document title tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$title = $this->replace_vars( $presentation->title, $presentation );
		$title = $this->filter( $title, $presentation );
		$title = $this->string->strip_all_tags( \stripslashes( $title ) );
		$title = \trim( $title );

		if ( \is_string( $title ) && $title !== '' ) {
			return '<title>' . \esc_html( $title ) . '</title>';
		}

		return '';
	}

	/**
	 * Run the document title through the `wpseo_title` filter.
	 *
	 * @param string                 $title        The document title to filter.
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string $title The filtered document title.
	 */
	private function filter( $title, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_title' - Allow changing the Yoast SEO generated title.
		 *
		 * @api string $title The title.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \apply_filters( 'wpseo_title', $title, $presentation );
	}
}
