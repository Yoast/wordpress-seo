<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use WP_CLI;
use WP_CLI\Utils;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Home url option watcher.
 *
 * Handles updates to the home URL option for the Indexables table.
 */
class Indexable_HomeUrl_Watcher implements Integration_Interface {

	/**
	 * Represents the options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Indexable_HomeUrl_Watcher constructor.
	 *
	 * @param Post_Type_Helper $post_type The post type helper.
	 * @param Options_Helper   $options   The options helper.
	 * @param Indexable_Helper $indexable The indexable helper.
	 */
	public function __construct( Post_Type_Helper $post_type, Options_Helper $options, Indexable_Helper $indexable ) {
		$this->post_type        = $post_type;
		$this->options_helper   = $options;
		$this->indexable_helper = $indexable;

		$this->schedule_cron();
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'update_option_home', [ $this, 'reset_permalinks' ] );
		\add_action( 'wpseo_home_url_check', [ $this, 'force_reset_permalinks' ] );
	}

	/**
	 * Resets the permalinks for everything that is related to the permalink structure.
	 *
	 * @return void
	 */
	public function reset_permalinks() {
		$post_types = $this->get_post_types();
		foreach ( $post_types as $post_type ) {
			$this->reset_permalinks_post_type( $post_type );
		}

		$taxonomies = $this->get_taxonomies_for_post_types( $post_types );
		foreach ( $taxonomies as $taxonomy ) {
			$this->indexable_helper->reset_permalink_indexables( 'term', $taxonomy, Indexing_Notification_Integration::REASON_HOME_URL_OPTION );
		}

		$this->indexable_helper->reset_permalink_indexables( 'home-page', null, Indexing_Notification_Integration::REASON_HOME_URL_OPTION );
		$this->indexable_helper->reset_permalink_indexables( 'user', null, Indexing_Notification_Integration::REASON_HOME_URL_OPTION );
		$this->indexable_helper->reset_permalink_indexables( 'date-archive', null, Indexing_Notification_Integration::REASON_HOME_URL_OPTION );
		$this->indexable_helper->reset_permalink_indexables( 'system-page', null, Indexing_Notification_Integration::REASON_HOME_URL_OPTION );

		// Reset the home_url option.
		$this->options_helper->set( 'home_url', get_home_url() );
	}

	/**
	 * Resets the permalink for the given post type.
	 *
	 * @param string $post_type The post type to reset.
	 */
	public function reset_permalinks_post_type( $post_type ) {
		$this->indexable_helper->reset_permalink_indexables( 'post', $post_type, Indexing_Notification_Integration::REASON_HOME_URL_OPTION );
		$this->indexable_helper->reset_permalink_indexables( 'post-type-archive', $post_type, Indexing_Notification_Integration::REASON_HOME_URL_OPTION );
	}

	/**
	 * Resets the permalink indexables automatically, if necessary.
	 *
	 * @return bool Whether the request ran.
	 */
	public function force_reset_permalinks() {
		if ( $this->should_reset_permalinks() ) {
			$this->reset_permalinks();

			if ( \defined( 'WP_CLI' ) && \WP_CLI ) {
				WP_CLI::success( __( 'All permalinks were successfully reset', 'wordpress-seo' ) );
			}

			return true;
		}

		return false;
	}

	/**
	 * Checks whether permalinks should be reset.
	 *
	 * @return bool Whether the permalinks should be reset.
	 */
	public function should_reset_permalinks() {
		return \get_home_url() !== $this->options_helper->get( 'home_url' );
	}

	/**
	 * Retrieves a list with the public post types.
	 *
	 * @return array The post types.
	 */
	protected function get_post_types() {
		/**
		 * Filter: Gives the possibility to filter out post types.
		 *
		 * @param array $post_types The post type names.
		 *
		 * @return array The post types.
		 */
		return \apply_filters( 'wpseo_post_types_reset_permalinks', $this->post_type->get_public_post_types() );
	}

	/**
	 * Retrieves the taxonomies that belongs to the public post types.
	 *
	 * @param array $post_types The post types to get taxonomies for.
	 *
	 * @return array The retrieved taxonomies.
	 */
	protected function get_taxonomies_for_post_types( $post_types ) {
		$taxonomies = [];
		foreach ( $post_types as $post_type ) {
			$taxonomies[] = \get_object_taxonomies( $post_type, 'names' );
		}

		$taxonomies = \array_merge( [], ...$taxonomies );
		$taxonomies = \array_unique( $taxonomies );

		return $taxonomies;
	}

	/**
	 * Schedules the cronjob to check the home_url status.
	 *
	 * @return void
	 */
	protected function schedule_cron() {
		if ( \wp_next_scheduled( 'wpseo_home_url_check' ) ) {
			return;
		}

		\wp_schedule_event( time(), 'daily', 'wpseo_home_url_check' );
	}
}
