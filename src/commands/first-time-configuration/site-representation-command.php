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
 * Command to store Site Representation configs.
 */
class Site_Representation_Command implements Command_Interface {

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
	public function site_representation() {
		$options=['o', 'p'];

		$chosen_option = $this->ask( \__( 'Does your site represent an Organization or a Person?', 'wordpress-seo' ) , $options );

		$representation_values                 = [];
		$representation_values['website_name'] = $this->ask( \__( 'What is your website name?', 'wordpress-seo' ) );
		if ( $chosen_option === 'o' ) {
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

		WP_CLI::line( \__( "Great! The Site Representation step of the First Time configuration has been completed!", "wordpress-seo" ) );
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return Main::WP_CLI_NAMESPACE;
	}
}
