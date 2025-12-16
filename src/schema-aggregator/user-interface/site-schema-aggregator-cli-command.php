<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use WP_CLI;
use WP_CLI\ExitException;
use WPSEO_Utils;
use Yoast\WP\SEO\Commands\Command_Interface;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;

/**
 * Handles the CLI command to represent a site's schema as JSON.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Site_Schema_Aggregator_Cli_Command implements Command_Interface {

	/**
	 * The configuration instance.
	 *
	 * @var Config
	 */
	private $config;

	/**
	 * The command handler instance.
	 *
	 * @var Aggregate_Site_Schema_Command_Handler
	 */
	private $aggregate_site_schema_command_handler;

	/**
	 * Site_Schema_Aggregator_Cli_Command constructor.
	 *
	 * @param Config                                $config                                The config object.
	 * @param Aggregate_Site_Schema_Command_Handler $aggregate_site_schema_command_handler The command handler.
	 */
	public function __construct( Config $config, Aggregate_Site_Schema_Command_Handler $aggregate_site_schema_command_handler ) {
		$this->config                                = $config;
		$this->aggregate_site_schema_command_handler = $aggregate_site_schema_command_handler;
	}

	/**
	 * Returns the namespace of this command.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return Main::WP_CLI_NAMESPACE;
	}

	/**
	 * Aggregates the schema for a certain site.
	 *
	 * ## OPTIONS
	 *
	 * [--page=<page>]
	 * : The current page to process.
	 * ---
	 * default: 1
	 * ---
	 *
	 * [--per_page=<per_page>]
	 * : How many items to process per page.
	 * ---
	 * default: 100
	 * ---
	 *
	 * [--post_type=<post_type>]
	 * : The post type to aggregate schema for.
	 * ---
	 * default: 'post'
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     wp yoast aggregate_site_schema
	 *
	 * @when after_wp_load
	 *
	 * @param array<string>|null $args       The arguments.
	 * @param array<string>|null $assoc_args The associative arguments.
	 *
	 * @throws ExitException When the input args are invalid.
	 * @return void
	 */
	public function aggregate_site_schema( $args = null, $assoc_args = null ) {
		if ( isset( $assoc_args['page'] ) && (int) $assoc_args['page'] < 1 ) {
			WP_CLI::error( \__( 'The value for \'page\' must be a positive integer higher than equal to 1.', 'wordpress-seo' ) );
		}
		if ( isset( $assoc_args['per_page'] ) && (int) $assoc_args['per_page'] < 1 ) {
			WP_CLI::error( \__( 'The value for \'per_page\' must be a positive integer higher than equal to 1.', 'wordpress-seo' ) );
		}
		$page      = (int) $assoc_args['page'];
		$per_page  = (int) $assoc_args['per_page'];
		$post_type = $assoc_args['post_type'];
		try {
			$result = $this->aggregate_site_schema_command_handler->handle( new Aggregate_Site_Schema_Command( $page, $per_page, $post_type ) );
		} catch ( Exception $exception ) {
			WP_CLI::error( \__( 'An error occurred while aggregating the site schema.', 'wordpress-seo' ) );
		}
		$output = WPSEO_Utils::format_json_encode( $result );
		$output = \str_replace( "\n", \PHP_EOL . "\t", $output );
		WP_CLI::log(
			$output
		);
	}
}
