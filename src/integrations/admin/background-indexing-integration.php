<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexing\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Get_Request_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Background_Indexing_Integration.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */
class Background_Indexing_Integration implements Integration_Interface {

	/**
	 * The post indexing action.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	protected $post_indexation;

	/**
	 * The term indexing action.
	 *
	 * @var Indexable_Term_Indexation_Action
	 */
	protected $term_indexation;

	/**
	 * The post type archive indexing action.
	 *
	 * @var Indexable_Post_Type_Archive_Indexation_Action
	 */
	protected $post_type_archive_indexation;

	/**
	 * Represents the general indexing.
	 *
	 * @var Indexable_General_Indexation_Action
	 */
	protected $general_indexation;

	/**
	 * Represents the indexing completed action.
	 *
	 * @var Indexable_Indexing_Complete_Action
	 */
	protected $complete_indexation_action;

	/**
	 * The post link indexing action.
	 *
	 * @var Post_Link_Indexing_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * The term link indexing action.
	 *
	 * @var Term_Link_Indexing_Action
	 */
	protected $term_link_indexing_action;

	/**
	 * Represents the indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [
			Yoast_Admin_And_Dashboard_Conditional::class,
			Migrations_Conditional::class,
			Get_Request_Conditional::class,
		];
	}

	/**
	 * Shutdown_Indexing_Integration constructor.
	 *
	 * @param Indexable_Post_Indexation_Action              $post_indexation              The post indexing action.
	 * @param Indexable_Term_Indexation_Action              $term_indexation              The term indexing action.
	 * @param Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation The post type archive indexing action.
	 * @param Indexable_General_Indexation_Action           $general_indexation           The general indexing action.
	 * @param Indexable_Indexing_Complete_Action            $complete_indexation_action   The complete indexing action.
	 * @param Post_Link_Indexing_Action                     $post_link_indexing_action    The post indexing action.
	 * @param Term_Link_Indexing_Action                     $term_link_indexing_action    The term indexing action.
	 * @param Indexing_Helper                               $indexing_helper              The indexing helper.
	 */
	public function __construct(
		Indexable_Post_Indexation_Action $post_indexation,
		Indexable_Term_Indexation_Action $term_indexation,
		Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation,
		Indexable_General_Indexation_Action $general_indexation,
		Indexable_Indexing_Complete_Action $complete_indexation_action,
		Post_Link_Indexing_Action $post_link_indexing_action,
		Term_Link_Indexing_Action $term_link_indexing_action,
		Indexing_Helper $indexing_helper
	) {
		$this->post_indexation              = $post_indexation;
		$this->term_indexation              = $term_indexation;
		$this->post_type_archive_indexation = $post_type_archive_indexation;
		$this->general_indexation           = $general_indexation;
		$this->complete_indexation_action   = $complete_indexation_action;
		$this->post_link_indexing_action    = $post_link_indexing_action;
		$this->term_link_indexing_action    = $term_link_indexing_action;
		$this->indexing_helper              = $indexing_helper;
	}

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'register_shutdown_indexing' ], 10 );
	}

	/**
	 * Enqueues the required scripts.
	 *
	 * @return void
	 */
	public function register_shutdown_indexing() {
		if ( $this->should_index_on_shutdown( $this->get_shutdown_limit() ) ) {
			\register_shutdown_function( [ $this, 'index' ] );
		}
	}

	/**
	 * Run a single indexing pass of each indexing action. Intended for use as a shutdown function.
	 *
	 * @return void
	 */
	public function index() {
		$this->post_indexation->index();
		$this->term_indexation->index();
		$this->general_indexation->index();
		$this->post_type_archive_indexation->index();
		$this->post_link_indexing_action->index();
		$this->term_link_indexing_action->index();
		$this->complete_indexation_action->complete();
	}

	/**
	 * Retrieves the shutdown limit. This limit is the amount of indexables that is generated in the background.
	 *
	 * @return int The shutdown limit.
	 */
	protected function get_shutdown_limit() {
		/**
		 * Filter 'wpseo_shutdown_indexation_limit' - Allow filtering the number of objects that can be indexed during shutdown.
		 *
		 * @api int The maximum number of objects indexed.
		 */
		return \apply_filters( 'wpseo_shutdown_indexation_limit', 25 );
	}

	/**
	 * Determine whether background indexation should be performed.
	 *
	 * @param int $shutdown_limit The shutdown limit used to determine whether indexation should be run.
	 *
	 * @return bool Should background indexation be performed.
	 */
	public function should_index_on_shutdown( $shutdown_limit ) {
		$total = $this->indexing_helper->get_limited_filtered_unindexed_count( $shutdown_limit );

		return ( $total > 0 && $total < $shutdown_limit );
	}
}
