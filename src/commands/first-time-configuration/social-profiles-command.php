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
 * Command to store Social Profiles configs.
 */
class Social_Profiles_Command implements Command_Interface {

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
	public function social_profiles() {

		$facebook_profile = $this->ask( \__( 'Add your facebook profile or leave it empty.', 'wordpress-seo' ) );
		$x_profile        = $this->ask( \__( 'Add your X profile or leave it empty.', 'wordpress-seo' ) );

		$other_social_profiles = [];

		do {
			$skippable_confirm = $this->ask( \__( 'Do you want to add another social profile?', 'wordpress-seo' ) , ['y', 'n'] );

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

		WP_CLI::line( \__( "Great! The Social Profiles step of the First Time configuration has been completed!", "wordpress-seo" ) );
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
