<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Handles adding site wide analysis UI to the WordPress admin.
 */
class WPSEO_Premium_Prominent_Words_Recalculation implements WPSEO_WordPress_Integration {

	const MODAL_DIALOG_HEIGHT_BASE = 282;
	const PROGRESS_BAR_HEIGHT = 32;

	/** @var WPSEO_Premium_Prominent_Words_Unindexed_Post_Query */
	protected $post_query;

	/**
	 * Registers all hooks to WordPress
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
	 * Renders the html for the internal linking interface.
	 */
	public function add_internal_linking_interface() {
		$unindexed_posts = $this->count_unindexed_posts_by_type( 'post' );
		$unindexed_pages = $this->count_unindexed_posts_by_type( 'page' );

		echo '<h2>' . esc_html__( 'Internal linking', 'wordpress-seo-premium' ) . '</h2>';
		echo '<p>' . __( 'Want to use our internal linking tool? Analyze all the published posts and pages to generate internal linking suggestions.', 'wordpress-seo-premium' ) . '</p>';
		if ( $unindexed_posts === 0 && $unindexed_pages === 0 ) {
		?>

			<p><?php echo $this->messageAlreadyIndexed(); ?></p>
		<?php
		}
		else {
			$height = $this->get_modal_height( $unindexed_posts, $unindexed_pages );
		?>

			<p id="internalLinksCalculation">
				<a id="openInternalLinksCalculation" href="#TB_inline?width=600&height=<?php echo $height; ?>&inlineId=wpseo_recalculate_internal_links_wrapper" title='<?php echo __( 'Generating internal linking suggestions', 'wordpress-seo-premium' ); ?>' class="btn button yoast-js-calculate-prominent-words yoast-js-calculate-prominent-words--all thickbox"><?php esc_html_e( 'Analyze your content', 'wordpress-seo-premium' ); ?></a>
			</p>
		<?php
		}
		?>
		<br />
		<?php
	}

	/**
	 * Initialize the modal box to be displayed when needed.
	 */
	public function modal_box() {
		// Adding the thickbox.
		add_thickbox();

		$total_posts = $this->count_unindexed_posts_by_type( 'post' );
		$total_pages = $this->count_unindexed_posts_by_type( 'page' );

		$progressPosts = sprintf(
		/* translators: 1: expands to a <span> containing the number of items recalculated. 2: expands to a <strong> containing the total number of items. */
			__( 'Post %1$s of %2$s analyzed.', 'wordpress-seo-premium' ),
			'<span id="wpseo_count_posts" class="wpseo-prominent-words-progress-current">0</span>',
			'<strong id="wpseo_count_posts_total" class="wpseo-prominent-words-progress-total">' . $total_posts . '</strong>'
		);

		$progressPages = sprintf(
		/* translators: 1: expands to a <span> containing the number of items recalculated. 2: expands to a <strong> containing the total number of items. */
			__( 'Page %1$s of %2$s analyzed.', 'wordpress-seo-premium' ),
			'<span id="wpseo_count_pages" class="wpseo-prominent-words-progress-current">0</span>',
			'<strong id="wpseo_count_pages_total" class="wpseo-prominent-words-progress-total">' . $total_pages . '</strong>'
		);

		?>
		<div id="wpseo_recalculate_internal_links_wrapper" class="hidden">
			<div id="wpseo_recalculate_internal_links">
				<p><?php esc_html_e( 'Generating suggestions for posts...', 'wordpress-seo-premium' ); ?></p>
				<?php if ( $total_posts > 0 ) : ?>
				<div id="wpseo_internal_links_posts_progressbar" class="wpseo-progressbar"></div>
				<p><?php echo $progressPosts; ?></p>
				<?php else : ?>
				<p><?php _e( 'All your posts are already indexed, there is no need to do the recalculation for them.', 'wordpress-seo-premium' ); ?></p>
				<?php endif; ?>
			</div>
			<hr />
			<div id="wpseo_recalculate_internal_links">
				<p><?php esc_html_e( 'Generating suggestions for pages...', 'wordpress-seo-premium' ); ?></p>
				<?php if ( $total_pages > 0 ) : ?>
				<div id="wpseo_internal_links_pages_progressbar" class="wpseo-progressbar"></div>
				<p><?php echo $progressPages; ?></p>
				<?php else : ?>
				<p><?php _e( 'All your pages are already indexed, there is no need to do the recalculation for them.', 'wordpress-seo-premium' ); ?></p>
				<?php endif; ?>
			</div>
			<button onclick="tb_remove();" type="button" class="button"><?php _e( 'Stop analyzing', 'wordpress-seo-premium' ); ?></button>
		</div>

		<?php
	}

	/**
	 * Enqueues site wide analysis script
	 */
	public function enqueue() {
		$page = filter_input( INPUT_GET, 'page' );

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$version = $asset_manager->flatten_version( WPSEO_VERSION );

		wp_register_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/dist/yoast-premium-site-wide-analysis-' . $version . WPSEO_CSSJS_SUFFIX . '.js', array(), WPSEO_VERSION, true );

		if ( $page === 'wpseo_dashboard' ) {
			$data = array(
				'allWords' => get_terms( WPSEO_Premium_Prominent_Words_Registration::TERM_NAME, array( 'fields' => 'ids' ) ),
				'amount' => array(
					'total' => $this->count_unindexed_posts_by_type( 'post' ),
				),
				'amountPages' => array(
					'total' => $this->count_unindexed_posts_by_type( 'page' ),
				),
				'restApi' => array(
					'root' => esc_url_raw( rest_url() ),
					'nonce' => wp_create_nonce( 'wp_rest' ),
				),
				'message' => array(
					'analysisCompleted' => $this->messageAlreadyIndexed(),
				),
				'l10n' => array(
					'calculationInProgress' => __( 'Calculation in progress...', 'wordpress-seo-premium' ),
					'calculationCompleted'  => __( 'Calculation completed.', 'wordpress-seo-premium' ),
				),
			);

			wp_enqueue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis' );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis', 'yoastSiteWideAnalysisData', array( 'data' => $data ) );
		}
	}

	/**
	 * Counts posts that have no prominent words.
	 *
	 * @param string $post_type The post type to count.
	 *
	 * @return int The amount of posts.
	 */
	protected function count_unindexed_posts_by_type( $post_type ) {
		if ( ! $this->post_query ) {
			$this->post_query = new WPSEO_Premium_Prominent_Words_Unindexed_Post_Query();
		}

		return $this->post_query->get_total( $post_type );
	}

	/**
	 * Calculates the total height of the modal.
	 *
	 * @param int $total_posts The total amount of posts.
	 * @param int $total_pages The total amount of pages.
	 *
	 * @return int The calculated height.
	 */
	protected function get_modal_height( $total_posts, $total_pages ) {
		if ( $total_posts > 0 && $total_pages > 0 ) {
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
