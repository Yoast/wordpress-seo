<?php
/**
 * View for the banner sidebar.
 *
 * @package WPSEO\Admin\Views
 */

$wpseo_plugin_dir_url = plugin_dir_url( WPSEO_FILE );
$new_tab_message      = WPSEO_Admin_Utils::get_new_tab_message();

?>
<div class="wpseo_content_cell" id="sidebar-container">
	<div id="sidebar" class="yoast-sidebar">
		<div class="wpseo_content_cell_title yoast-sidebar__title">
			<?php
			/* translators: %1$s expands to Yoast */
			printf( esc_html__( '%1$s recommendations for you', 'wordpress-seo' ), 'Yoast' );
			?>
		</div>
		<div class="yoast-sidebar__section">
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
				echo $new_tab_message;
				echo '<span aria-hidden="true" class="yoast-button-upsell__caret"></span>';
				?>
			</a><br>
		</div>
		<div class="yoast-sidebar__section">
			<h2><?php esc_html_e( 'Improve your SEO skills', 'wordpress-seo' ); ?></h2>
			<div class="wp-clearfix">
				<p>
					<strong><?php echo esc_html_x( 'Free:', 'course', 'wordpress-seo' ); ?></strong>
					<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/2oi' ); ?>" target="_blank">
						<img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/SEO_for_beginners.svg' ); ?>" alt="">
						<strong><?php esc_html_e( 'SEO for Beginners course', 'wordpress-seo' ); ?></strong>
						<?php echo $new_tab_message; ?>
					</a><br>
					<?php esc_html_e( 'Get quick wins to make your site rank higher in search engines.', 'wordpress-seo' ); ?>
				</p>
			</div>
			<div class="wp-clearfix">
				<p>
					<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jv' ); ?>" target="_blank">
						<img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/yoast_seo_for_wp_2.svg' ); ?>" alt="">
						<strong>
							<?php
								/* translators: %s expands to Yoast SEO */
								printf( esc_html__( '%s for WordPress course', 'wordpress-seo' ), 'Yoast SEO' );
							?>
						</strong>
						<?php echo $new_tab_message; ?>
					</a><br>
					<?php esc_html_e( 'Don’t waste time figuring out the best settings yourself.', 'wordpress-seo' ); ?>
				</p>
			</div>
			<div class="wp-clearfix">
				<p>
					<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/ju' ); ?>" target="_blank">
						<img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/BasicSEO.svg' ); ?>" alt="">
						<strong><?php esc_html_e( 'Basic SEO course', 'wordpress-seo' ); ?></strong>
						<?php echo $new_tab_message; ?>
					</a><br>
					<?php esc_html_e( 'Learn practical SEO skills to rank higher in Google.', 'wordpress-seo' ); ?>
				</p>
			</div>
		</div>
		<div class="yoast-sidebar__section">
			<h2><?php esc_html_e( 'Extend Yoast SEO', 'wordpress-seo' ); ?></h2>
			<div class="wp-clearfix">
				<p>
					<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jq' ); ?>" target="_blank">
						<img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/Local_SEO_Icon.svg' ); ?>" alt="">
						<strong>Local SEO</strong>
						<?php echo $new_tab_message; ?>
					</a><br>
					<?php esc_html_e( 'Be found in Google Maps and local results.', 'wordpress-seo' ); ?>
				</p>
			</div>
			<div class="wp-clearfix">
				<p>
					<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jo' ); ?>" target="_blank">
						<img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/Video_SEO_Icon.svg' ); ?>" alt="">
						<strong>Video SEO</strong>
						<?php echo $new_tab_message; ?>
					</a><br>
					<?php esc_html_e( 'Be found in Google Video search and enhance your video sharing on social media.', 'wordpress-seo' ); ?>
				</p>
			</div>
			<div class="wp-clearfix">
				<p>
					<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jp' ); ?>" target="_blank">
						<img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/Woo_SEO_Icon.svg' ); ?>" alt="">
						<strong>WooCommerce SEO</strong>
						<?php echo $new_tab_message; ?>
					</a><br>
					<?php esc_html_e( 'Optimize your shop\'s SEO and sell more products!', 'wordpress-seo' ); ?>
				</p>
			</div>
			<div class="wp-clearfix">
				<p>
					<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jr' ); ?>" target="_blank">
						<img src="<?php echo esc_url( $wpseo_plugin_dir_url . 'images/News_SEO_Icon.svg' ); ?>" alt="">
						<strong>News SEO</strong>
						<?php echo $new_tab_message; ?>
					</a><br>
					<?php esc_html_e( 'Optimize your site for Google News.', 'wordpress-seo' ); ?>
				</p>
			</div>
		</div>
		<div class="yoast-sidebar__section">
			<strong><?php esc_html_e( 'Remove these ads?', 'wordpress-seo' ); ?></strong>
			<p>
				<a href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jy' ); ?>" target="_blank">
					<?php
						/* translators: %s expands to Yoast SEO Premium. */
						printf( esc_html__( 'Upgrade to %s »', 'wordpress-seo' ), 'Yoast SEO Premium' );
						echo $new_tab_message;
					?>
				</a>
			</p>
		</div>
	</div>
</div>
