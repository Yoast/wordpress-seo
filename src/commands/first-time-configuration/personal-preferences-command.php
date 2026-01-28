<?php

namespace Yoast\WP\SEO\Commands\First_Time_Configuration;

use Exception;
use WP_CLI;
use WP_CLI\Utils;
use Yoast\WP\SEO\Actions\Configuration\First_Time_Configuration_Action;
use Yoast\WP\SEO\Commands\Ask_Trait;
use Yoast\WP\SEO\Commands\Command_Interface;
use Yoast\WP\SEO\Main;


/**
 * Command to store Personal Preferences configs.
 */
class Personal_Preferences_Command implements Command_Interface {

	use Ask_Trait;

	/**
	 *  The first tinme configuration action.
	 *
	 * @var First_Time_Configuration_Action
	 */
	private $first_time_configuration_action;

	/**
	 * The constructor.
	 *
	 * @param First_Time_Configuration_Action $first_time_configuration_action The first tinme configuration action.
	 */
	public function __construct(
		First_Time_Configuration_Action $first_time_configuration_action
	) {
		$this->first_time_configuration_action = $first_time_configuration_action;
	}

	/**
	 * The main command.
	 *
	 * @param array|null $args       The arguments.
	 * @param array|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function personal_preferences() {
		$email = $this->ask( \__( 'Please specify your email if you want to receive our newsletter (leave blank otherwise)', 'wordpress-seo' ) );

		if( ! empty( $email ) ) {
			$customer_details = [
				'customerDetails' => [
					'firstName' => '',
					'email' => $email
				],
					'list' => 'Yoast newsletter',
					'source' => 'free'
			];

			// @todo: Please check if all the headers in packages/js/src/first-time-configuration/tailwind-components/steps/personal-preferences/newsletter-signup.js are needed here
			$request_headers = [
				'Content-Type' => 'application/json',
				'Referrer-Policy' => 'no-referrer', 
				'Cache-control' => 'no-cache',
			];

			$response = json_decode( $this->request( $customer_details, $request_headers ) );

			if ( property_exists($response, 'error' ) || ( $response->status !== 'subscribed' ) ) {
				WP_CLI::error( \__( "An error occurred while trying to subscribe to the newsletter.", "wordpress-seo" ), false );
			} else {
				WP_CLI::line( \__( "Thank you! Check your inbox for the confirmation email.", "wordpress-seo" ) );
			}
		}

		$choice = $this->ask( \__( 'Do you want to be tracked?', 'wordpress-seo' ), ['y', 'n' ] );
		
		$tracking = $choice === 'y' ? true : false;
		
		$this->first_time_configuration_action->set_enable_tracking( ['tracking' => $tracking ] );

		WP_CLI::line( \__( "Great! The Personal Preferences step of the First Time configuration has been completed!", "wordpress-seo" ) );
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return Main::WP_CLI_NAMESPACE;
	}

	private function request( $request_body = [], $request_headers = [] ) {
		//$request_headers   = \array_merge( $request_headers, [ 'Content-Type' => 'application/json' ] );
		$request_arguments = [
			'timeout' => 30,
			// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.Found -- Reason: We don't want the debug/pretty possibility.
			'body'    => \wp_json_encode( $request_body ),
			'headers' => $request_headers,
		];

		$response = \wp_remote_post( 'https://my.yoast.com/api/Mailing-list/subscribe', $request_arguments );

		if ( \is_wp_error( $response ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
			throw new Exception( $response->get_error_message(), $response->get_error_code() );
		}

		return \wp_remote_retrieve_body($response);
	}
}
