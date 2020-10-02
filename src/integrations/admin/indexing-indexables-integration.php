<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Actions\Indexation\Indexable_Complete_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Integrations\Indexing_Interface;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Routes\Indexable_Indexation_Route;

/**
 * Class Indexing_Integration.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */
class Indexing_Indexables_Integration implements Indexing_Interface, Integration_Interface {

	/**
	 * The post indexation action.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	protected $post_indexation;

	/**
	 * The term indexation action.
	 *
	 * @var Indexable_Term_Indexation_Action
	 */
	protected $term_indexation;

	/**
	 * The post type archive indexation action.
	 *
	 * @var Indexable_Post_Type_Archive_Indexation_Action
	 */
	protected $post_type_archive_indexation;

	/**
	 * Represents the general indexation.
	 *
	 * @var Indexable_General_Indexation_Action
	 */
	protected $general_indexation;

	/**
	 * Represented the indexation completed action.
	 *
	 * @var Indexable_Complete_Indexation_Action
	 */
	protected $complete_indexation_action;

	/**
	 * The total number of unindexed objects.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [
			Yoast_Tools_Page_Conditional::class,
			Migrations_Conditional::class,
		];
	}

	/**
	 * Indexing_Integration constructor.
	 *
	 * @param Indexable_Post_Indexation_Action              $post_indexation              The post indexing action.
	 * @param Indexable_Term_Indexation_Action              $term_indexation              The term indexing action.
	 * @param Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation The post type archive indexing action.
	 * @param Indexable_General_Indexation_Action           $general_indexation           The general indexing action.
	 * @param Indexable_Complete_Indexation_Action          $complete_indexation_action   The complete indexing action.
	 */
	public function __construct(
		Indexable_Post_Indexation_Action $post_indexation,
		Indexable_Term_Indexation_Action $term_indexation,
		Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation,
		Indexable_General_Indexation_Action $general_indexation,
		Indexable_Complete_Indexation_Action $complete_indexation_action
	) {
		$this->post_indexation              = $post_indexation;
		$this->term_indexation              = $term_indexation;
		$this->post_type_archive_indexation = $post_type_archive_indexation;
		$this->general_indexation           = $general_indexation;
		$this->complete_indexation_action   = $complete_indexation_action;
	}

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 10 );
	}

	/**
	 * Enqueues the required scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$total_unindexed = $this->get_total_unindexed();
		if ( $total_unindexed === 0 ) {
			$this->complete_indexation_action->complete();
		}

		/**
		 * Filter 'wpseo_shutdown_indexation_limit' - Allow filtering the number of objects that can be indexed during shutdown.
		 *
		 * @api int The maximum number of objects indexed.
		 */
		$shutdown_limit = \apply_filters( 'wpseo_shutdown_indexation_limit', 25 );

		if ( $total_unindexed < $shutdown_limit ) {
			\register_shutdown_function( [ $this, 'shutdown_indexation' ] );
		}
	}

	/**
	 * Retrieves the endpoints to call.
	 *
	 * @return array The endpoints.
	 */
	public function get_endpoints() {
		return [
			'prepare'  => Indexable_Indexation_Route::FULL_PREPARE_ROUTE,
			'terms'    => Indexable_Indexation_Route::FULL_TERMS_ROUTE,
			'posts'    => Indexable_Indexation_Route::FULL_POSTS_ROUTE,
			'archives' => Indexable_Indexation_Route::FULL_POST_TYPE_ARCHIVES_ROUTE,
			'general'  => Indexable_Indexation_Route::FULL_GENERAL_ROUTE,
			'complete' => Indexable_Indexation_Route::FULL_COMPLETE_ROUTE,
		];
	}

	/**
	 * Run a single indexing pass of each indexing action. Intended for use as a shutdown function.
	 *
	 * @return void
	 */
	public function shutdown_indexation() {
		$this->post_indexation->index();
		$this->term_indexation->index();
		$this->general_indexation->index();
		$this->post_type_archive_indexation->index();
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @return int The total number of unindexed objects.
	 */
	public function get_total_unindexed() {
		if ( \is_null( $this->total_unindexed ) ) {
			$this->total_unindexed  = $this->post_indexation->get_total_unindexed();
			$this->total_unindexed += $this->term_indexation->get_total_unindexed();
			$this->total_unindexed += $this->general_indexation->get_total_unindexed();
			$this->total_unindexed += $this->post_type_archive_indexation->get_total_unindexed();
		}

		return $this->total_unindexed;
	}
}
