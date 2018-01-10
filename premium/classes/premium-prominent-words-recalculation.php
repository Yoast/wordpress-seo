<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Handles adding site wide analysis UI to the WordPress admin.
 */
class WPSEO_Premium_Prominent_Words_Recalculation implements WPSEO_WordPress_Integration {

	/** @var int */
	const MODAL_DIALOG_HEIGHT_BASE = 282;

	/** @var int */
	const PROGRESS_BAR_HEIGHT = 32;

	/** @var WPSEO_Premium_Prominent_Words_Unindexed_Post_Query */
	protected $post_query;

	/**
	 * @var WPSEO_Premium_Prominent_Words_Support
	 */
	private $prominent_words_support;

	/**
	 * WPSEO_Premium_Prominent_Words_Recalculation constructor.
	 *
	 * @param WPSEO_Premium_Prominent_Words_Unindexed_Post_Query $post_query The post query class to retrieve the unindexed posts with.
	 * @param WPSEO_Premium_Prominent_Words_Support              $prominent_words_support The prominent words support class to determine supported posts types to index.
	 */
	public function __construct( WPSEO_Premium_Prominent_Words_Unindexed_Post_Query $post_query, WPSEO_Premium_Prominent_Words_Support $prominent_words_support ) {
		$this->post_query               = $post_query;
		$this->prominent_words_support  = $prominent_words_support;
	}

	/**
	 * Registers all hooks to WordPress
	 *
	 * @return void
	 */
	public function register_hooks() {
		// When the language isn't supported, stop adding hooks.
		$language_support = new WPSEO_Premium_Prominent_Words_Language_Support();
		if ( ! $language_support->is_language_supported( WPSEO_Utils::get_language( get_locale() ) ) ) {
			return;
		}

		add_action( 'wpseo_internal_linking', array( $this, 'add_internal_linking_interface' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );

		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_dashboard' ) {
			add_action( 'admin_footer', array( $this, 'modal_box' ), 20 );
		}
	}

	/**
	 * Renders the HTML for the internal linking interface.
	 *
	 * @return void
	 */
	public function add_internal_linking_interface() {
		$total_items = $this->post_query->get_totals( $this->prominent_words_support->get_supported_post_types() );

		echo '<h2>' . esc_html__( 'Internal linking', 'wordpress-seo-premium' ) . '</h2>';
		echo '<p>' . esc_html__( 'Want to use our internal linking tool? Analyze all the published posts and pages to generate internal linking suggestions.', 'wordpress-seo-premium' ) . '</p>';

		if ( count( $total_items ) === 0 ) {
			printf( '<p>%s</p>', $this->messageAlreadyIndexed() );

			return;
		}

		$height = $this->get_modal_height( count( $total_items ) );

		echo $this->generate_internal_link_calculation_interface( $height );
	}

	/**
	 * Generates the HTML interface for the recalculation.
	 *
	 * @param int $height The height to apply to the recalculation interface.
	 *
	 * @return string The HTML representation of the interface.
	 */
	protected function generate_internal_link_calculation_interface( $height ) {
		return sprintf(
			'<p id="internalLinksCalculation"><a id="openInternalLinksCalculation" href="%s" title="%s" class="%s">%s</a></p><br />',
			esc_url( '#TB_inline?width=600&height=' . $height . '&inlineId=wpseo_recalculate_internal_links_wrapper' ),
			esc_attr__( 'Generating internal linking suggestions', 'wordpress-seo-premium' ),
			'btn button yoast-js-calculate-prominent-words yoast-js-calculate-prominent-words--all thickbox',
			esc_html__( 'Analyze your content', 'wordpress-seo-premium' )
		);
	}

