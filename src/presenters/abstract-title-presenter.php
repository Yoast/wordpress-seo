<?php
/**
 * Abstract presenter class for the document title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use WPSEO_Replace_Vars;
use Yoast\WP\Free\Models\Indexable;

/**
 * Class Abstract_Title_Presenter
 */
abstract class Abstract_Title_Presenter implements Presenter_Interface {

	/**
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars_helper;

	/**
	 * @required
	 *
	 * Sets the replace vars helper, used by DI.
	 *
	 * @param \WPSEO_Replace_Vars $replace_vars_helper The replace vars helper.
	 */
	public function set_replace_vars_helper( WPSEO_Replace_Vars $replace_vars_helper ) {
		$this->replace_vars_helper = $replace_vars_helper;
	}

	/**
	 * Returns the title for a post.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title tag.
	 */
	public function present( Indexable $indexable ) {
		$title = $this->filter( $this->replace_vars( $this->generate( $indexable ), $indexable ) );

		if ( is_string( $title ) && $title !== '' ) {
			return '<title>' . \esc_html( \wp_strip_all_tags( \stripslashes( $title ) ) ) . '</title>';
		}

		return '';
	}

	/**
	 * Run the title content through the `wpseo_title` filter.
	 *
	 * @param string $title The title to filter.
	 *
	 * @return string $title The filtered title.
	 */
	private function filter( $title ) {
		/**
		 * Filter: 'wpseo_title' - Allow changing the Yoast SEO generated title.
		 *
		 * @api string $title The title.
		 */
		return (string) trim( \apply_filters( 'wpseo_title', $title ) );
	}

	/**
	 * Replace replacement variables in the title.
	 *
	 * @param string    $title     The title.
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title with replacement variables replaced.
	 */
	private function replace_vars( $title, Indexable $indexable ) {
		return $this->replace_vars_helper->replace( $title, $this->get_replace_vars_object( $indexable ) );
	}

	/**
	 * Generates the title for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title.
	 */
	abstract public function generate( Indexable $indexable );

	/**
	 * Gets an object to be used as a source of replacement variables.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array A key => value array of variables that may be replaced.
	 */
	protected function get_replace_vars_object( Indexable $indexable ) {
		return [];
	}
}
