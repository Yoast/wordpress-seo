<?php

namespace Yoast\WP\SEO\Commands;

use Exception;
use WP_CLI;
use WP_CLI\Utils;
use Yoast\WP\SEO\Actions\Configuration\First_Time_Configuration_Action;
use Yoast\WP\SEO\Commands\First_Time_Configuration\Site_Representation_Command;
use Yoast\WP\SEO\Commands\First_Time_Configuration\Social_Profiles_Command;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Helpers\Options_Helper;


/**
 * Command to generate indexables for all posts and terms.
 */
class First_Time_Configuration_Command implements Command_Interface {

	use Ask_Trait;

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

		WP_CLI::runcommand( 'yoast site_representation', $options = [] );

		WP_CLI::runcommand( 'yoast social_profiles', $options = [] );

		WP_CLI::runcommand( 'yoast personal_preferences', $options = [] );

		WP_CLI::line( \__( "Great work! Thanks to the details you've provided, Yoast has enhanced your site for search engines, giving them a clearer picture of what your site is all about.", "wordpress-seo" ) );
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
