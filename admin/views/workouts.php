<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses string $cornerstone_guide  The link to the cornerstone guide.
 * @uses string $cornerstone_upsell The link to buy premium from the cornerstone workout.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

?>

<div id='wpseo-workouts-container'>
	<div>
		<h1>
			<?php esc_attr_e( 'SEO Workouts', 'wordpress-seo' ); ?>
		</h1>
		<p>
			<?php
			esc_attr_e(
				'Getting your site in shape and keeping it SEO fit can be challenging. Let us help you get started by taking on the most common SEO challenges, with these step by step SEO workouts.',
				'wordpress-seo'
			);
			?>
		</p>
		<div class='card'>
			<h2><?php esc_attr_e( 'The cornerstone approach', 'wordpress-seo' ); ?></h2>
			<h3><?php esc_attr_e( 'Rank with articles you want to rank with', 'wordpress-seo' ); ?></h3>
			<p>
				<?php
				printf(
					esc_attr(
						/* translators: %1$s expands to <em>, %2$s expands to </em>. */
						__(
							'On your site you have a few articles that are %1$sthe%2$s most important. You want to rank highest in Google with these articles. At Yoast, we call these articles cornerstone articles. Take the following 6 steps in order to start ranking with your cornerstone articles!',
							'wordpress-seo'
						)
					),
					'<em>',
					'</em>'
				);
				?>
			</p>
			<p>
				<?php
				printf(
					esc_attr(
						/* translators: %1$s expands to <em>, %2$s expands to <a>, %3$s expands to </a>, %4$s expands to </em>.  */
						__(
							'%1$sNeed more guidance? We\'ve covered every step in more detail in our %2$sCornerstone practical guide%3$s%4$s.',
							'wordpress-seo'
						)
					),
					'<em>',
					'<a href="' . esc_url( $cornerstone_guide ) . '" target="_blank">',
					'</a>',
					'</em>'
				);
				?>
			</p>
			<hr />
			<ol class='workflow yoast'>
				<li>
				<h4><?php esc_attr_e( 'Start: Choose your cornerstones!', 'wordpress-seo' ); ?></h4>
				<div class='workflow__grid'>
					<div>
						<p>
							<?php
							esc_attr_e(
								'Your site might not feel that SEO fit just yet. But that\'s just a matter of time. Let\'s start this workout by choosing your cornerstones.',
								'wordpress-seo'
							);
							?>
						</p>
						<p>
							<?php
							printf(
								esc_attr(
									/* translators: %1$s expands to <em>, %2$s expands to </em>. */
									__(
										'With which articles do you want to rank highest? Which are the most complete, which are the best explainers, which are %1$sthe%2$s most important? Check out your own website and choose the pages and posts you want to be your cornerstone articles!',
										'wordpress-seo'
									)
								),
								'<em>',
								'</em>'
							);
							?>
						</p>
					</div>
				</div>
				<button class='yoast-button' disabled='1'>
					<?php esc_attr_e( 'Finish this step', 'wordpress-seo' ); ?>
				</button>
				</li>
				<li>
				<h4><?php esc_attr_e( 'Mark these articles as cornerstone content', 'wordpress-seo' ); ?></h4>
				<p>
					<?php
					printf(
						esc_attr(
							/* translators: %1$s expands to <em>, %2$s expands to </em>. */
							__(
								'Surf to each one of your cornerstones on your own website. Hit %1$sedit post%2$s and go to the WordPress Backend. Mark them as cornerstones in the SEO tab of the metabox or the sidebar of Yoast SEO.',
								'wordpress-seo'
							)
						),
						'<em>',
						'</em>'
					);
					?>
				</p>
				<button class='yoast-button' disabled='1'>
					<?php esc_attr_e( 'Finish this step', 'wordpress-seo' ); ?>
				</button>
				</li>
				<li class="yoast-fadeout">
					<h4><?php esc_attr_e( 'Want to continue?', 'wordpress-seo' ); ?></h4>
					<div class='workflow__grid'>
						<div>
							<p>
								<?php
								esc_attr_e(
									'Finish this workout and make sure the right pages are ranking with Yoast SEO Premium.',
									'wordpress-seo'
								);
								?>
							</p>
							<a class='yoast-button-upsell' href='<?php echo esc_url( $cornerstone_upsell ); ?>'>
								<?php esc_attr_e( 'Get Yoast SEO Premium', 'wordpress-seo' ); ?>
							</a>
						</div>
						<div>
						</div>
					</div>
				</li>
			</ol>
		</div>
	</div>
</div>
