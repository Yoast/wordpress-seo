<?php
/**
 * Command to generate indexables for all posts and terms.
 *
 * @package Yoast\WP\SEO\Commands
 */

namespace Yoast\WP\SEO\Commands;

use WP_CLI;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexation_Action_Interface;
use Yoast\WP\SEO\Main;

/**
 * Command to generate indexables for all posts and terms.
 */
class Index_Command implements Command_Interface {

	/**
	 * The post indexation action.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	private $post_indexation_action;

	/**
	 * The term indexation action.
	 *
	 * @var Indexable_Term_Indexation_Action
	 */
	private $term_indexation_action;

	/**
	 * The post type archive indexation action.
	 *
	 * @var Indexable_Post_Type_Archive_Indexation_Action
	 */
	private $post_type_archive_indexation_action;

	/**
	 * The general indexation action.
	 *
	 * @var Indexable_General_Indexation_Action
	 */
	private $general_indexation_action;

	/**
	 * Generate_Indexables_Command constructor.
	 *
	 * @param Indexable_Post_Indexation_Action              $post_indexation_action              The post indexation
	 *                                                                                           action.
	 * @param Indexable_Term_Indexation_Action              $term_indexation_action              The term indexation
	 *                                                                                           action.
	 * @param Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation_action The post type archive
	 *                                                                                           indexation action.
	 * @param Indexable_General_Indexation_Action           $general_indexation_action           The general indexation
	 *                                                                                           action.
	 */
	public function __construct(
		Indexable_Post_Indexation_Action $post_indexation_action,
		Indexable_Term_Indexation_Action $term_indexation_action,
		Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation_action,
		Indexable_General_Indexation_Action $general_indexation_action
	) {
		$this->post_indexation_action              = $post_indexation_action;
		$this->term_indexation_action              = $term_indexation_action;
		$this->post_type_archive_indexation_action = $post_type_archive_indexation_action;
		$this->general_indexation_action           = $general_indexation_action;
	}

	/**
	 * @inheritDoc
	 */
	public static function get_namespace() {
		return Main::WP_CLI_NAMESPACE;
	}

	/**
	 * Indexes all your content to ensure the best performance.
	 *
	 * ## OPTIONS
	 *
	 * [--network]
	 * : Performs the indexation on all sites within the network.
	 *
	 * [--reindex]
	 * : Removes all existing indexables and then reindexes them.
	 *
	 * ## EXAMPLES
	 *
	 *     wp yoast index
	 *
	 * @when after_wp_load
	 *
	 * @param array $args       The arguments.
	 * @param array $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function index( $args = null, $assoc_args = null ) {
		if ( ! isset( $assoc_args['network'] ) ) {
			$this->run_indexation_actions( isset( $assoc_args['reindex'] ) );

			return;
		}

		$criteria = [
			'fields'   => 'ids',
			'spam'     => 0,
			'deleted'  => 0,
			'archived' => 0,
		];
		$blog_ids = \get_sites( $criteria );

		foreach ( $blog_ids as $blog_id ) {
			\switch_to_blog( $blog_id );
			\do_action( '_yoast_run_migrations' );
			$this->run_indexation_actions( isset( $assoc_args['reindex'] ) );
			\restore_current_blog();
		}
	}

	/**
	 * Runs all indexation actions.
	 *
	 * @param bool $reindex True when all indexables should be indexed again.
	 *
	 * @return void
	 */
	protected function run_indexation_actions( $reindex ) {
		if ( $reindex ) {
			WP_CLI::confirm( 'This will clear all previously indexed objects. Are you certain you wish to proceed?' );
			$this->clear();
		}

		$indexation_actions = [
			'posts'              => $this->post_indexation_action,
			'terms'              => $this->term_indexation_action,
			'post type archives' => $this->post_type_archive_indexation_action,
			'general objects'    => $this->general_indexation_action,
		];

		foreach ( $indexation_actions as $name => $indexation_action ) {
			$this->run_indexation_action( $name, $indexation_action );
		}
	}

	/**
	 * Runs an indexation action.
	 *
	 * @param string                      $name              The name of the object to be indexed.
	 * @param Indexation_Action_Interface $indexation_action The indexation action.
	 *
	 * @return void
	 */
	protected function run_indexation_action( $name, Indexation_Action_Interface $indexation_action ) {
		$total = $indexation_action->get_total_unindexed();
		if ( $total > 0 ) {
			$limit    = $indexation_action->get_limit();
			$progress = \WP_CLI\Utils\make_progress_bar( 'Indexing ' . $name, $total );
			do {
				$indexables = $indexation_action->index();
				$count      = \count( $indexables );
				$progress->tick( $count );
			} while ( $count >= $limit );
			$progress->finish();
		}
	}

	/**
	 * Clears the database related to the indexables.
	 */
	protected function clear() {
		global $wpdb;

		$wpdb->query(
			$wpdb->prepare(
				'TRUNCATE TABLE %1$s',
				Model::get_table_name( 'Indexable' )
			)
		);
		$wpdb->query(
			$wpdb->prepare(
				'TRUNCATE TABLE %1$s',
				Model::get_table_name( 'Indexable_Hierarchy' )
			)
		);
	}
}
