<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
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
		return [ Admin_Conditional::class, Yoast_Admin_And_Dashboard_Conditional::class ];
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
	 * The total amount of unindexed objects.
	 *
	 * @var int
	 */
	private $total_unindexed;

	/**
	 * Indexation_Integration constructor.
	 *
	 * @param Indexable_Post_Indexation_Action $post_indexation The post indexation action.
	 * @param Options_Helper                   $options_helper  The options helper.
	 */
	public function __construct(
		Indexable_Post_Indexation_Action $post_indexation,
		Options_Helper $options_helper
	) {
		$this->post_indexation = $post_indexation;
		$this->options_helper  = $options_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		if ( $this->options_helper->get( 'ignore_indexation_warning', false ) !== false || $this->get_total_unindexed() === 0 ) {
			return;
		}

		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 10 );
		\add_action( 'admin_footer', [ $this, 'render_indexation_modal' ], 20 );
		\add_action( 'admin_notices', [ $this, 'render_indexation_warning' ], 10 );
	}

	/**
	 * Enqueues the required scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'indexation' );
		$asset_manager->enqueue_style( 'admin-css' );

		$data = [
			'amount'  => $this->get_total_unindexed(),
			'ids'     => [
				'count'    => '#yoast-indexation-current-count',
				'progress' => '#yoast-indexation-progress-bar',
			],
			'restApi' => [
				'root'      => \esc_url_raw( \rest_url() ),
				'endpoints' => [
					'posts' => Indexable_Indexation_Route::FULL_POSTS_ROUTE,
				],
				'nonce'     => \wp_create_nonce( 'wp_rest' ),
			],
			'message' => [
				'indexingCompleted' => '<span class="wpseo-checkmark-ok-icon"></span>' . \esc_html__( 'Good job! All your site\'s content has been indexed.', 'wordpress-seo' ),
				'indexingFailed'    => __( 'Something went wrong indexing the content of your site. Please try again later.', 'wordpress-seo' ),
			],
			'l10n'    => [
				'calculationInProgress' => __( 'Calculation in progress...', 'wordpress-seo' ),
				'calculationCompleted'  => __( 'Calculation completed.', 'wordpress-seo' ),
				'calculationFailed'     => __( 'Calculation failed, please try again later.', 'wordpress-seo' ),
			],
		];

		\wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'indexation', 'yoastIndexationData', $data );
	}

	/**
	 * Renders the indexation list item.
	 *
	 * @return void
	 */
	public function render_indexation_warning() {
		echo new Indexation_Warning_Presenter();
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
	 * Returns the total number of unindexed objects.
	 *
	 * @return int
	 */
	protected function get_total_unindexed() {
		if ( \is_null( $this->total_unindexed ) ) {
			$this->total_unindexed = $this->post_indexation->get_total_unindexed();
		}

		return $this->total_unindexed;
	}
}
