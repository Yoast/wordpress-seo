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
				/* translators: %s expands to Yoast SEO Premium */
				printf( esc_html__( 'Upgrade to %s', 'wordpress-seo' ), 'Yoast SEO Premium' );
				?>
			</h2>
			<ul>
				<li>
					<strong><?php esc_html_e( 'Rank better with synonyms & related keyphrases', 'wordpress-seo' ); ?></strong>
				</li>
				<li>
					<strong><?php esc_html_e( 'Preview your page in Facebook and Twitter', 'wordpress-seo' ); ?></strong>
				</li>
				<li>
					<strong><?php esc_html_e( 'Get real-time suggestions for internal links', 'wordpress-seo' ); ?></strong>
				</li>
				<li><strong><?php esc_html_e( 'No more dead links a.k.a. 404 pages', 'wordpress-seo' ); ?></strong></li>
				<li><strong><?php esc_html_e( '24/7 email support', 'wordpress-seo' ); ?></strong></li>
				<li><strong><?php esc_html_e( 'No ads!', 'wordpress-seo' ); ?></strong></li>
			</ul>
			<a id="wpseo-premium-button" class="yoast-button-upsell"
				href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/jj' ); ?>" target="_blank">
				<?php
				/* translators: %s expands to Yoast SEO Premium */
				printf( esc_html__( 'Get %s', 'wordpress-seo' ), 'Yoast SEO Premium' );
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
				echo $new_tab_message;
				echo '<span aria-hidden="true" class="yoast-button-upsell__caret"></span>';
				?>
			</a>
		</div>
		<div class="yoast-sidebar__section">
			<h2>
				<?php
				esc_html_e( 'Learn SEO', 'wordpress-seo' );
				?>
			</h2>
			<p>
				<?php
				$url = WPSEO_Shortlinker::get( 'https://yoa.st/3t6' );

				/* translators: %1$s expands to Yoast SEO academy, which is a clickable link. */
				printf( esc_html__( 'Want to learn SEO from Team Yoast? Check out our %1$s!', 'wordpress-seo' ), '<a href="' . esc_url( $url ) . '"><strong>Yoast SEO academy</strong></a>' );
				echo '<br/>';
				esc_html_e( 'We have both free and premium online courses to learn everything you need to know about SEO.', 'wordpress-seo' );
				?>
			</p>
			<p>
				<a href="<?php echo esc_url( $url ); ?>" target="_blank">
					<?php
					/* translators: %1$s expands to Yoast SEO academy */
					printf( esc_html__( 'Check out %1$s', 'wordpress-seo' ), 'Yoast SEO academy' );
					?>
				</a>
			</p>
		</div>
	</div>
</div>