	/**
	 * Initialize the modal box to be displayed when needed.
	 *
	 * @return void
	 */
	public function modal_box() {
		// Adding the thickbox.
		add_thickbox();

		$supported_post_types = $this->prominent_words_support->get_supported_post_types();
		$total_items          = $this->post_query->get_totals( $supported_post_types );

		$progress = sprintf(
		/* translators: 1: expands to a <span> containing the number of items recalculated. 2: expands to a <strong> containing the total number of items. */
			esc_html__( 'Item %1$s of %2$s analyzed.', 'wordpress-seo-premium' ),
			'<span id="wpseo_count_items" class="wpseo-prominent-words-progress-current">0</span>',
			'<strong id="wpseo_count_items_total" class="wpseo-prominent-words-progress-total">' . array_sum( $total_items ) . '</strong>'
		);

		?>
		<div id="wpseo_recalculate_internal_links_wrapper" class="hidden">
			<div id="wpseo_recalculate_internal_links">
				<p><?php esc_html_e( 'Generating suggestions for everything...', 'wordpress-seo-premium' ); ?></p>
				<?php if ( $total_items > 0 ) : ?>
					<div id="wpseo_internal_links_unindexed_progressbar" class="wpseo-progressbar"></div>
					<p><?php echo $progress; ?></p>
				<?php else : ?>
					<p><?php esc_html_e( 'Everything is already indexed, there is no need to do the recalculation for them.', 'wordpress-seo-premium' ); ?></p>
				<?php endif; ?>
			</div>

			<button onclick="tb_remove();" type="button" class="button"><?php esc_html_e( 'Stop analyzing', 'wordpress-seo-premium' ); ?></button>
		</div>

		<?php
	}

	/**
	 * Enqueues site wide analysis script.
	 *
	 * @return void
	 */
	public function enqueue() {
		$page = filter_input( INPUT_GET, 'page' );

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$version       = $asset_manager->flatten_version( WPSEO_VERSION );

		wp_register_script(
			WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis',
			plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/dist/yoast-premium-site-wide-analysis-' . $version . WPSEO_CSSJS_SUFFIX . '.js',
			array( WPSEO_Admin_Asset_Manager::PREFIX . 'react-dependencies' ),
			WPSEO_VERSION,
			true
		);

		if ( $page === 'wpseo_dashboard' ) {
			$this->enqueue_dashboard_assets();
		}
	}

	/**
	 * Enqueues the dashboard assests.
	 *
	 * @return void
	 */
	protected function enqueue_dashboard_assets() {
		$all_items = $this->post_query->get_totals( $this->prominent_words_support->get_supported_post_types() );

		$data = array(
			'allWords' => get_terms( WPSEO_Premium_Prominent_Words_Registration::TERM_NAME, array( 'fields' => 'ids' ) ),
			'allItems' => $all_items,
			'totalItems' => array_sum( $all_items ),
			'restApi' => array(
				'root' => esc_url_raw( rest_url() ),
				'nonce' => wp_create_nonce( 'wp_rest' ),
			),
			'message' => array( 'analysisCompleted' => $this->messageAlreadyIndexed() ),
			'l10n' => array(
				'calculationInProgress' => __( 'Calculation in progress...', 'wordpress-seo-premium' ),
				'calculationCompleted' => __( 'Calculation completed.', 'wordpress-seo-premium' ),
				'contentLocale' => get_locale(),
			),
		);

		wp_enqueue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis' );
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis', 'yoastSiteWideAnalysisData', array( 'data' => $data ) );
	}

	/**
	 * Counts posts that have no prominent words.
	 *
	 * @param string $post_type The post type to count.
	 *
	 * @return int The amount of posts.
	 */
	protected function count_unindexed_posts_by_type( $post_type ) {
		return $this->post_query->get_total( $post_type );
	}

	/**
	 * Calculates the total height of the modal.
	 *
	 * @param int $total_items The total amount of items.
	 *
	 * @return int The calculated height.
	 */
	protected function get_modal_height( $total_items ) {
		if ( $total_items > 0 ) {
			return ( self::MODAL_DIALOG_HEIGHT_BASE + self::PROGRESS_BAR_HEIGHT );
		}

		return self::MODAL_DIALOG_HEIGHT_BASE;
	}

	/**
	 * Returns the already indexed message.
	 *
	 * @return string The message to return when it is already indexed.
	 */
	private function messageAlreadyIndexed() {
		return '<span class="wpseo-checkmark-ok-icon"></span>' . esc_html__( 'Good job! You\'ve optimized your internal linking suggestions.', 'wordpress-seo-premium' );
	}
}
