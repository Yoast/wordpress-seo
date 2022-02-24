<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use mysql_xdevapi\XSession;
use WPSEO_Admin_Utils;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;

/**
 * Presents a set of different messages for the Ryte health check.
 */
class Ryte_Reports {
	use Reports_Trait;

	/**
	 * The Alert_Presenter factory used to generate alert messages for some reports.
	 *
	 * @var Alert_Presenter_Factory
	 */
	private $alert_presenter_factory;

	/**
	 * The WPSEO_Shortlinker object used to generate short links.
	 *
	 * @var WPSEO_Shortlinker
	 */
	private $shortlinker;

	/**
	 * Constructor
	 *
	 * @param  Report_Builder_Factory  $report_builder_factory The factory for result builder objects. This class uses the report builder to generate WordPress-friendly health check results.
	 * @param  Alert_Presenter_Factory $alert_presenter_factory The factory that builds Alert_Presenters. Used to generate alert messages for the actions field.
	 * @param  WPSEO_Shortlinker       $shortlinker The WPSEO_Shortlinker object used to generate short links.
	 * @return void
	 */
	public function __construct(
		Report_Builder_Factory $report_builder_factory,
		Alert_Presenter_Factory $alert_presenter_factory,
		WPSEO_Shortlinker $shortlinker
	) {
		$this->report_builder          = $report_builder_factory->create();
		$this->alert_presenter_factory = $alert_presenter_factory;
		$this->shortlinker             = $shortlinker;
	}

