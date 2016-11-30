<?php

/**
 * Handles adding site wide analysis UI to the WordPress admin.
 */
class WPSEO_Premium_Prominent_Words_Recalculation implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {
		add_action( 'wpseo_settings_tabs_dashboard', array(
			$this,
			'add_tab',
		) );
		add_action( 'wpseo_settings_tab_site_analysis', array(
			$this,
			'display_tab',
		) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
	}

	/**
	 * Adds a tab to the dashboard.
	 *
	 * @param WPSEO_Option_Tabs $tabs The tabs object.
	 */
	public function add_tab( $tabs ) {
		$tabs->add_tab( new WPSEO_Option_Tab( 'site-analysis', 'Site wide analysis' ) );
	}

	/**
	 * Display the site wide analysis tab.
	 */
	public function display_tab() {
		?>
		<section class="yoast-js-site-wide-prominent-words">
			<h2><?php esc_html_e( 'Site wide analysis', 'wordpress-seo-premium' ); ?></h2>
			<h3><?php esc_html_e( 'Prominent words', 'wordpress-seo-premium' ); ?></h3>
			<?php
			$has_prominent_words = $this->count_posts_prominent_words();
			$has_no_prominent_words = $this->count_posts_without_prominent_words();
			$total = ( $has_no_prominent_words + $has_prominent_words );
			?>
			<ul>
				<li>
					<?php
						echo esc_html(
							sprintf(
								_n( '%d total post', '%d total posts', $total, 'wordpress-seo-premium' ),
								$total
							)
						);
					?>
				</li>
				<li>
					<?php
					echo esc_html(
						sprintf(
							_n( '%d post with prominent words', '%d posts with prominent words', $has_prominent_words, 'wordpress-seo-premium' ),
							$has_prominent_words
						)
					);
					?>
				</li>
				<li>
					<?php
					echo esc_html(
						sprintf(
							_n( '%d post without prominent words', '%d posts without prominent words', $has_no_prominent_words, 'wordpress-seo-premium' ),
							$has_no_prominent_words
						)
					); ?>
				</li>
			</ul>
			<div class="yoast-js-prominent-words-progress">
				<?php
					esc_html_e( 'Currently calculating prominent words.', 'wordpress-seo-premium' );
					echo ' ';
					echo sprintf(
						esc_html( _n( 'Calculated %1$s out of %2$s post', 'Calculated %1$s out of %2$s posts', $total, 'wordpress-seo-premium' ) ),
						"<span class='yoast-js-prominent-words-progress-current'>0</span>",
						$total
					);
				?>
			</div>
			<div class="yoast-js-prominent-words-completed">
				<?php echo esc_html(
					sprintf(
						_n( 'Calculated prominent words for %1$s post', 'Calculated prominent words for %1$s posts', $total, 'wordpress-seo-premium' ),
						$total
					)
				); ?>
			</div>
			<button type="button" class="button yoast-js-calculate-prominent-words yoast-js-calculate-prominent-words--all"><?php esc_html_e( 'Calculate prominent words for all posts', 'wordpress-seo-premium' ); ?></button>
		</section>
		<?php
	}

	/**
	 * Enqueues site wide analysis script
	 */
	public function enqueue() {
		$page = filter_input( INPUT_GET, 'page' );

		wp_register_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/dist/yoast-premium-site-wide-analysis-400' . WPSEO_CSSJS_SUFFIX . '.js', array(), WPSEO_VERSION, true );

		$has_prominent_words = $this->count_posts_prominent_words();
		$has_no_prominent_words = $this->count_posts_without_prominent_words();
		$total = ( $has_no_prominent_words + $has_prominent_words );

		if ( $page === 'wpseo_dashboard' ) {
			$data = array(
				'allWords' => get_terms( WPSEO_Premium_Prominent_Words_Registration::TERM_NAME, array( 'fields' => 'ids' ) ),
				'amount' => array(
					'total' => $total,
					'hasProminentWords' => $has_prominent_words,
					'hasNoProminentWords' => $has_no_prominent_words,
				),

				'restApi' => array(
					'root' => esc_url_raw( rest_url() ),
					'nonce' => wp_create_nonce( 'wp_rest' ),
				),
			);

			wp_enqueue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis' );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis', 'yoastSiteWideAnalysisData', array( 'data' => $data ) );
		}
	}

	/**
	 * Counts posts that have prominent words.
	 *
	 * @return int The amount of posts.
	 */
	protected function count_posts_prominent_words() {
		$taxonomy = WPSEO_Premium_Prominent_Words_Registration::TERM_NAME;

		$total_posts = new WP_Query( array(
			'post_type' => 'post',
			'tax_query' => array(
				array(
					'taxonomy' => $taxonomy,
					'terms' => get_terms( $taxonomy, array( 'fields' => 'ids' ) ),
					'operator' => 'IN',
				),
			),
		) );

		return (int) $total_posts->found_posts;
	}

	/**
	 * Counts posts that have no prominent words.
	 *
	 * @return int The amount of posts.
	 */
	protected function count_posts_without_prominent_words() {
		$taxonomy = WPSEO_Premium_Prominent_Words_Registration::TERM_NAME;

		$total_posts = new WP_Query( array(
			'post_type' => 'post',
			'tax_query' => array(
				array(
					'taxonomy' => $taxonomy,
					'terms' => get_terms( $taxonomy, array( 'fields' => 'ids' ) ),
					'operator' => 'NOT IN',
				),
			),
		) );

		return (int) $total_posts->found_posts;
	}
}
