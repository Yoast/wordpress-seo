<?php
/**
 * Command to generate indexables for all posts and terms.
 *
 * @package Yoast\YoastSEO\Commands
 */

namespace Yoast\WP\SEO\Commands;

use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexation_Action_Interface;

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
	 * @param Indexable_Post_Indexation_Action              $post_indexation_action              The post indexation action.
	 * @param Indexable_Term_Indexation_Action              $term_indexation_action              The term indexation action.
	 * @param Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation_action The post type archive indexation action.
	 * @param Indexable_General_Indexation_Action           $general_indexation_action           The general indexation action.
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
	 * Returns the name of this command.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'yoast index';
	}

	/**
	 * Returns the configuration of this command.
	 *
	 * @return array
	 */
	public function get_config() {
		return [ 'shortdesc' => __( 'Indexes all your content to ensure the best performance.', 'wordpress-seo' ) ];
	}

	/**
	 * Executes this command.
	 *
	 * @return void
	 */
	public function execute() {
		$indexation_actions = [
			'Posts' => $this->post_indexation_action,
			'Terms' => $this->term_indexation_action,
			'Post type archives' => $this->post_type_archive_indexation_action,
			'General objects' => $this->general_indexation_action,
		];

		foreach ( $indexation_actions as $name => $indexation_action ) {
			$this->run_indexation_action( $name, $indexation_action );
		}
	}

	/**
	 * Runs an indextion action.
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
				$count = \count( $indexables );
				$progress->tick( $count );
			} while ( $count >= $limit );
			$progress->finish();
		}
	}
}
