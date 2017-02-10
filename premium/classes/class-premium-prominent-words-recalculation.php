<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Handles adding site wide analysis UI to the WordPress admin.
 */
class WPSEO_Premium_Prominent_Words_Recalculation implements WPSEO_WordPress_Integration {

	const MODAL_DIALOG_HEIGHT_BASE = 250;
	const PROGRESS_BAR_HEIGHT = 32;

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {
		add_action( 'wpseo_internal_linking', array( $this, 'add_internal_linking_interface' ) );

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'admin_footer', array( $this, 'modal_box' ), 20 );
	}

	/**
	 * Renders the html for the internal linking interface.
	 */
	public function add_internal_linking_interface() {

		$height = self::MODAL_DIALOG_HEIGHT_BASE;

		$unindexed_posts = $this->count_unindexed_posts_by_type( 'post' );
		$unindexed_pages = $this->count_unindexed_posts_by_type( 'page' );

		if ( $unindexed_posts > 0 ) {
			$height += self::PROGRESS_BAR_HEIGHT;
		}

		if ( $unindexed_pages > 0 ) {
			$height += self::PROGRESS_BAR_HEIGHT;
		}

		echo '<h2>' . esc_html__( 'Prominent words', 'wordpress-seo-premium' ) . '</h2>';

		if ( $unindexed_posts === 0 && $unindexed_pages === 0 ) {
		?>
			<p><?php _e( 'All your posts and pages are analyzed at this moment, there is no need to analyze them.', 'wordpress-seo-premium' ); ?></p>
			<p>
				<button disabled='true' class="btn button"><?php esc_html_e( 'Analyze your content', 'wordpress-seo-premium' ); ?></button>
			</p>
		<?php
		}
		else {
		?>
			<p><?php _e( 'Analyze all the published posts and pages for prominent words. Prominent words are needed to provide link suggestions.', 'wordpress-seo-premium' ); ?></p>
			<p>
				<a id="openInternalLinksCalculation" href="#TB_inline?width=600&height=<?php echo $height; ?>&inlineId=wpseo_recalculate_internal_links_wrapper" title='<?php echo __( 'Analyzing post and pages for prominent words', 'wordpress-seo-premium' ); ?>' class="btn button yoast-js-calculate-prominent-words yoast-js-calculate-prominent-words--all thickbox"><?php esc_html_e( 'Analyze your content', 'wordpress-seo-premium' ); ?></a>
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
			__( 'Prominent words analyzed for posts %1$s of %2$s.', 'wordpress-seo-premium' ),
			'<span id="wpseo_count_posts" class="wpseo-prominent-words-progress-current">0</span>',
			'<strong id="wpseo_count_posts_total" class="wpseo-prominent-words-progress-total">' . $total_posts . '</strong>'
		);

		$progressPages = sprintf(
		/* translators: 1: expands to a <span> containing the number of items recalculated. 2: expands to a <strong> containing the total number of items. */
			__( 'Prominent words analyzed for pages %1$s of %2$s.', 'wordpress-seo-premium' ),
			'<span id="wpseo_count_pages" class="wpseo-prominent-words-progress-current">0</span>',
			'<strong id="wpseo_count_pages_total" class="wpseo-prominent-words-progress-total">' . $total_pages . '</strong>'
		);

		?>
		<div id="wpseo_recalculate_internal_links_wrapper" class="hidden">
			<div id="wpseo_recalculate_internal_links">
				<p><?php esc_html_e( 'Analyzing posts for prominent words...', 'wordpress-seo-premium' ); ?></p>
				<?php if ( $total_posts > 0 ) : ?>
				<div id="wpseo_internal_links_posts_progressbar" class="wpseo-progressbar"></div>
				<p><?php echo $progressPosts; ?></p>
				<?php else : ?>
				<p><?php _e( 'All your posts are already indexed, there is no need to do the recalculation for them.', 'wordpress-seo-premium' ); ?></p>
				<?php endif; ?>
			</div>
			<hr />
			<div id="wpseo_recalculate_internal_links">
				<p><?php esc_html_e( 'Analyzing pages for prominent words...', 'wordpress-seo-premium' ); ?></p>
				<?php if ( $total_pages > 0 ) : ?>
				<div id="wpseo_internal_links_pages_progressbar" class="wpseo-progressbar"></div>
				<p><?php echo $progressPages; ?></p>
				<?php else : ?>
				<p><?php _e( 'All your pages are already indexed, there is no need to do the recalculation for them.', 'wordpress-seo-premium' ); ?></p>
				<?php endif; ?>
			</div>
			<button onclick="tb_remove();" type="button" class="button"><?php _e( 'Stop Analyzing', 'wordpress-seo-premium' ); ?></button>
		</div>

		<?php
	}

	/**
	 * Enqueues site wide analysis script
	 */
	public function enqueue() {
		$page = filter_input( INPUT_GET, 'page' );

		wp_register_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/dist/yoast-premium-site-wide-analysis-420' . WPSEO_CSSJS_SUFFIX . '.js', array(), WPSEO_VERSION, true );

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
	 * Counts posts that have prominent words.
	 *
	 * @param string $post_type The post type to count.
	 * @return int The amount of posts.
	 */
	protected function count_all_posts_by_type( $post_type ) {
		$total_posts = new WP_Query( array(
			'post_type' => $post_type,
			'post_status' => array( 'future', 'draft', 'pending', 'private', 'publish' ),
		) );

		return (int) $total_posts->found_posts;
	}

	/**
	 * Counts posts that have no prominent words.
	 *
	 * @param string $post_type The post type to count.
	 * @return int The amount of posts.
	 */
	protected function count_unindexed_posts_by_type( $post_type ) {
		$total_posts = new WP_Query( array(
			'post_type' => $post_type,
			'post_status' => array( 'future', 'draft', 'pending', 'private', 'publish' ),
			'meta_query' => array(
				'relation' => 'OR',
				array(
					'key'     => WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME,
					'value'   => WPSEO_Premium_Prominent_Words_Versioning::VERSION_NUMBER,
					'compare' => '!=',
				),
				array(
					'key'     => WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME,
					'compare' => 'NOT EXISTS',
				),
			),
		) );

		return (int) $total_posts->found_posts;
	}
}
