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

		$add_keyword_modal_config = array(
			'hook'           => '.wpseo-tab-add-keyword',
			'openButtonIcon' => 'plus',
			'labels'         => array(
				'open'    => __( 'Add keyword', 'wordpress-seo' ),
				'label'   => sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( 'Get %s now!', 'wordpress-seo' ), 'Yoast SEO Premium'
				),
				'heading' => sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( 'Get %s now!', 'wordpress-seo' ), 'Yoast SEO Premium'
				),
				'xLabel'  => __( 'Close', 'wordpress-seo' ),
			),
			'classes'        => array(
				'openButton' => 'wpseo-add-keyword button button-link',
			),
			'content'        => 'AddKeyword',
			'strings'        => array(
				'title'    => __( 'Want to add more than one keyword?', 'wordpress-seo' ),
				'intro'    => sprintf(
					/* translators: %1$s expands to a 'Yoast SEO Premium' text linked to the yoast.com website. */
					__( 'Great news: you can, with %1$s!', 'wordpress-seo' ),
					'{{link}}Yoast SEO Premium{{/link}}'
				),
				'link'     => WPSEO_Shortlinker::get( 'https://yoa.st/pe-premium-page' ),
				'buylink'  => WPSEO_Shortlinker::get( 'https://yoa.st/add-keywords-popup' ),
				'buy'      => sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( 'Get %s now!', 'wordpress-seo' ), 'Yoast SEO Premium'
				),
				'small'    => __( '1 year free updates and upgrades included!', 'wordpress-seo' ),
				'other'    => sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( 'Other benefits of %s for you:', 'wordpress-seo' ), 'Yoast SEO Premium'
				),
				'a11yNotice.opensInNewTab' => __( '(Opens in a new browser tab)', 'wordpress-seo' ),
			),

		);

		if ( ! WPSEO_UTILS::is_yoast_seo_premium() ) {
			$benefits = new WPSEO_Premium_Benefits_List;
			$benefits->enqueue_translations();
			Yoast_Modal::add( $add_keyword_modal_config );
		}

		$more_modal_config = array(
			'hook'       => '.inside .wpseo-metabox-buy-premium',
			'labels'     => array(
				'open'    => __( 'Second modal', 'wordpress-seo' ),
				'label'   => __( 'Second modal aria-label', 'wordpress-seo' ),
				'heading' => __( 'Second modal heading', 'wordpress-seo' ),
				'xLabel'  => __( 'Close me 2 aria-label', 'wordpress-seo' ),
				'close'   => __( 'Close me 2', 'wordpress-seo' ),
			),
			'classes'    => array(
				'closeButton' => 'button button-primary',
			),
			'content'    => 'ModalTestContent',
		);
		Yoast_Modal::add( $more_modal_config );

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
