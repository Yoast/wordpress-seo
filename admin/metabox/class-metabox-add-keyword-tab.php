<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Metabox
 */

/**
 * Tab to add a keyword to analyze.
 */
class WPSEO_Metabox_Add_Keyword_Tab implements WPSEO_Metabox_Tab {

	/**
	 * Returns a button because a link is inappropriate here.
	 *
	 * @return string
	 */
	public function link() {

		if ( ! WPSEO_UTILS::is_yoast_seo_premium() ) {
			$add_keyword_modal_config = array(
				'mountHook'      => '.wpseo-tab-add-keyword',
				'openButtonIcon' => 'plus',
				'intl'           => array(
					'open'           => __( 'Add keyword', 'wordpress-seo' ),
					'modalAriaLabel' => sprintf(
						/* translators: %s expands to 'Yoast SEO Premium'. */
						__( 'Get %s now!', 'wordpress-seo' ), 'Yoast SEO Premium'
					),
					'heading'        => sprintf(
						/* translators: %s expands to 'Yoast SEO Premium'. */
						__( 'Get %s now!', 'wordpress-seo' ), 'Yoast SEO Premium'
					),
				),
				'classes'        => array(
					'openButton' => 'wpseo-add-keyword button button-link',
				),
				'content'        => 'AddKeyword',
			);

			$translations = new WPSEO_Add_Keyword_Modal();
			$translations->enqueue_translations();
			$benefits = new WPSEO_Premium_Benefits_List();
			$benefits->enqueue_translations();
			Yoast_Modal::add( $add_keyword_modal_config );
		}

		// Keep the default Add Keyword button for Premium. On free it's replaced by React.
		ob_start();
		?>
		<li class="wpseo-tab-add-keyword">
			<button type="button" class="wpseo-add-keyword button button-link">
				<span class="wpseo-add-keyword-plus" aria-hidden="true">+</span>
				<?php esc_html_e( 'Add keyword', 'wordpress-seo' ); ?>
			</button>
		</li>
		<?php
		return ob_get_clean();
	}

	/**
	 * Returns an empty string because this tab has no content.
	 *
	 * @return string
	 */
	public function content() {
		return '';
	}
}
