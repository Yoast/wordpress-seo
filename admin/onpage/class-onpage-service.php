<?php
/**
 * @package WPSEO\Admin\OnPage
 */

/**
 * Class WPSEO_OnPage_Service
 */
class WPSEO_OnPage_Service {

	/**
	 * @var WPSEO_OnPage_Option
	 */
	protected $onpage_option;

	/**
	 * WPSEO_OnPage_Service contructor.
	 *
	 * @param WPSEO_OnPage_Option $onpage_option The onpage option to retrieve onpage data from.
	 */
	public function __construct( WPSEO_OnPage_Option $onpage_option = null ) {
		if ( null == $onpage_option ) {
			$onpage_option = new WPSEO_OnPage_Option();
		}

		$this->onpage_option = $onpage_option;
	}

	/**
	 * Fetches statistics by REST request.
	 *
	 * @return WP_REST_Response The response object.
	 */
	public function get_onpage() {
		$onpage = false;
		if ( $this->onpage_option->is_enabled() ) {
			$onpage = $this->onpage_item();
		}

		return new WP_REST_Response( array( 'onpage' => $onpage ) );
	}

	/**
	 * Returns an the results of the onpage option.
	 *
	 * @return array The results, contains a score and label.
	 */
	private function onpage_item() {
		$can_fetch = $this->onpage_option->should_be_fetched();

		switch ( $this->onpage_option->get_status() ) {
			case WPSEO_OnPage_Option::IS_INDEXABLE :
				return array(
					'score'     => 'good',
					'label'     => __( 'Your homepage can be indexed by search engines.', 'wordpress-seo' ),
					'can_fetch' => $can_fetch,
				);
			case WPSEO_OnPage_Option::IS_NOT_INDEXABLE :
				return array(
					'score'     => 'bad',
					'label'     => printf(
					/* translators: %1$s: opens a link to a related knowledge base article. %2$s: closes the link. */
						__( '%1$sYour homepage cannot be indexed by search engines%2$s. This is very bad for SEO and should be fixed.', 'wordpress-seo' ),
						'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/onpageindexerror' ) . '" target="_blank">',
						'</a>'
					),
					'can_fetch' => $can_fetch,
				);
			case WPSEO_OnPage_Option::CANNOT_FETCH :
				return array(
					'score'     => 'na',
					'label'     => printf(
					/* translators: %1$s: opens a link to a related knowledge base article, %2$s: expands to Yoast SEO, %3$s: closes the link, %4$s: expands to Ryte. */
						__( '%1$s%2$s has not been able to fetch your site\'s indexability status%3$s from %4$s', 'wordpress-seo' ),
						'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/onpagerequestfailed' ) . '" target="_blank">',
						'Yoast SEO',
						'</a>',
						'Ryte'
					),
					'can_fetch' => $can_fetch,
				);
			case WPSEO_OnPage_Option::NOT_FETCHED :
				return array(
					'score'     => 'na',
					'label'     => esc_html( sprintf(
					/* translators: %1$s: expands to Yoast SEO, %2$s: expands to Ryte. */
						__( '%1$s has not fetched your site\'s indexability status yet from %2$s', 'wordpress-seo' ),
						'Yoast SEO',
						'Ryte'
					) ),
					'can_fetch' => $can_fetch,
				);
		}

		return array();
	}
}
