<?php
/**
 * @package WPSEO\Admin\Metabox
 */

/**
 * Tab to add a keyword to analyze
 */
class Metabox_Add_Keyword_Tab implements WPSEO_Metabox_Tab {

	/**
	 * Returns a button because a link is inappropriate here
	 *
	 * @return string
	 */
	public function link() {

		// Ensure thickbox is enqueued.
		add_thickbox();

		ob_start();
		?>
		<li class="wpseo-tab-add-keyword">
			<button type="button" class="wpseo-add-keyword button button-link">
				<span class="wpseo-add-keyword-plus" aria-hidden="true">+</span>
				<?php _e( 'Add keyword', 'wordpress-seo' ); ?>
			</button>
		</li>

		<?php
		$popup_title = __( 'Want to add more than one keyword?', 'wordpress-seo' );
		/* translators: %1$s expands to a 'Yoast SEO Premium' text linked to the yoast.com website. */
		$popup_content = '<p>' . sprintf( __( 'Great news: you can, with %1$s!', 'wordpress-seo' ),
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/pe-premium-page' ) . '">Yoast SEO Premium</a>'
				) . '</p>';
		$popup_content .= '<p>' . sprintf(
			/* translators: %s expands to 'Yoast SEO Premium'. */
			__( 'Other benefits of %s for you:', 'wordpress-seo' ), 'Yoast SEO Premium'
			) . '</p>';
		$popup_content .= '<ul>';
		$popup_content .= '<li>' . sprintf(
			/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
			__( '%1$sNo more dead links%2$s: easy redirect manager', 'wordpress-seo' ), '<strong>', '</strong>'
		) . '</li>';
		$popup_content .= '<li><strong>' . __( 'Superfast internal links suggestions', 'wordpress-seo' ) . '</strong></li>';
		$popup_content .= '<li>' . sprintf(
			/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
			__( '%1$sSocial media preview%2$s: Facebook &amp; Twitter', 'wordpress-seo' ), '<strong>', '</strong>'
		) . '</li>';
		$popup_content .= '<li><strong>' . __( '24/7 support', 'wordpress-seo' ) . '</strong></li>';
		$popup_content .= '<li><strong>' . __( 'No ads!', 'wordpress-seo' ) . '</strong></li>';
		$popup_content .= '</ul>';
		$premium_popup = new WPSEO_Premium_Popup( 'add-keyword', 'h1', $popup_title, $popup_content );
		echo $premium_popup->get_premium_message();

		return ob_get_clean();
	}

	/**
	 * Returns an empty string because this tab has no content
	 *
	 * @return string
	 */
	public function content() {
		return '';
	}
}
