<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Implements the suggestions for Yoast SEO Premium
 */
class WPSEO_Premium_Beacon_Setting implements Yoast_HelpScout_Beacon_Setting {
	/**
	 * Returns a list of helpscout hashes to show the user for a certain page.
	 *
	 * @param string $page The current admin page we are on.
	 *
	 * @return array A list of suggestions for the beacon
	 */
	public function get_suggestions( $page ) {
		switch ( $page ) {
			case 'wpseo_dashboard':
				return array(
					'543752a7e4b01a27d3c00010',
					// See: http://kb.yoast.com/article/164-how-to-connect-your-website-to-google-webmaster-tools.
					'5469dc20e4b0f6394183a0a5',
					// See: http://kb.yoast.com/article/183-microformats-and-schema-org.
				);
			case 'wpseo_titles':
				return array(
					'53a820b7e4b02b018b783607',
					// See: http://kb.yoast.com/article/146-yoast-wordpress-seo-titles-metas-template-variables.
					'537f0723e4b0fe61cc352111',
					// See: http://kb.yoast.com/article/107-google-shows-different-titles-for-my-site.
					'5375f937e4b0d833740d57ac',
					// See: http://kb.yoast.com/article/75-im-not-seeing-a-meta-description-in-my-head-section.
				);
			case 'wpseo_social':
				return array(
					'54cc3f0de4b034c37ea8c722',
					// See: http://kb.yoast.com/article/219-getting-open-graph-for-your-articles.
					'556df3e2e4b01a224b428375',
					// See: http://kb.yoast.com/article/254-gaining-access-to-facebook-insights.
					'53c4f5a9e4b085fad945d02d',
					// See: http://kb.yoast.com/article/147-setting-up-twitter-cards-in-wordpress-seo.
				);
			case 'wpseo_xml':
				return array(
					'5375e852e4b03c6512282d5a',
					// See: http://kb.yoast.com/article/36-my-sitemap-is-blank-what-s-wrong.
					'5375f58ce4b03c6512282d98',
					// See: http://kb.yoast.com/article/58-xml-sitemap-error.
					'5375f9b6e4b0d833740d57bc',
					// See: http://kb.yoast.com/article/77-my-sitemap-index-is-giving-a-404-error-what-should-i-do.
				);
			case 'wpseo_advanced':
				return array(
					'55310094e4b0a2d7e23f5f13',
					// See: http://kb.yoast.com/article/245-implement-wordpress-seo-breadcrumbs.
					'55ace6bfe4b03e788eda48a4',
					// See: http://kb.yoast.com/article/274-add-theme-support-for-yoast-seo-breadcrumbs.
				);
			case 'wpseo_tools':
				return array(
					'5632ca35c697910ae05ef6cd',
					// See: http://kb.yoast.com/article/305-how-to-edit-htaccess-through-yoast-seo.
					'55b8ef7ae4b01fdb81eae86a',
					// See: http://kb.yoast.com/article/279-how-to-edit-robots-txt-through-yoast-seo.
					'53a0a63de4b0aa24c5341503',
					// See: http://kb.yoast.com/article/141-if-your-robots-txt-were-writeable-error.
				);
			case 'wpseo_search_console':
				return array(
					'5632d2adc697910ae05ef6da',
					// See: http://kb.yoast.com/article/306-how-to-connect-and-retrieve-crawl-issues.
					'53a1903fe4b0295576d0c7a0',
					// See: http://kb.yoast.com/article/142-what-are-regex-redirects.
					'5375f3f9e4b0d833740d5760',
					// See: http://kb.yoast.com/article/51-import-redirects.
				);

			case 'wpseo_redirects':
				return array( '5385c1c9e4b06542b1a212e2', '55c2b57ee4b01fdb81eb0de7' );
		}

		return array();
	}

	/**
	 * Returns a product for a a certain admin page.
	 *
	 * @param string $page The current admin page we are on.
	 *
	 * @return Yoast_Product[] A product to use for sending data to helpscout
	 */
	public function get_products( $page ) {
		switch ( $page ) {
			case 'wpseo_dashboard':
			case 'wpseo_titles':
			case 'wpseo_social':
			case 'wpseo_xml':
			case 'wpseo_advanced':
			case 'wpseo_tools':
			case 'wpseo_search_console':
				return array( new WPSEO_Product_Premium() );
		}

		return array();
	}


	/**
	 * Returns a list of config values for a a certain admin page.
	 *
	 * @param string $page The current admin page we are on.
	 *
	 * @return array A list with configuration for the beacon
	 */
	public function get_config( $page ) {
		return array( 'modal' => true );
	}
}
