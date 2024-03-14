<?php

namespace Yoast\WP\SEO\Commands;

use Exception;
use WP_CLI;
use WP_CLI\Utils;
use Yoast\WP\SEO\Actions\Configuration\First_Time_Configuration_Action;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Helpers\Options_Helper;


/**
 * Command to generate indexables for all posts and terms.
 */
class First_Time_Configuration_Command implements Command_Interface {


	/**
	 *  The first tinme configuration action.
	 *
	 * @var First_Time_Configuration_Action
	 */
	private $first_time_configuration_action;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param First_Time_Configuration_Action $first_time_configuration_action The first tinme configuration action.
	 */
	public function __construct(
		First_Time_Configuration_Action $first_time_configuration_action,
		Options_Helper $options_helper) {
		$this->first_time_configuration_action = $first_time_configuration_action;
		$this->options_helper                  = $options_helper;
	}

	/**
	 * The main command.
	 *
	 * @param array|null $args       The arguments.
	 * @param array|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function first_time_configuration() {
		/// SEO data optimization
		WP_CLI::confirm( \__( 'Do you want to run the SEO data optimization?', 'wordpress-seo' ) );

		WP_CLI::runcommand( 'yoast index', $options = [] );
		
		WP_CLI::line( \__( "SEO data optimization completed successfully", 'wordpress-seo' ) );

		/// Site representation
		$options=['organization', 'person'];

		$chosen_option = $this->ask( \__( 'Does your site represent an Organization or a Person?', 'wordpress-seo' ) , $options );

		$representation_values                 = [];
		$representation_values['website_name'] = $this->ask( \__( 'What is your website name?', 'wordpress-seo' ) );
		if ( $chosen_option === 'organization' ) {
			$representation_values['company_or_person'] = 'company';
			$representation_values['company_name']      = $this->ask( \__( 'What is your organization name?', 'wordpress-seo' ) );
		} else {
			$person_email = $this->ask( \__( 'Give us the email of the user that is represented by the website.', 'wordpress-seo' ) );
			$user         = get_user_by( 'email', $person_email );
			while ( $user === false ) {
				WP_CLI::error( \__( 'The email does not belong to a user of the website.', 'wordpress-seo' ), false );
				$person_email = $this->ask( \__( 'Give us the email of the user that is represented by the website.', 'wordpress-seo' ) );
				$user         = get_user_by( 'email', $person_email );
			}
			$representation_values['company_or_person_user_id'] = $user->ID;
			$representation_values['company_or_person']         = 'person';
		}

		$result = $this->first_time_configuration_action->set_site_representation( $representation_values );

		if ( $result->success === false ) {
			WP_CLI::error( $result->message, false );
		}
		/// Social profiles

		$facebook_profile = $this->ask( \__( 'Add your facebook profile or leave it empty.', 'wordpress-seo' ) );
		$x_profile        = $this->ask( \__( 'Add your X profile or leave it empty.', 'wordpress-seo' ) );

		$other_social_profiles = [];

		do {
			$skippable_confirm = $this->ask( \__( 'Do you want to add a social profile?', 'wordpress-seo' ) , ['y', 'n'] );

			if ( $skippable_confirm === 'y' ) {
				$other_social_profiles[] = $this->ask( \__( 'What is the URL of the social profile?', 'wordpress-seo' ) );
			}
		} while ( $skippable_confirm === 'y');

		$result = $this->first_time_configuration_action->set_social_profiles(
			[
				'facebook_site' => $facebook_profile,
				'twitter_site' => $x_profile,
				'other_social_urls' => $other_social_profiles
			]
		);

		// Personal preferences

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
	}
	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return Main::WP_CLI_NAMESPACE;
	}
	
	private function ask( $question, $options = [] ) {
		if ( ! empty( $options ) ) {
			fwrite( STDOUT, $question . ' [' . implode( ',', $options ) . '] ' . \PHP_EOL );

			$answer = strtolower( trim( fgets( STDIN ) ) );

			if ( ! in_array( $answer, $options, true ) ) {
				WP_CLI::error( 'Invalid answer', false );
				return $this->ask( $question, $options );
			}
			return $answer;
		}

		fwrite( STDOUT, $question . \PHP_EOL );

		return trim( fgets( STDIN ) );
	}

	public function request( $request_body = [], $request_headers = [] ) {
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