	/**
	 * Returns the message for a successful health check.
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_success_result() {
		return $this->report_builder
			/* translators: %1$s expands to 'Yoast'. */
			->set_label( __( 'Your site can be found by search engines', 'wordpress-seo' ) )
			->set_status_good()
			->set_description( $this->get_success_result_description() )
			->set_actions( $this->get_ryte_actions() )
			->build();
	}

	/**
	 * Returns the report for a health check result in which the site was not indexable.
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_not_indexable_result() {
		return $this->report_builder
			/* translators: %1$s expands to 'Yoast'. */
			->set_label( __( 'Your site cannot be found by search engines', 'wordpress-seo' ) )
			->set_status_critical()
			->set_description( $this->get_not_indexable_result_description() )
			->set_actions( $this->get_not_indexable_result_actions() . $this->get_ryte_actions() )
			->build();
	}

	/**
	 * Returns the report for when the health check was unable to determine indexability.
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_unknown_indexability_result() {
		return $this->report_builder
			/* translators: %1$s: Expands to 'Ryte'. */
			->set_label( sprintf( __( '%1$s cannot determine whether your site can be found by search engines', 'wordpress-seo' ), 'Ryte' ) )
			->set_status_recommended()
			->set_description( $this->get_unknown_indexability_result_description() )
			->set_actions( $this->get_ryte_actions() )
			->build();
	}

	/**
	 * Returns the result for when the health check got an error response from Ryte.
	 *
	 * @param array $response_error The error response from Ryte.
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_response_error_result( $response_error ) {
		return $this->report_builder
			->set_label( __( 'An error occurred while checking whether your site can be found by search engines', 'wordpress-seo' ) )
			->set_status_recommended()
			->set_description( $this->get_response_error_result_description( $response_error ) )
			->set_actions( $this->get_response_error_result_actions() . $this->get_ryte_actions() )
			->build();
	}

	/**
	 * Returns the description for a successful result.
	 *
	 * @return string The description for a successful result.
	 */
	private function get_success_result_description() {
		return sprintf(
			/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
			__( '%1$s offers a free indexability check for %2$s users, and it shows that your site can be found by search engines.', 'wordpress-seo' ),
			'Ryte',
			'Yoast SEO'
		);
	}

	/**
	 * Returns the description for when the site is not indexable.
	 *
	 * @return string The description for when the site is not indexable.
	 */
	private function get_not_indexable_result_description() {
		return sprintf(
			/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
			__( '%1$s offers a free indexability check for %2$s users and it has determined that your site cannot be found by search engines. If this site is live or about to become live, this should be fixed.', 'wordpress-seo' ),
			'Ryte',
			'Yoast SEO'
		);
	}

	/**
	 * Returns the actions for when the site is not indexable.
	 *
	 * @return string The actions for when the site is not indexable.
	 */
	private function get_not_indexable_result_actions() {
		return sprintf(
			/* translators: %1$s: Opening tag of the link to the Yoast help center, %2$s: Link closing tag. */
			esc_html__( '%1$sRead more about troubleshooting search engine visibility.%2$s', 'wordpress-seo' ),
			'<a href="' . esc_url( $this->shortlinker->get( 'https://yoa.st/onpageindexerror' ) ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		) . '<br /><br />';
	}

	/**
	 * Returns the description for when the site's indexability couldn't be determined.
	 *
	 * @return string The description for when the site's indexability couldn't be determined.
	 */
	private function get_unknown_indexability_result_description() {
		return sprintf(
			/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
			__(
				'%1$s offers a free indexability check for %2$s users and right now it has trouble determining whether search engines can find your site. This could have several (legitimate) reasons and is not a problem in itself. If this is a live site, it is recommended that you figure out why the %1$s check failed.',
				'wordpress-seo'
			),
			'Ryte',
			'Yoast SEO'
		) . '<br />' . $this->get_unknown_indexability_description_alert();
	}

	/**
	 * Returns an alert for when the health check was unable to determine indexability.
	 *
	 * @return string An alert for when the health check was unable to determine indexability.
	 */
	private function get_unknown_indexability_description_alert() {
		/* translators: %1$s: Expands to 'Ryte', %2$s: Link start tag to the Yoast help center, %3$s: Link closing tag. */
		$alert_text    = esc_html__(
			'As the indexability status of your website can only be fetched from %1$s every 15 seconds,
			a first step could be to wait at least 15 seconds and refresh the Site Health page. If that did not help,
			%2$sread more about troubleshooting search engine visibility%3$s.',
			'wordpress-seo'
		);
		$alert_content = sprintf(
			$alert_text,
			'Ryte',
			'<a href="' . esc_url( $this->shortlinker->get( 'https://yoa.st/onpagerequestfailed' ) ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);

		$alert = $this->alert_presenter_factory->create( $alert_content, 'info' );
		return $alert->present();
	}

	/**
	 * Returns the description for when the health check got an error response from Ryte.
	 *
	 * @param array $error_response The error response from Ryte.
	 * @return string The description.
	 */
	private function get_response_error_result_description( $error_response ) {
		return sprintf(
			'%s<br><br>%s',
			sprintf(
			/* translators: %1$s: Expands to 'Ryte', %2$s: Expands to 'Yoast SEO'. */
				esc_html__( '%1$s offers a free indexability check for %2$s users. The request to %1$s to check whether your site can be found by search engines failed due to an error.', 'wordpress-seo' ),
				'Ryte',
				'Yoast SEO'
			),
			sprintf(
			/* translators: 1: The Ryte response raw error code, if any. 2: The error message. 3: The WordPress error code, if any. */
				__( 'Error details: %1$s %2$s %3$s', 'wordpress-seo' ),
				$error_response['raw_error_code'],
				$error_response['message'],
				$error_response['wp_error_code']
			)
		);
	}

	/**
	 * Returns the actions for when the health check got an error response from Ryte.
	 *
	 * @return string The actions for when the health check got an error response from Ryte.
	 */
	private function get_response_error_result_actions() {
		return sprintf(
		/* translators: %1$s: Opening tag of the link to the Yoast help center, %2$s: Link closing tag. */
			esc_html__( 'If this is a live site, %1$sit is recommended that you figure out why the check failed.%2$s', 'wordpress-seo' ),
			'<a href="' . esc_url( $this->shortlinker->get( 'https://yoa.st/onpagerequestfailed' ) ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		) . '<br /><br />';
	}

	/**
	 * Returns the link to Ryte that's appended to every report.
	 *
	 * @return string The link to Ryte as an action.
	 */
	private function get_ryte_actions() {
		return sprintf(
		/* translators: %1$s: Opening tag of the link to the Yoast Ryte website, %2$s: Expands to 'Ryte', %3$s: Link closing tag. */
			esc_html__( '%1$sGo to %2$s to analyze your entire site%3$s', 'wordpress-seo' ),
			'<a href="' . esc_url( $this->shortlinker->get( 'https://yoa.st/rytelp' ) ) . '" target="_blank">',
			'Ryte',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);
	}
}
