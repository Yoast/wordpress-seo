<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexation_List_Item_Presenter;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Modal_Presenter;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Warning_Presenter;
use Yoast\WP\SEO\Routes\Indexable_Indexation_Route;

/**
 * Indexation_Integration class
 */
class Indexation_Integration implements Integration_Interface {

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

	/**
	 * The post indexation action.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	protected $post_indexation;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

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
	 * Represents tha admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * The total amount of unindexed objects.
	 *
	 * @var int
	 */
	private $total_unindexed;

	/**
	 * Indexation_Integration constructor.
	 *
	 * @param Indexable_Post_Indexation_Action              $post_indexation              The post indexation action.
	 * @param Indexable_Term_Indexation_Action              $term_indexation              The term indexation action.
	 * @param Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation The archive indexation action.
	 * @param Indexable_General_Indexation_Action           $general_indexation           The general indexation action.
	 * @param Options_Helper                                $options_helper               The options helper.
	 * @param WPSEO_Admin_Asset_Manager                     $asset_manager                The admin asset manager.
	 */
	public function __construct(
		Indexable_Post_Indexation_Action $post_indexation,
		Indexable_Term_Indexation_Action $term_indexation,
		Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation,
		Indexable_General_Indexation_Action $general_indexation,
		Options_Helper $options_helper,
		WPSEO_Admin_Asset_Manager $asset_manager
	) {
		$this->post_indexation              = $post_indexation;
		$this->term_indexation              = $term_indexation;
		$this->post_type_archive_indexation = $post_type_archive_indexation;
		$this->general_indexation           = $general_indexation;
		$this->options_helper               = $options_helper;
		$this->asset_manager                = $asset_manager;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'wpseo_tools_overview_list_items', [ $this, 'render_indexation_list_item' ], 10 );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 10 );
	}

	/**
	 * Enqueues the required scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		// We aren't able to determine whether or not anything needs to happen at register_hooks as post types aren't registered yet.
		// So we do most of our add_action calls here.
		if ( $this->get_total_unindexed() === 0 ) {
			return;
		}

		/**
		 * Filter 'wpseo_shutdown_indexation_limit' - Allow filtering the amount of objects that can be indexed during shutdown.
		 *
		 * @api int The maximum number of objects indexed.
		 */
		$shutdown_limit = \apply_filters( 'wpseo_shutdown_indexation_limit', 25 );

		if ( $this->get_total_unindexed() < $shutdown_limit ) {
			\register_shutdown_function( [ $this, 'shutdown_indexation' ] );

			return;
		}

		\add_action( 'admin_footer', [ $this, 'render_indexation_modal' ], 20 );
		if ( $this->is_indexation_warning_hidden() === false ) {
			\add_action( 'admin_notices', [ $this, 'render_indexation_warning' ], 10 );
		}

		$this->asset_manager->enqueue_script( 'indexation' );
		$this->asset_manager->enqueue_style( 'admin-css' );

		$data = [
			'amount'  => $this->get_total_unindexed(),
			'ids'     => [
				'count'    => '#yoast-indexation-current-count',
				'progress' => '#yoast-indexation-progress-bar',
			],
			'restApi' => [
				'root'      => \esc_url_raw( \rest_url() ),
				'endpoints' => [
					'prepare'  => Indexable_Indexation_Route::FULL_PREPARE_ROUTE,
					'posts'    => Indexable_Indexation_Route::FULL_POSTS_ROUTE,
					'terms'    => Indexable_Indexation_Route::FULL_TERMS_ROUTE,
					'archives' => Indexable_Indexation_Route::FULL_POST_TYPE_ARCHIVES_ROUTE,
					'general'  => Indexable_Indexation_Route::FULL_GENERAL_ROUTE,
					'complete' => Indexable_Indexation_Route::FULL_COMPLETE_ROUTE,
				],
				'nonce'     => \wp_create_nonce( 'wp_rest' ),
			],
			'message' => [
				'indexingCompleted' => '<span class="wpseo-checkmark-ok-icon"></span>' . \esc_html__( 'Good job! You\'ve sped up your site.', 'wordpress-seo' ),
				'indexingFailed'    => __( 'Something went wrong while optimizing the SEO data of your site. Please try again later.', 'wordpress-seo' ),
			],
			'l10n'    => [
				'calculationInProgress' => __( 'Optimization in progress...', 'wordpress-seo' ),
				'calculationCompleted'  => __( 'Optimization completed.', 'wordpress-seo' ),
				'calculationFailed'     => __( 'Optimization failed, please try again later.', 'wordpress-seo' ),
			],
		];

		\wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'indexation', 'yoastIndexationData', $data );
	}

	/**
	 * Renders the indexation warning.
	 *
	 * @return void
	 */
	public function render_indexation_warning() {
		echo new Indexation_Warning_Presenter( $this->get_total_unindexed(), $this->options_helper );
	}

	/**
	 * Renders the indexation modal.
	 *
	 * @return void
	 */
	public function render_indexation_modal() {
		\add_thickbox();

		echo new Indexation_Modal_Presenter( $this->get_total_unindexed() );
	}

	/**
	 * Renders the indexation list item.
	 *
	 * @return void
	 */
	public function render_indexation_list_item() {
		echo new Indexation_List_Item_Presenter( $this->get_total_unindexed() );
	}

	/**
	 * Run a single indexation pass of each indexation action. Intended for use as a shutdown function.
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
	 * @return int
	 */
	protected function get_total_unindexed() {
		if ( \is_null( $this->total_unindexed ) ) {
			$this->total_unindexed  = $this->post_indexation->get_total_unindexed();
			$this->total_unindexed += $this->term_indexation->get_total_unindexed();
			$this->total_unindexed += $this->general_indexation->get_total_unindexed();
			$this->total_unindexed += $this->post_type_archive_indexation->get_total_unindexed();
		}

		return $this->total_unindexed;
	}

	/**
	 * Returns if the indexation warning is temporarily hidden.
	 *
	 * @return bool True if hidden.
	 */
	protected function is_indexation_warning_hidden() {
		if ( $this->options_helper->get( 'ignore_indexation_warning', false ) === true ) {
			return true;
		}

		// When the indexation is started, but not completed.
		if ( $this->options_helper->get( 'indexation_started', false ) > ( time() - MONTH_IN_SECONDS ) ) {
			return true;
		}

		$hide_until = (int) $this->options_helper->get( 'indexation_warning_hide_until' );
		return ( $hide_until !== 0 && $hide_until >= \time() );
	}
}
