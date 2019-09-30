<?php
/**
 * Abstract presenter class for the meta description.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Abstract_Meta_Description_Presenter
 */
class Meta_Description_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the meta description for a post.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The meta description tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$meta_description = $this->filter( $this->replace_vars( $presentation->meta_description, $presentation ) );

		if ( \is_string( $meta_description ) && $meta_description !== '' ) {
			return \sprintf( '<meta name="description" content="%s"/>', \esc_attr( \wp_strip_all_tags( \stripslashes( $meta_description ) ) ) );
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
		 */
		return (string) trim( \apply_filters( 'wpseo_metadesc', $meta_description ) );
	}
}
