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
			<button type="button" class="wpseo-add-keyword button">
				<span aria-hidden="true">+</span>
				<span class="screen-reader-text"><?php _e( 'Add keyword', 'wordpress-seo' ); ?></span>
			</button>
		</li>

		<?php
		$popup_title = sprintf( __( 'Multiple focus keywords is a %s feature', 'wordpress-seo' ), 'Yoast SEO Premium' );
		/* translators: %1$s: expands to 'Yoast SEO Premium', %2$s: links to Yoast SEO Premium plugin page. */
		$popup_content       = sprintf( __( 'To be able to add and analyze multiple keywords for a post or page you need %1$s. You can buy the plugin, including one year of support, updates and upgrades, on %2$s.', 'wordpress-seo' ),
			'<a href="https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-metabox&utm_medium=popup&utm_campaign=multiple-keywords">Yoast SEO Premium</a>',
			'yoast.com' );
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
