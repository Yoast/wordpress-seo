<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Actions\Indexation\Indexable_Complete_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexation\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexing_List_Item_Presenter;

class Indexing_Integration implements Integration_Interface {

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
	 * The total amount of unindexed objects.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class,
			Yoast_Admin_And_Dashboard_Conditional::class,
			Migrations_Conditional::class,
		];
	}

	public function __construct(
		Indexable_Post_Indexation_Action $post_indexation,
		Indexable_Term_Indexation_Action $term_indexation,
		Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation,
		Indexable_General_Indexation_Action $general_indexation,
		Indexable_Complete_Indexation_Action $complete_indexation_action,
		Post_Link_Indexing_Action $post_link_indexing_action,
		Term_Link_Indexing_Action $term_link_indexing_action
	) {
		$this->post_indexation              = $post_indexation;
		$this->term_indexation              = $term_indexation;
		$this->post_type_archive_indexation = $post_type_archive_indexation;
		$this->general_indexation           = $general_indexation;
		$this->complete_indexation_action   = $complete_indexation_action;
		$this->post_link_indexing_action    = $post_link_indexing_action;
		$this->term_link_indexing_action    = $term_link_indexing_action;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'wpseo_tools_overview_list_items', [ $this, 'render_indexing_list_item' ], 10 );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 10 );
	}

	/**
	 * Enqueues the required scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		/*
		 * We aren't able to determine whether or not anything needs to happen at register_hooks,
		 * as post types aren't registered yet. So we do most of our add_action calls here.
		 */
		if ( $this->get_total_unindexed() === 0 ) {
			$this->complete_indexation_action->complete();

			return;
		}
	}

	/**
	 * Renders the indexation list item.
	 *
	 * @return void
	 */
	public function render_indexing_list_item() {
		if ( \current_user_can( 'manage_options' ) ) {
			echo new Indexing_List_Item_Presenter();
		}
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @return int
	 */
	public function get_total_unindexed() {
		if ( \is_null( $this->total_unindexed ) ) {
			$this->total_unindexed  = $this->post_indexation->get_total_unindexed();
			$this->total_unindexed += $this->term_indexation->get_total_unindexed();
			$this->total_unindexed += $this->general_indexation->get_total_unindexed();
			$this->total_unindexed += $this->post_type_archive_indexation->get_total_unindexed();
			$this->total_unindexed += $this->post_link_indexing_action->get_total_unindexed();
			$this->total_unindexed += $this->term_link_indexing_action->get_total_unindexed();
		}

		return $this->total_unindexed;
	}
}
