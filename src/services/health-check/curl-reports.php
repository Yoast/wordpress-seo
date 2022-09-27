<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use WPSEO_Admin_Utils;
use WPSEO_Shortlinker;

/**
 * Presents a set of different messages for the cURL health check.
 */
class Curl_Reports {

	use Reports_Trait;

	/**
	 * The WPSEO_Shortlinker object used to generate short links.
	 *
	 * @var WPSEO_Shortlinker
	 */
	private $shortlinker;

	/**
	 * Constructor
	 *
	 * @param  Report_Builder_Factory $report_builder_factory The factory for result builder objects.
	 *                                                        This class uses the report builder to generate WordPress-friendly
	 *                                                        health check results.
	 * @param  WPSEO_Shortlinker      $shortlinker            The WPSEO_Shortlinker object used to generate short links.
	 * @return void
	 */
	public function __construct(
		Report_Builder_Factory $report_builder_factory,
		WPSEO_Shortlinker $shortlinker
	) {
		$this->report_builder_factory = $report_builder_factory;
		$this->shortlinker            = $shortlinker;
	}

	/**
	 * Returns the message for a successful health check.
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_success_result() {
		return $this->get_report_builder()
			/* translators: %1$s expands to 'Yoast'. */
			->set_label( \sprintf( \__( '%1$s premium plugin updates work fine', 'wordpress-seo' ), 'Yoast' ) )
			->set_status_good()
			->set_description( \__( 'Great! You can activate your premium plugin(s) and receive updates.', 'wordpress-seo' ) )
			->build();
	}

	/**
	 * Returns the message for when the health check was unable to reach the MyYoast API.
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_my_yoast_api_not_reachable_result() {
		return $this->get_report_builder()
			/* translators: %1$s expands to 'Yoast'. */
			->set_label( \sprintf( \__( '%1$s premium plugins cannot update', 'wordpress-seo' ), 'Yoast' ) )
			->set_status_critical()
			->set_description( $this->get_my_yoast_api_not_reachable_description() )
			->build();
	}

	/**
	 * Returns the description for when the health check was unable to reach the MyYoast API.
	 *
	 * @return string The description containing a link to a Yoast help page about keeping cURL up to date.
	 */
	private function get_my_yoast_api_not_reachable_description() {
		return \sprintf(
			/* translators: %1$s Emphasis open tag, %2$s: Emphasis close tag, %3$s Link start tag to the Yoast help center, %4$s Link closing tag, %5$s to Yoast SEO, %6$s to my.yoast.com. */
			\esc_html__( 'You can %1$snot%2$s activate your premium plugin(s) and receive updates because %5$s cannot connect to %6$s. A common cause for not being able to connect is an out-of-date version of cURL, software used to connect to other servers. However, your cURL version seems fine. Please talk to your host and, if needed, the Yoast support team to figure out what is broken. %3$sRead more about cURL in our help center%4$s.', 'wordpress-seo' ),
			'<em>',
			'</em>',
			'<a href="' . \esc_url( $this->shortlinker->get( 'https://yoa.st/3u8' ) ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>',
			'Yoast SEO',
			'my.yoast.com'
		);
	}

	/**
	 * Returns the message for a successful health check.
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_no_recent_curl_version_installed_result() {
		return $this->get_report_builder()
			/* translators: %1$s expands to 'Yoast'. */
			->set_label( \sprintf( \__( '%1$s premium plugins cannot update', 'wordpress-seo' ), 'Yoast' ) )
			->set_status_critical()
			->set_description( $this->get_no_recent_curl_version_installed_description() )
			->build();
	}

	/**
	 * Returns the description for when the health check couldn't find a recent enough version of cURL installed on the server.
	 *
	 * @return string The description containing a link to a Yoast help page about keeping cURL up to date.
	 */
	private function get_no_recent_curl_version_installed_description() {
		return \sprintf(
			/* translators: %1$s Emphasis open tag, %2$s: Emphasis close tag, %3$s Link start tag to the Yoast help center, %4$s Link closing tag, %5$s to Yoast SEO, %6$s to my.yoast.com. */
			\esc_html__( 'You can %1$snot%2$s activate your premium plugin(s) and receive updates because %5$s cannot connect to %6$s. The cause for this error is probably that the cURL software on your server is too old. Please contact your host and ask them to update it to at least version 7.34. %3$sRead more about cURL in our help center%4$s.', 'wordpress-seo' ),
			'<em>',
			'</em>',
			'<a href="' . \esc_url( $this->shortlinker->get( 'https://yoa.st/3u8' ) ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>',
			'Yoast SEO',
			'my.yoast.com'
		);
	}
}
