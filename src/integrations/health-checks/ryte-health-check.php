<?php

namespace Yoast\WP\SEO\Integrations\Health_Checks;

use WPSEO_Admin_Utils;
use WPSEO_Ryte;
use WPSEO_Ryte_Option;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Ryte_Conditional;
use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;

/**
 * Represents the health check for Ryte.
 */
class Ryte_Health_Check extends Abstract_Health_Check {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Ryte_Conditional::class ];
	}

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
		/*
		 * Run the request to fetch the indexability status. Set last fetch time.
		 * Update the Ryte option status. Will run a new request only if the last
		 * one is not within the `WPSEO_Ryte_Option::FETCH_LIMIT` time interval.
		 */
		$wpseo_ryte = new WPSEO_Ryte();
		$wpseo_ryte->fetch_from_ryte();

		// Get the Ryte API response to properly handle errors.
		$response = $wpseo_ryte->get_response();

		if ( \is_array( $response ) && isset( $response['is_error'] ) ) {
			$this->response_error( $response );

			return;
		}

		// The request was successful: get the updated Ryte option.
		$ryte_option = new WPSEO_Ryte_Option();

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
	 * Adds the content for a failed Ryte API request.
	 *
	 * @param array $response The error details.
	 *
	 * @return void
	 */
	protected function response_error( $response ) {
		$this->label          = \esc_html__( 'An error occurred while checking whether your site can be found by search engines', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description = \sprintf(
			'%s<br><br>%s',
			\sprintf(
				/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
				\esc_html__( '%1$s offers a free indexability check for %2$s users. The request to %1$s to check whether your site can be found by search engines failed due to an error.', 'wordpress-seo' ),
				'Ryte',
				'Yoast SEO'
			),
			\sprintf(
				/* translators: 1: The Ryte response raw error code, if any. 2: The error message. 3: The WordPress error code, if any. */
				__( 'Error details: %1$s %2$s %3$s', 'wordpress-seo' ),
				$response['raw_error_code'],
				$response['message'],
				$response['wp_error_code']
			)
		);

		$this->actions = \sprintf(
			/* translators: %1$s: Opening tag of the link to the Yoast knowledge base, %2$s: Link closing tag. */
			\esc_html__( 'If this is a live site, %1$sit is recommended that you figure out why the check failed.%2$s', 'wordpress-seo' ),
			'<a href="' . \esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/onpagerequestfailed' ) ) . '" target="_blank">',
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
		$this->label          = \esc_html__( 'Your site cannot be found by search engines', 'wordpress-seo' );
		$this->status         = self::STATUS_CRITICAL;
		$this->badge['color'] = 'red';

		$this->description = \sprintf(
			/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
			\esc_html__( '%1$s offers a free indexability check for %2$s users and it has determined that your site cannot be found by search engines. If this site is live or about to become live, this should be fixed.', 'wordpress-seo' ),
			'Ryte',
			'Yoast SEO'
		);

		$this->actions = \sprintf(
			/* translators: %1$s: Opening tag of the link to the Yoast knowledge base, %2$s: Link closing tag. */
			\esc_html__( '%1$sRead more about troubleshooting search engine visibility.%2$s', 'wordpress-seo' ),
			'<a href="' . \esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/onpageindexerror' ) ) . '" target="_blank">',
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
		$this->label = \sprintf(
			/* translators: %1$s: Expands to 'Ryte'. */
			\esc_html__( '%1$s cannot determine whether your site can be found by search engines', 'wordpress-seo' ),
			'Ryte'
		);
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
		$description        = \esc_html__(
			'%1$s offers a free indexability check for %2$s users and right now it has trouble determining
			whether search engines can find your site. This could have several (legitimate) reasons and
			is not a problem in itself. If this is a live site, it is recommended that you figure out why
			the %1$s check failed.',
			'wordpress-seo'
		);
		$this->description  = \sprintf(
			$description,
			'Ryte',
			'Yoast SEO'
		);
		$this->description .= '<br />';

		/* translators: %1$s: Expands to 'Ryte', %2$s: Link start tag to the Yoast knowledge base, %3$s: Link closing tag. */
		$alert_text    = \esc_html__(
			'As the indexability status of your website can only be fetched from %1$s every 15 seconds,
			a first step could be to wait at least 15 seconds and refresh the Site Health page. If that did not help,
			%2$sread more about troubleshooting search engine visibility%3$s.',
			'wordpress-seo'
		);
		$alert_content = \sprintf(
			$alert_text,
			'Ryte',
			'<a href="' . \esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/onpagerequestfailed' ) ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);

		$alert              = new Alert_Presenter( $alert_content, 'info' );
		$this->description .= $alert->present();

		$this->add_ryte_link();
	}

	/**
	 * Adds the content for the "Can be indexed" response.
	 *
	 * @return void
	 */
	protected function is_indexable_response() {
		$this->label          = \esc_html__( 'Your site can be found by search engines', 'wordpress-seo' );
		$this->status         = self::STATUS_GOOD;
		$this->badge['color'] = 'blue';

		/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
		$description       = \esc_html__(
			'%1$s offers a free indexability check for %2$s users, and it shows that your site can be found by search engines.',
			'wordpress-seo'
		);
		$this->description = \sprintf( $description, 'Ryte', 'Yoast SEO' );
	}

	/**
	 * Adds the link to the Ryte site to the actions.
	 *
	 * @return void
	 */
	protected function add_ryte_link() {
		$this->actions .= \sprintf(
			/* translators: %1$s: Opening tag of the link to the Yoast Ryte website, %2$s: Expands to 'Ryte', %3$s: Link closing tag. */
			\esc_html__( '%1$sGo to %2$s to analyze your entire site%3$s', 'wordpress-seo' ),
			'<a href="' . \esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/rytelp' ) ) . '" target="_blank">',
			'Ryte',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);
	}
}
