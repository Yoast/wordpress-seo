<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Represents the health check for Ryte.
 */
class WPSEO_Health_Check_Ryte extends WPSEO_Health_Check {

	/**
	 * The name of the test.
	 *
	 * @var string
	 */
	protected $test = 'yoast-health-check-ryte';

	/**
	 * Runs the test.
	 *
	 * @return void
	 */
	public function run() {
		// If Ryte is disabled or the blog is not public or development mode is on, don't run code.
		if ( ! $this->should_run() ) {
			return;
		}

		/*
		 * Run the request to fetch the indexability status. Set last fetch time.
		 * Update the Ryte option status. Will run a new request only if the last
		 * one is not within the `WPSEO_Ryte_Option::FETCH_LIMIT` time interval.
		 */
		$wpseo_ryte = new WPSEO_Ryte();
		$wpseo_ryte->fetch_from_ryte();

		// Get the Ryte API response to properly handle errors.
		$response = $wpseo_ryte->get_response();

		if ( is_array( $response ) && isset( $response['is_error'] ) ) {
			$this->response_error( $response );

			return;
		}

		// The request was successful: get the updated Ryte option.
		$ryte_option = $this->get_ryte_option();

		switch ( $ryte_option->get_status() ) {
			case WPSEO_Ryte_Option::IS_NOT_INDEXABLE:
				$this->is_not_indexable_response();
				break;
			case WPSEO_Ryte_Option::IS_INDEXABLE:
				$this->is_indexable_response();
				break;
			case WPSEO_Ryte_Option::NOT_FETCHED:
			default: // WPSEO_Ryte_Option::CANNOT_FETCH.
				$this->unknown_indexability_response();
				break;
		}
	}

	/**
	 * Checks whether Ryte is enabled, the blog is public, and it is not development mode.
	 *
	 * @return bool True when Ryte is enabled, the blog is public and development mode is not on.
	 */
	protected function should_run() {
		$ryte_option = $this->get_ryte_option();
		if ( ! $ryte_option->is_enabled() ) {
			return false;
		}

		if ( '0' === get_option( 'blog_public' ) ) {
			return false;
		}

		return ! $this->is_development_mode();
	}

	/**
	 * Checks if debug mode is on but Yoast development mode is not on (i.e. for non-Yoast developers).
	 *
	 * @return bool True when debug mode is on and Yoast development mode is not on.
	 */
	protected function is_development_mode() {
		return wp_debug_mode() && ! WPSEO_Utils::is_development_mode();
	}

	/**
	 * Returns a new instance of WPSEO_Ryte_Option.
	 *
	 * @return WPSEO_Ryte_Option New Ryte Option.
	 */
	protected function get_ryte_option() {
		return new WPSEO_Ryte_Option();
	}

	/**
	 * Adds the content for a failed Ryte API request.
	 *
	 * @param array $response The error details.
	 *
	 * @return void
	 */
	protected function response_error( $response ) {
		$this->label          = esc_html__( 'An error occurred while checking whether your site can be found by search engines', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description = sprintf(
			'%s<br><br>%s',
			sprintf(
				/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
				esc_html( '%1$s offers a free indexability check for %2$s users. The request to %1$s to check whether your site can be found by search engines failed due to an error.', 'wordpress-seo' ),
				'Ryte',
				'Yoast SEO'
			),
			sprintf(
				/* translators: 1: The Ryte response raw error code, if any. 2: The error message. 3: The WordPress error code, if any. */
				__( 'Error details: %1$s %2$s %3$s', 'wordpress-seo' ),
				$response['raw_error_code'],
				$response['message'],
				$response['wp_error_code']
			)
		);

		$this->actions = sprintf(
			/* translators: %1$s: Opening tag of the link to the Yoast knowledge base, %2$s: Link closing tag. */
			esc_html__( 'If this is a live site, %1$sit is recommended that you figure out why the check failed.%2$s', 'wordpress-seo' ),
			'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/onpagerequestfailed' ) ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);
		$this->actions .= '<br /><br />';

		$this->add_ryte_link();
	}

	/**
	 * Adds the content for the "Cannot be indexed" response.
	 *
	 * @return void
	 */
	protected function is_not_indexable_response() {
		$this->label          = esc_html__( 'Your site cannot be found by search engines', 'wordpress-seo' );
		$this->status         = self::STATUS_CRITICAL;
		$this->badge['color'] = 'red';

		$this->description  = sprintf(
			/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
			esc_html__( '%1$s offers a free indexability check for %2$s users and it has determined that your site cannot be found by search engines. If this site is live or about to become live, this should be fixed.', 'wordpress-seo' ),
			'Ryte',
			'Yoast SEO'
		);

		$this->actions  = sprintf(
			/* translators: %1$s: Opening tag of the link to the Yoast knowledge base, %2$s: Link closing tag. */
			esc_html__( '%1$sRead more about troubleshooting search engine visibility.%2$s', 'wordpress-seo' ),
			'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/onpageindexerror' ) ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);
		$this->actions .= '<br /><br />';

		$this->add_ryte_link();
	}

	/**
	 * Adds the content for the "Cannot tell if it can be indexed" response.
	 *
	 * @return void
	 */
	protected function unknown_indexability_response() {
		$this->label          = sprintf(
			/* translators: %1$s: Expands to 'Ryte'. */
			esc_html__( '%1$s cannot determine whether your site can be found by search engines', 'wordpress-seo' ),
			'Ryte'
		);
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description = sprintf(
			/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO', %3$s: Opening tag to the Yoast knowledge base, %4$s: Link closing tag. */
			esc_html__( '%1$s offers a free indexability check for %2$s users and right now it has trouble determining
			whether search engines can find your site. This could have several (legitimate) reasons and is not a problem
			in itself. If this is a live site, %3$sit is recommended that you figure out why the %1$s check failed.%4$s', 'wordpress-seo' ),
			'Ryte',
			'Yoast SEO',
			'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/onpagerequestfailed' ) ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);

		$this->add_ryte_link();
	}

	/**
	 * Adds the content for the "Can be indexed" response.
	 *
	 * @return void
	 */
	protected function is_indexable_response() {
		$this->label          = esc_html__( 'Your site can be found by search engines', 'wordpress-seo' );
		$this->status         = self::STATUS_GOOD;
		$this->badge['color'] = 'blue';

		$this->description = sprintf(
			/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
			esc_html__( '%1$s offers a free indexability check for %2$s users, and it shows
			that your site can be found by search engines.', 'wordpress-seo' ),
			'Ryte',
			'Yoast SEO'
		);
	}

	/**
	 * Adds the link to the Ryte site to the actions.
	 *
	 * @return void
	 */
	protected function add_ryte_link() {
		$this->actions .= sprintf(
			/* translators: %1$s: Opening tag of the link to the Yoast Ryte website, %2$s: Expands to 'Ryte', %3$s: Link closing tag. */
			esc_html__( '%1$sGo to %2$s to analyze your entire site%3$s', 'wordpress-seo' ),
			'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/rytelp' ) ) . '" target="_blank">',
			'Ryte',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);
	}
}
