<?php

class WPSEO_Link_Reindex_Interface {

	const MODAL_DIALOG_HEIGHT_BASE = 282;
	const PROGRESS_BAR_HEIGHT = 32;

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {
		add_action( 'wpseo_internal_linking', array( $this, 'add_link_index_interface' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'admin_footer', array( $this, 'modal_box' ), 20 );
	}

	/**
	 * Add the indexing interface for links to the dashboard.
	 */
	public function add_link_index_interface() {
		$html = '';

		$html .= '<h2>' . esc_html__( 'Content link detector', 'wordpress-seo' ) . '</h2>';
		$html .= '<p>' . __( 'Do you want to detect links in the content. Use the indexing button.', 'wordpress-seo' ) . '</p>';

		$total_posts = $this->count_unindexed_posts_by_type( 'post' );
		$total_pages = $this->count_unindexed_posts_by_type( 'page' );

		if ( $total_posts === 0 && $total_pages === 0 ) {
			$html .= '<p>' . $this->messageAlreadyIndexed() . '</p>';
		}
		else {
			$height = $this->get_modal_height( $total_posts, $total_pages );
			$html .= '<p id="reindexLinks">';
			$html .= sprintf(
				'<a id="openInternalLinksCalculation" href="#TB_inline?width=600&height=%1$s&inlineId=wpseo_index_links_wrapper" title="%2$s" class="btn button yoast-js-index-links yoast-js-calculate-index-links--all thickbox">%3$s</a>',
				$height,
				esc_attr( __( 'Detecting links in your content', 'wordpress-seo' ) ),
				esc_html( __( 'Detect links in your content', 'wordpress-seo' ) )
			);
			$html .= '</p>';
		}

		$html .= '<br />';

		echo $html;
	}

	/**
	 * Generates the model box.
	 */
	public function modal_box() {
		if ( ! $this->is_dashboard_page() ) {
			return;
		}

		// Adding the thickbox.
		add_thickbox();

		$total_posts = $this->count_unindexed_posts_by_type( 'post' );
		$total_pages = $this->count_unindexed_posts_by_type( 'page' );

		$progressPosts = sprintf(
		/* translators: 1: expands to a <span> containing the number of items recalculated. 2: expands to a <strong> containing the total number of items. */
			__( 'Post %1$s of %2$s analyzed.', 'wordpress-seo' ),
			'<span id="wpseo_count_index_links_post">0</span>',
			'<strong id="wpseo_count_post_total">' . $total_posts . '</strong>'
		);

		$progressPages = sprintf(
		/* translators: 1: expands to a <span> containing the number of items recalculated. 2: expands to a <strong> containing the total number of items. */
			__( 'Page %1$s of %2$s analyzed.', 'wordpress-seo' ),
			'<span id="wpseo_count_index_links_page">0</span>',
			'<strong id="wpseo_count_page_total">' . $total_pages . '</strong>'
		);

		?>
		<div id="wpseo_index_links_wrapper" class="hidden">
			<div>
				<p><?php esc_html_e( 'Detecting links for posts...', 'wordpress-seo' ); ?></p>
				<?php if ( $total_posts > 0 ) : ?>
					<div id="wpseo_index_links_post_progressbar" class="wpseo-progressbar"></div>
					<p><?php echo $progressPosts; ?></p>
				<?php else : ?>
					<p><?php _e( 'All your posts are already indexed, there is no need to do the reindexation for them.', 'wordpress-seo' ); ?></p>
				<?php endif; ?>
			</div>
			<hr />
			<div>
				<p><?php esc_html_e( 'Detecting links for pages...', 'wordpress-seo' ); ?></p>
				<?php if ( $total_pages > 0 ) : ?>
					<div id="wpseo_index_links_page_progressbar" class="wpseo-progressbar"></div>
					<p><?php echo $progressPages; ?></p>
				<?php else : ?>
					<p><?php _e( 'All your pages are already indexed, there is no need to do the reindexation for them.', 'wordpress-seo' ); ?></p>
				<?php endif; ?>
			</div>
			<button onclick="tb_remove();" type="button" class="button"><?php _e( 'Stop analyzing', 'wordpress-seo' ); ?></button>
		</div>

		<?php
	}

	/**
	 * Enqueues site wide analysis script
	 */
	public function enqueue() {
		if ( ! $this->is_dashboard_page() ) {
			return;
		}

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'reindex-links' );

		$data = array(
			'amount' => array(
				'post' => $total_posts = $this->count_unindexed_posts_by_type( 'post' ),
				'page' => $total_pages = $this->count_unindexed_posts_by_type( 'page' ),
			),
			'restApi' => array(
				'root' => esc_url_raw( rest_url() ),
				'endpoint' => WPSEO_Link_Reindex_Post_Endpoint::REST_NAMESPACE . '/' . WPSEO_Link_Reindex_Post_Endpoint::ENDPOINT_QUERY,
				'nonce' => wp_create_nonce( 'wp_rest' ),
			),
			'message' => array(
				'indexingCompleted' => $this->messageAlreadyIndexed(),
			),
			'l10n' => array(
				'calculationInProgress' => __( 'Calculation in progress...', 'wordpress-seo' ),
				'calculationCompleted'  => __( 'Calculation completed.', 'wordpress-seo' ),
			),
		);

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'reindex-links', 'yoastReindexLinksData', array( 'data' => $data ) );
	}


	/**
	 * Checks if the current page is the dashboard page.
	 *
	 * @return bool True when current page is the dashboard page.
	 */
	protected function is_dashboard_page() {
		return ( filter_input( INPUT_GET, 'page' ) === 'wpseo_dashboard' );
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
	 * When everything has been indexed already.
	 *
	 * @return string
	 */
	protected function messageAlreadyIndexed() {
		return '<span class="wpseo-checkmark-ok-icon"></span>' . esc_html__( 'Good job! You\'ve optimized your internal linking suggestions.', 'wordpress-seo' );
	}

	/**
	 * @param $post_type
	 *
	 * @return null|string
	 */
	protected function count_unindexed_posts_by_type( $post_type ) {
		return WPSEO_Link_Reindex_Post_Query::get_total_unindexed_by_post_type( $post_type );
	}
}
