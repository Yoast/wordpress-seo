<?php
/**
 * View for the banner sidebar.
 *
 * @package WPSEO\Admin\Views
 */

$wpseo_plugin_dir_url = plugin_dir_url( WPSEO_FILE );

?>
<div class="wpseo_content_cell" id="sidebar-container">
	<div id="sidebar">
		<div class="wpseo_content_cell_title yoast-sidebar__title">
			<?php
			/* translators: %1$s expands to Yoast */
			printf( esc_html__( '%1$s recommendations for you', 'wordpress-seo' ), 'Yoast' );
			?>
		</div>
		<div class="yoast-sidebar_section">
			<h2>
				<?php
				/* translators: %1$s expands to the plugin name */
				printf( esc_html__( 'Upgrade to %1$s', 'wordpress-seo' ), 'Yoast SEO Premium' );
				?>
			</h2>
			<ul>
				<li><strong><?php esc_html_e( 'Rank better with synonyms & related keyphrases', 'wordpress-seo' ); ?></strong></li>
				<li><strong><?php esc_html_e( 'Preview your page in Facebook and Twitter', 'wordpress-seo' ); ?></strong></li>
				<li><strong><?php esc_html_e( 'Get real-time suggestions for internal links', 'wordpress-seo' ); ?></strong></li>
				<li><strong><?php esc_html_e( 'No more dead links a.k.a. 404 pages', 'wordpress-seo' ); ?></strong></li>
				<li><strong><?php esc_html_e( '24/7 email support', 'wordpress-seo' ); ?></strong></li>
				<li><strong><?php esc_html_e( 'No ads', 'wordpress-seo' ); ?></strong></li>
			</ul>

			<a id="wpseo-premium-button" class="yoast-button-upsell" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jj' ); ?>" target="_blank">
				<?php
				/* translators: %s is replaced by the plugin name */
				printf( esc_html__( 'Get %s', 'wordpress-seo' ), 'Yoast SEO Premium' );
				?>
			</a><br>
		</div>
		<div class="yoast-sidebar_section">
			<h2><?php esc_html_e( 'Improve your SEO skills', 'wordpress-seo' ); ?></h2>
			<div>
				<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/2oi' ); ?>" target="_blank" rel="noopener noreferrer"><img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/SEO_for_beginners.svg' ); ?>" alt=""></a>
				<p>
					<strong>
					<?php
					printf(
						/* translators: %1$s and %2$s convert to anchors. */
						esc_html__( 'Free: %1$sSEO for Beginners course%2$s', 'wordpress-seo' ),
						'<a target="_blank" rel="noopener noreferrer" href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/2oi' ) ) . '">',
						'</a>'
					);
					?>
					</strong><br>
					<?php esc_html_e( 'Get quick wins to make your site rank higher in search engines.', 'wordpress-seo' ); ?>
				</p>
				<br class="clear">
			</div>
			<div>
				<a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jv' ); ?>"><img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/yoast_seo_for_wp_2.svg' ); ?>" alt=""></a>
				<p>
					<strong><a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jv' ); ?>"><?php esc_html_e( 'Yoast SEO for WordPress course', 'wordpress-seo' ); ?></a></strong><br>
					<?php esc_html_e( 'Don’t waste time figuring out the best settings yourself.', 'wordpress-seo' ); ?>
				</p>
				<br class="clear">
			</div>
			<div>
				<a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/ju' ); ?>"><img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/BasicSEO.svg' ); ?>" alt=""></a>
				<p>
					<strong><a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/ju' ); ?>"><?php esc_html_e( 'Basic SEO course', 'wordpress-seo' ); ?></a></strong><br>
					<?php esc_html_e( 'Learn practical SEO skills to rank higher in Google.', 'wordpress-seo' ); ?>
				</p>
				<br class="clear">
			</div>
		</div>
		<div class="yoast-sidebar_section">
			<h2><?php esc_html_e( 'Extend Yoast SEO', 'wordpress-seo' ); ?></h2>
			<div>
				<a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jq' ); ?>"><img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/Local_SEO_Icon.svg' ); ?>" alt=""></a>
				<p>
					<strong><a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jq' ); ?>">Local SEO</a></strong><br>
					<?php esc_html_e( 'Be found in Google Maps and local results.', 'wordpress-seo' ); ?>
				</p>
				<br class="clear">
			</div>
			<div>
				<a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jo' ); ?>"><img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/Video_SEO_Icon.svg' ); ?>" alt=""></a>
				<p>
					<strong><a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jo' ); ?>">Video SEO</a></strong><br>
					<?php esc_html_e( 'Be found in Google Video search and enhance your video sharing on social media.', 'wordpress-seo' ); ?>
				</p>
				<br class="clear">
			</div>
			<div>
				<a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jp' ); ?>"><img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/Woo_SEO_Icon.svg' ); ?>" alt=""></a>
				<p>
					<strong><a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jp' ); ?>">WooCommerce SEO</a></strong><br>
					<?php esc_html_e( 'Optimize your shop\'s SEO and sell more products!', 'wordpress-seo' ); ?>
				</p>
				<br class="clear">
			</div>
			<div>
				<a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jr' ); ?>"><img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/News_SEO_Icon.svg' ); ?>" alt=""></a>
				<p>
					<strong><a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jr' ); ?>">News SEO</a></strong><br>
					<?php esc_html_e( 'Optimize your site for Google News.', 'wordpress-seo' ); ?>
				</p>
				<br class="clear">
			</div>
		</div>
		<div class="yoast-sidebar_section">
			<strong>Remove these ads?</strong>
			<p>
				<a target="_blank" rel="noopener noreferrer" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jy' ); ?>">
					<?php
						/* translators: %s expands to Yoast SEO Premium. */
						printf( esc_html__( 'Upgrade to %s »', 'wordpress-seo' ), 'Yoast SEO Premium' );
					?>
				</a>
			</p>
		</div>
	</div>
</div>
