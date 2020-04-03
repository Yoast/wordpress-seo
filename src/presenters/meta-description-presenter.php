<?php
/**
 * Presenter class for the meta description.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class Abstract_Meta_Description_Presenter
 */
class Meta_Description_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the meta description for a post.
	 *
	 * @return string The meta description tag.
	 */
	public function present() {
		$meta_description = $this->replace_vars( $this->presentation->meta_description );
		$meta_description = $this->filter( $meta_description );
		$meta_description = $this->helpers->string->strip_all_tags( \stripslashes( $meta_description ) );
		$meta_description = \trim( $meta_description );

		if ( \is_string( $meta_description ) && $meta_description !== '' ) {
			return \sprintf( '<meta name="description" content="%s" />', \esc_attr( $meta_description ) );
		}

		if ( \current_user_can( 'wpseo_manage_options' ) ) {
			return '<!-- ' .
				\sprintf(
					/* Translators: %1$s resolves to the SEO menu item, %2$s resolves to the Search Appearance submenu item. */
					\esc_html__( 'Admin only notice: this page does not show a meta description because it does not have one, either write it for this page specifically or go into the [%1$s - %2$s] menu and set up a template.', 'wordpress-seo' ),
					\esc_html__( 'SEO', 'wordpress-seo' ),
					\esc_html__( 'Search Appearance', 'wordpress-seo' )
				) .
				' -->';
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
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \apply_filters( 'wpseo_metadesc', $meta_description, $this->presentation );
	}
}
