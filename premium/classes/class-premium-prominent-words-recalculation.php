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
		<h2><?php esc_html_e( 'Site wide analysis', 'wordpress-seo-premium' ); ?></h2>
		<h3><?php esc_html_e( 'Prominent words', 'wordpress-seo-premium' ); ?></h3>

		<h4><?php esc_html_e( 'Statistics', 'wordpress-seo-premium' ); ?></h4>
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
		<?php
	}

	/**
	 * Counts posts that have prominent words.
	 *
	 * @return int The amount of posts.
	 */
	protected function count_posts_prominent_words() {
		$taxonomy = WPSEO_Premium_Prominent_Words_Registration::TERM_NAME;

		$total_posts = new WP_Query( array(
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
