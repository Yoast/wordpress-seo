<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Metabox
 */

/**
 * Button to show the premium upsell.
 */
class WPSEO_Metabox_Multiple_Keywords_Config {

	/**
	 * Enqueues the translations necessary for the multiple keywords modal + button
	 *
	 * @return void
	 */
	public function enqueue_translations() {
		$multiple_keywords_modal_config = array(
			'openButtonIcon' => '',
			'intl'           => array(
				'open'           => '+ ' . __( 'Add additional keyword', 'wordpress-seo' ),
				'modalAriaLabel' =>
					/* translators: %s expands to 'Yoast SEO Premium'. */
					sprintf( __( 'Get %s now!', 'wordpress-seo' ), 'Yoast SEO Premium' ),
				'heading'        =>
					/* translators: %s expands to 'Yoast SEO Premium'. */
					sprintf( __( 'Get %s now!', 'wordpress-seo' ), 'Yoast SEO Premium' ),
			),
			'classes'        => array(
				'openButton' => 'wpseo-multiple-keywords button-link',
			),
			'content'        => 'MultipleKeywords',
		);

		$translations = new WPSEO_Multiple_Keywords_Modal();
		$translations->enqueue_translations();

		$benefits = new WPSEO_Premium_Benefits_List();
		$benefits->enqueue_translations();

		Yoast_Modal::add( $multiple_keywords_modal_config );
	}
}
