<?php
/**
 * @package WPSEO\Premium
 */

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
		$language_support = new WPSEO_Premium_Prominent_Words_Language_Support();
		if ( WPSEO_Utils::are_content_endpoints_available() && $language_support->is_language_supported( WPSEO_Utils::get_language( get_locale() ) ) ) {
			$tabs->add_tab( new WPSEO_Option_Tab( 'site-analysis', __( 'Site wide analysis', 'wordpress-seo-premium' ) ) );
		}
	}

	/**
	 * Display the site wide analysis tab.
	 */
	public function display_tab() {
		?>
		<section class="yoast-js-site-wide-prominent-words">
			<h2><?php esc_html_e( 'Site wide analysis', 'wordpress-seo-premium' ); ?></h2>
			<p>
				<?php
				printf(
					/* translators: %1$s expands to a link start tag to the Yoast.com website, %2$s is the link closing tag. */
					__( 'The Site wide analysis can help you get the most out of %1$sthe internal linking tool%2$s and calculate the most prominent words for your site.', 'wordpress-seo-premium' ),
					'<a href="https://yoa.st/oj" target="_blank">',
					'</a>'
				);
				?>
			</p>
			<h3><?php esc_html_e( 'Prominent words summary', 'wordpress-seo-premium' ); ?></h3>
			<?php
			$total_posts_with_prominent_words = $this->count_posts_prominent_words( 'post' );
			$total_posts_without_prominent_words = $this->count_posts_without_prominent_words( 'post' );
			$total = ( $total_posts_without_prominent_words + $total_posts_with_prominent_words );

			$total_pages_with_prominent_words = $this->count_posts_prominent_words( 'page' );
			$total_pages_without_prominent_words = $this->count_posts_without_prominent_words( 'page' );
			$total_pages = ( $total_pages_without_prominent_words + $total_pages_with_prominent_words );
			?>
			<ul class="ul-disc">
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
							_n( '%d post with prominent words', '%d posts with prominent words', $total_posts_with_prominent_words, 'wordpress-seo-premium' ),
							$total_posts_with_prominent_words
						)
					);
					?>
				</li>
				<li>
					<?php
					echo esc_html(
						sprintf(
							_n( '%d post without prominent words', '%d posts without prominent words', $total_posts_without_prominent_words, 'wordpress-seo-premium' ),
							$total_posts_without_prominent_words
						)
					); ?>
				</li>
				<li>
					<?php
					echo esc_html(
						sprintf(
							_n( '%d total page', '%d total pages', $total_pages, 'wordpress-seo-premium' ),
							$total_pages
						)
					);
					?>
				</li>
				<li>
					<?php
					echo esc_html(
						sprintf(
							_n( '%d page with prominent words', '%d pages with prominent words', $total_pages_with_prominent_words, 'wordpress-seo-premium' ),
							$total_pages_with_prominent_words
						)
					);
					?>
				</li>
				<li>
					<?php
					echo esc_html(
						sprintf(
							_n( '%d page without prominent words', '%d pages without prominent words', $total_pages_without_prominent_words, 'wordpress-seo-premium' ),
							$total_pages_without_prominent_words
						)
					); ?>
				</li>
			</ul>
			<p>
				<?php
					esc_html_e( 'Run the analysis now to calculate the prominent words of all your posts and pages. The initial indexation may take a while, depending on the size of your site.', 'wordpress-seo-premium' );
				?>
			</p>
			<div class="yoast-js-prominent-words-info notice notice-info inline">
				<p>
				<?php
					esc_html_e( 'Once started, the calculation will be incomplete if you navigate away from this page.', 'wordpress-seo-premium' );
				?>
				</p>
			</div>
			<div class="yoast-js-prominent-words-progress notice notice-info inline">
				<p>
				<?php
					esc_html_e( 'Calculation in progress...', 'wordpress-seo-premium' );
					echo '<br />';
					echo sprintf(
						esc_html( _n( 'Analyzed %1$s out of %2$s post.', 'Analyzed %1$s out of %2$s posts.', $total, 'wordpress-seo-premium' ) ),
						"<span class='yoast-js-prominent-words-progress-current'>0</span>",
						$total
					);
					echo '<br />';
					echo sprintf(
						esc_html( _n( 'Analyzed %1$s out of %2$s page.', 'Analyzed %1$s out of %2$s pages.', $total_pages, 'wordpress-seo-premium' ) ),
						"<span class='yoast-js-prominent-words-pages-progress-current'>0</span>",
						$total_pages
					);
				?>
				</p>
			</div>
			<div class="yoast-js-prominent-words-completed notice notice-success inline">
				<p>
				<?php echo esc_html(
					sprintf(
						_n( 'Calculated prominent words for %1$s post.', 'Calculated prominent words for %1$s posts.', $total, 'wordpress-seo-premium' ),
						$total
					)
				); ?>
				<br />
				<?php echo esc_html(
					sprintf(
						_n( 'Calculated prominent words for %1$s page.', 'Calculated prominent words for %1$s pages.', $total_pages, 'wordpress-seo-premium' ),
						$total_pages
					)
				); ?>
				</p>
			</div>
			<button type="button" class="button yoast-js-calculate-prominent-words yoast-js-calculate-prominent-words--all"><?php esc_html_e( 'Calculate prominent words', 'wordpress-seo-premium' ); ?></button>
		</section>
		<?php
	}

	/**
	 * Enqueues site wide analysis script
	 */
	public function enqueue() {
		$page = filter_input( INPUT_GET, 'page' );

		wp_register_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-site-wide-analysis', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/dist/yoast-premium-site-wide-analysis-420' . WPSEO_CSSJS_SUFFIX . '.js', array(), WPSEO_VERSION, true );

		$has_prominent_words = $this->count_posts_prominent_words( 'post' );
		$has_no_prominent_words = $this->count_posts_without_prominent_words( 'post' );
		$total = ( $has_no_prominent_words + $has_prominent_words );

		$total_pages_with_prominent_words = $this->count_posts_prominent_words( 'page' );
		$total_pages_without_prominent_words = $this->count_posts_without_prominent_words( 'page' );
		$total_pages = ( $total_pages_without_prominent_words + $total_pages_with_prominent_words );

		if ( $page === 'wpseo_dashboard' ) {
			$data = array(
				'allWords' => get_terms( WPSEO_Premium_Prominent_Words_Registration::TERM_NAME, array( 'fields' => 'ids' ) ),
				'amount' => array(
					'total' => $total,
					'hasProminentWords' => $has_prominent_words,
					'hasNoProminentWords' => $has_no_prominent_words,
				),
				'amountPages' => array(
					'total' => $total_pages,
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
	protected function count_posts_prominent_words( $post_type ) {
		$taxonomy = WPSEO_Premium_Prominent_Words_Registration::TERM_NAME;

		$total_posts = new WP_Query( array(
			'post_type' => $post_type,
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
	 * @param string $post_type The post type to count.
	 * @return int The amount of posts.
	 */
	protected function count_posts_without_prominent_words( $post_type ) {
		$taxonomy = WPSEO_Premium_Prominent_Words_Registration::TERM_NAME;

		$total_posts = new WP_Query( array(
			'post_type' => $post_type,
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
