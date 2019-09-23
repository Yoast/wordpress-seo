<?php
/**
 * Abstract presenter class for the meta description.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use WPSEO_Replace_Vars;
use Yoast\WP\Free\Models\Indexable;

abstract class Abstract_Meta_Description_Presenter implements Presenter_Interface {

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
	 * Returns the meta description for a post.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description tag.
	 */
	public function present( Indexable $indexable ) {
		$meta_description = $this->filter( $this->replace_vars( $this->generate( $indexable ), $indexable ) );

		if ( is_string( $meta_description ) && $meta_description !== '' ) {
			return '<meta name="description" content="' . \esc_attr( \wp_strip_all_tags( \stripslashes( $meta_description ) ) ) . '"/>' . "\n";
		}

		if ( \current_user_can( 'wpseo_manage_options' ) ) {
			return '<!-- ' .
				sprintf(
				/* Translators: %1$s resolves to the SEO menu item, %2$s resolves to the Search Appearance submenu item. */
					\esc_html__( 'Admin only notice: this page does not show a meta description because it does not have one, either write it for this page specifically or go into the [%1$s - %2$s] menu and set up a template.', 'wordpress-seo' ),
					\esc_html__( 'SEO', 'wordpress-seo' ),
					\esc_html__( 'Search Appearance', 'wordpress-seo' )
				) .
				 ' -->' . "\n";
		}

		return '';
	}

	/**
	 * Run the meta description content through the `wpseo_metadesc` filter.
	 *
	 * @param string $meta_description The meta description to filter.
	 *
	 * @return string $meta_description The filtered meta description.
	 */
	private function filter( $meta_description ) {
		/**
		 * Filter: 'wpseo_metadesc' - Allow changing the Yoast SEO meta description sentence.
		 *
		 * @api string $meta_description The description sentence.
		 */
		return (string) trim( \apply_filters( 'wpseo_metadesc', $meta_description ) );
	}

	/**
	 * Replace replacement variables in the meta description.
	 *
	 * @param string    $meta_description The meta description.
	 * @param Indexable $indexable        The indexable.
	 *
	 * @return string The meta description with replacement variables replaced.
	 */
	private function replace_vars( $meta_description, Indexable $indexable ) {
		return $this->replace_vars_helper->replace( $meta_description, $this->get_replace_vars_object( $indexable ) );
	}

	/**
	 * Generates the meta description for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description.
	 */
	protected abstract function generate( Indexable $indexable );

	/**
	 * Gets an object to be used as a source of replacement variables.
	 *
	 * @param Indexable $indexable The indexable
	 *
	 * @return array A key => value array of variables that may be replaced.
	 */
	protected function get_replace_vars_object( Indexable $indexable ) {
		return [];
	}
}
