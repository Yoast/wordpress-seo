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
            <button type="button" class="wpseo-add-keyword button">+ <?php _e( 'Add keyword', 'wordpress-seo' ); ?></button>
        </li>

		<?php
		$popup_title = __( 'Want to add more than one keyword?', 'wordpress-seo' );
		/* translators: %1$s: expands to 'Yoast SEO Premium', %2$s: links to Yoast SEO Premium plugin page. */
		$popup_content = '<p>' . sprintf( __( 'Great news: you can, with %1$s!', 'wordpress-seo' ),
				'<a href="' . 'https://yoa.st/pe-premium-page' . '">Yoast SEO Premium</a>',
				'yoast.com' ) . '</p>';
		$popup_content .= '<p>' . __( 'Other benefits of Yoast SEO Premium for you:' ) . '</p>';
		$popup_content .= '<ul>';
		$popup_content .= '<li>' . __( '<strong>No more dead links</strong>: easy redirect manager' ) . '</li>';
		$popup_content .= '<li><strong>' . __( 'Superfast internal linking suggestions' ) . '</strong></li>';
		$popup_content .= '<li>' . __( '<strong>Social media preview</strong>: Facebook &amp; Twitter' ) . '</li>';
		$popup_content .= '<li><strong>' . __( '24/7 support' ) . '</strong></li>';
		$popup_content .= '<li><strong>' . __( 'No ads!' ) . '</strong></li>';
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
