<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\OnPage
 */

/**
 * Represents the service to be used by the WPSEO_Endpoint_Ryte endpoint.
 */
class WPSEO_Ryte_Service {

	/**
	 * @var WPSEO_OnPage_Option
	 */
	protected $option;

	/**
	 * Constructs the WPSEO_Ryte_Service class.
	 *
	 * @param WPSEO_OnPage_Option $option The option to retrieve data from.
	 */
	public function __construct( WPSEO_OnPage_Option $option ) {
		$this->option = $option;
	}

	/**
	 * Fetches statistics via REST request.
	 *
	 * @return WP_REST_Response The response object.
	 */
	public function get_statistics() {
		// Switch to the user locale with fallback to the site locale.
		switch_to_locale( WPSEO_Language_Utils::get_user_locale() );

		$result = false;

		if ( $this->option->is_enabled() ) {
			$result = $this->get_score( $this->option->get_status(), $this->option->should_be_fetched() );
		}

		return new WP_REST_Response( array( 'ryte' => $result ) );
	}

	/**
	 * Returns an the results of the Ryte option based on the passed status.
	 *
	 * @param string $status The option's status.
	 * @param bool   $fetch Whether or not the data should be fetched.
	 *
	 * @return array The results, contains a score and label.
	 */
	private function get_score( $status, $fetch = false ) {
		if ( $status === WPSEO_OnPage_Option::IS_INDEXABLE ) {
			return array(
				'score'     => 'good',
				'label'     => __( 'Your homepage can be indexed by search engines.', 'wordpress-seo' ),
				'can_fetch' => $fetch,
			);
		}

		if ( $status === WPSEO_OnPage_Option::IS_NOT_INDEXABLE ) {
			/* translators: %1$s: opens a link to a related knowledge base article. %2$s: closes the link. */
			$label = __( '%1$sYour homepage cannot be indexed by search engines%2$s. This is very bad for SEO and should be fixed.', 'wordpress-seo' );
			$label = sprintf(
				$label,
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/onpageindexerror' ) . '" target="_blank">',
				'</a>'
			);

			return array(
				'score'     => 'bad',
				'label'     => $label,
				'can_fetch' => $fetch,
			);
		}

		if ( $status === WPSEO_OnPage_Option::CANNOT_FETCH ) {
			/* translators: %1$s: opens a link to a related knowledge base article, %2$s: expands to Yoast SEO, %3$s: closes the link, %4$s: expands to Ryte. */
			$label = __( '%1$s%2$s has not been able to fetch your site\'s indexability status%3$s from %4$s', 'wordpress-seo' );
			$label = sprintf(
				$label,
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/onpagerequestfailed' ) . '" target="_blank">',
				'Yoast SEO',
				'</a>',
				'Ryte'
			);

			return array(
				'score'     => 'na',
				'label'     => $label,
				'can_fetch' => $fetch,
			);
		}

		if ( $status === WPSEO_OnPage_Option::NOT_FETCHED ) {
			/* translators: %1$s: expands to Yoast SEO, %2$s: expands to Ryte. */
			$label = __( '%1$s has not fetched your site\'s indexability status yet from %2$s', 'wordpress-seo' );
			$label = sprintf( $label, 'Yoast SEO', 'Ryte' );

			return array(
				'score'     => 'na',
				'label'     => esc_html( $label ),
				'can_fetch' => $fetch,
			);
		}

		return array();
	}
}
