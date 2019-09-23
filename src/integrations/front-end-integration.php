<?php

namespace Yoast\WP\Free\Integrations;

use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Helpers\Current_Post_Helper;
use Yoast\WP\Free\Presenters\Head_Presenter;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\WordPress\Integration;
use Yoast\WP\Free\Wrappers\WP_Query_Wrapper;

class Front_End_Integration implements Integration {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, Indexables_Feature_Flag_Conditional::class ];
	}

	/**
	 * @var Current_Post_Helper
	 */
	protected $current_post_helper;

	/**
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * @var WP_Query_Wrapper
	 */
	protected $wp_query_wrapper;

	/**
	 * @var Head_Presenter
	 */
	protected $head_presenter;

	/**
	 * Front_End_Integration constructor.
	 *
	 * @param Indexable_Repository $indexable_repository
	 * @param Current_Post_Helper  $current_post_helper
	 * @param WP_Query_Wrapper     $wp_query_wrapper
	 * @param Head_Presenter       $head_presenter
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Current_Post_Helper $current_post_helper,
		WP_Query_Wrapper $wp_query_wrapper,
		Head_Presenter $head_presenter
	) {
		$this->indexable_repository = $indexable_repository;
		$this->current_post_helper = $current_post_helper;
		$this->wp_query_wrapper = $wp_query_wrapper;
		$this->head_presenter = $head_presenter;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		add_action( 'wp_head', [ $this, 'present_head' ], 1 );

		remove_action( 'wp_head', 'rel_canonical' );
		remove_action( 'wp_head', 'index_rel_link' );
		remove_action( 'wp_head', 'start_post_rel_link' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
		remove_action( 'wp_head', 'noindex', 1 );
	}

	/**
	 * Presents the head in the front-end. Resets wp_query if it's not the main query.
	 */
	public function present_head() {
		$wp_query = $this->wp_query_wrapper->get_query();
		$old_wp_query = null;

		if ( ! $wp_query->is_main_query() ) {
			$old_wp_query = $wp_query;
			\wp_reset_query();
		}

		$indexable = $this->indexable_repository->for_current_page();
		$this->head_presenter->present( $indexable );
		/**
		 * Action: 'wpseo_head' - Allow other plugins to output inside the Yoast SEO section of the head section.
		 */
		do_action( 'wpseo_head' );

		if ( ! empty( $old_wp_query ) ) {
			$this->wp_query_wrapper->set_query( $old_wp_query );
		}
	}
}
