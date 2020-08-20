<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   5.1
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$extension_list = new WPSEO_Extensions();
$extensions     = $extension_list->get();

// First invalidate all licenses.
array_map( [ $extension_list, 'invalidate' ], $extensions );

$premium_extension = new WPSEO_Extension(
	[
		'buyUrl'   => WPSEO_Shortlinker::get( 'https://yoa.st/zz' ),
		'infoUrl'  => WPSEO_Shortlinker::get( 'https://yoa.st/zy' ),
		'title'    => 'Yoast SEO Premium',
		/* translators: %1$s expands to Yoast SEO */
		'desc'     => sprintf( __( 'The premium version of %1$s with more features & support.', 'wordpress-seo' ), 'Yoast SEO' ),
		'benefits' => [],
	]
);

$extensions = [
	WPSEO_Addon_Manager::LOCAL_SLUG => new WPSEO_Extension(
		[
			'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zt' ),
			'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zs' ),
			'title'         => 'Local SEO',
			'display_title' => __( 'Stop losing customers to other local businesses', 'wordpress-seo' ),
			'desc'          => __( 'Rank better locally and in Google Maps, without breaking a sweat!', 'wordpress-seo' ),
			'image'         => plugins_url( 'images/local_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
			'benefits'      => [
				__( 'Get better search results in local search', 'wordpress-seo' ),
				__( 'Easily insert Google Maps, a store locator, opening hours and more', 'wordpress-seo' ),
				/* translators: %1$s expands to WooCommerce  */
				sprintf( __( 'Allow customers to pick up their %s order locally', 'wordpress-seo' ), 'WooCommerce' ),
			],
		]
	),
	WPSEO_Addon_Manager::VIDEO_SLUG => new WPSEO_Extension(
		[
			'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zx/' ),
			'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zw/' ),
			'title'         => 'Video SEO',
			'display_title' => __( 'Start ranking better for your videos', 'wordpress-seo' ),
			'desc'          => __( 'Optimize your videos to show them off in search results and get more clicks!', 'wordpress-seo' ),
			'image'         => plugins_url( 'images/video_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
			'benefits'      => [
				__( 'Show your videos in Google Videos', 'wordpress-seo' ),
				__( 'Enhance the experience of sharing posts with videos', 'wordpress-seo' ),
				__( 'Make videos responsive through enabling fitvids.js', 'wordpress-seo' ),
			],
		]
	),
	WPSEO_Addon_Manager::NEWS_SLUG  => new WPSEO_Extension(
		[
			'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zv/' ),
			'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zu/' ),
			'title'         => 'News SEO',
			'display_title' => __( 'Everything you need for Google News', 'wordpress-seo' ),
			'desc'          => __( 'Are you in Google News? Increase your traffic from Google News by optimizing for it!', 'wordpress-seo' ),
			'image'         => plugins_url( 'images/news_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
			'benefits'      => [
				__( 'Optimize your site for Google News', 'wordpress-seo' ),
				__( 'Immediately pings Google on the publication of a new post', 'wordpress-seo' ),
				__( 'Creates XML News Sitemaps', 'wordpress-seo' ),
			],
		]
	),
];

// Add Yoast WooCommerce SEO when WooCommerce is active.
if ( WPSEO_Utils::is_woocommerce_active() ) {
	$extensions[ WPSEO_Addon_Manager::WOOCOMMERCE_SLUG ] = new WPSEO_Extension(
		[
			'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zr' ),
			'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zq' ),
			'title'         => 'Yoast WooCommerce SEO',
			'display_title' => __( 'Make your products stand out in Google', 'wordpress-seo' ),
			/* translators: %1$s expands to Yoast SEO */
			'desc'          => sprintf( __( 'Seamlessly integrate WooCommerce with %1$s and get extra features!', 'wordpress-seo' ), 'Yoast SEO' ),
			'image'         => plugins_url( 'images/woo_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
			'benefits'      => [
				sprintf( __( 'Improve sharing on Facebook and Pinterest', 'wordpress-seo' ) ),
				/* translators: %1$s expands to Yoast, %2$s expands to WooCommerce */
				sprintf( __( 'Use %1$s breadcrumbs instead of %2$s ones', 'wordpress-seo' ), 'Yoast', 'WooCommerce' ),
				/* translators: %1$s expands to Yoast SEO, %2$s expands to WooCommerce */
				sprintf( __( 'A seamless integration between %1$s and %2$s', 'wordpress-seo' ), 'Yoast SEO', 'WooCommerce' ),
			],
			'buy_button'    => 'WooCommerce SEO',
		]
	);
}

$addon_manager                  = new WPSEO_Addon_Manager();
$has_valid_premium_subscription = WPSEO_Utils::is_yoast_seo_premium() && $addon_manager->has_valid_subscription( WPSEO_Addon_Manager::PREMIUM_SLUG );

/* translators: %1$s expands to Yoast SEO. */
$wpseo_extensions_header = sprintf( __( '%1$s Extensions', 'wordpress-seo' ), 'Yoast SEO' );
$new_tab_message         = sprintf(
	'<span class="screen-reader-text">%1$s</span>',
	esc_html__( '(Opens in a new browser tab)', 'wordpress-seo' )
);

?>

<div class="wrap yoast wpseo_table_page">

	<h1 id="wpseo-title" class="yoast-h1"><?php echo esc_html( $wpseo_extensions_header ); ?></h1>

	<div id="extensions">
		<section class="yoast-seo-premium-extension">
			<h2>
				<?php
				printf(
					/* translators: 1: expands to Yoast SEO Premium */
					esc_html__( '%1$s, take your optimization to the next level!', 'wordpress-seo' ),
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
					'<span class="yoast-heading-highlight">' . $premium_extension->get_title() . '</span>'
				);
				?>
			</h2>

			<?php
			if ( ! $has_valid_premium_subscription ) :
				?>
				<ul class="yoast-seo-premium-benefits yoast-list--usp">
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Redirect manager', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'create and manage redirects from within your WordPress install.', 'wordpress-seo' ); ?></span>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Synonyms & related keyphrases', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'optimize a single post for synonyms and related keyphrases.', 'wordpress-seo' ); ?></span>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Social previews', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'check what your Facebook or Twitter post will look like.', 'wordpress-seo' ); ?></span>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Premium support', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'gain access to our 24/7 support team.', 'wordpress-seo' ); ?></span>
					</li>
				</ul>
			<?php endif; ?>
			<?php if ( $extension_list->is_installed( $premium_extension->get_title() ) ) : ?>
				<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-installed"><?php esc_html_e( 'Installed', 'wordpress-seo' ); ?></div>

				<?php if ( $has_valid_premium_subscription ) : ?>
					<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-activated"><?php esc_html_e( 'Activated', 'wordpress-seo' ); ?></div>
					<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13k' ); ?>"
						class="yoast-link--license">
						<?php
						printf(
							/* translators: %s expands to the extension title */
							esc_html__( 'Manage your %s subscription on MyYoast', 'wordpress-seo' ),
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
							$premium_extension->get_title()
						);
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
						echo $new_tab_message;
						?>
					</a>
				<?php else : ?>
					<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-not-activated"><?php esc_html_e( 'Not activated', 'wordpress-seo' ); ?></div>
					<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13i' ); ?>"
						class="yoast-link--license">
						<?php
						printf(
							/* translators: %s expands to the extension title */
							esc_html__( 'Activate %s for your site on MyYoast', 'wordpress-seo' ),
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
							$premium_extension->get_title()
						);
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
						echo $new_tab_message;
						?>
					</a>
				<?php endif; ?>

			<?php else : ?>

				<a target="_blank" href="<?php echo esc_url( $premium_extension->get_buy_url() ); ?>"
					class="yoast-button-upsell">
					<?php
					printf(
						/* translators: $s expands to Yoast SEO Premium */
						esc_html__( 'Buy %s', 'wordpress-seo' ),
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
						$premium_extension->get_title()
					);
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
					echo $new_tab_message;
					echo '<span aria-hidden="true" class="yoast-button-upsell__caret"></span>';
					?>
				</a>

				<a target="_blank" href="<?php echo esc_url( $premium_extension->get_info_url() ); ?>"
					class="yoast-link--more-info">
					<?php
					printf(
						/* translators: Text between 1: and 2: will only be shown to screen readers. 3: expands to the product name. */
						esc_html__( 'More information %1$sabout %3$s%2$s', 'wordpress-seo' ),
						'<span class="screen-reader-text">',
						'</span>',
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
						$premium_extension->get_title()
					);
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
					echo $new_tab_message;
					?>
				</a>
			<?php endif; ?>
			<?php if ( ! $has_valid_premium_subscription ) { ?>
				<p>
					<small class="yoast-money-back-guarantee"><?php esc_html_e( 'Comes with our 30-day no questions asked money back guarantee', 'wordpress-seo' ); ?></small>
				</p>
			<?php } ?>
		</section>

		<hr class="yoast-hr" aria-hidden="true"/>

		<section class="yoast-promo-extensions">
			<h2>
				<?php
				/* translators: 1: expands to Yoast SEO */
				$yoast_seo_extensions = sprintf( esc_html__( '%1$s extensions', 'wordpress-seo' ), 'Yoast SEO' );
				$yoast_seo_extensions = '<span class="yoast-heading-highlight">' . $yoast_seo_extensions . '</span>';

				printf(
					/* translators: 1: expands to Yoast SEO extensions */
					esc_html__( '%1$s to optimize your site even further', 'wordpress-seo' ),
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $yoast_seo_extensions is properly escaped.
					$yoast_seo_extensions
				);
				?>
			</h2>

			<?php foreach ( $extensions as $slug => $extension ) : ?>
				<section class="yoast-promoblock secondary yoast-promo-extension">
					<h3>
						<img alt="" width="100" height="100" src="<?php echo esc_attr( $extension->get_image() ); ?>"/>
						<?php echo esc_html( $extension->get_display_title() ); ?>
					</h3>
					<ul class="yoast-list--usp">
						<?php foreach ( $extension->get_benefits() as $benefit ) : ?>
							<li><?php echo esc_html( $benefit ); ?></li>
						<?php endforeach; ?>
					</ul>

					<div class="yoast-button-container">
						<?php if ( $extension_list->is_installed( $extension->get_title() ) ) : ?>
							<div class="yoast-button yoast-button--noarrow  yoast-button--extension yoast-button--extension-installed"><?php esc_html_e( 'Installed', 'wordpress-seo' ); ?></div>

							<?php if ( $addon_manager->has_valid_subscription( $slug ) ) : ?>
								<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-activated"><?php esc_html_e( 'Activated', 'wordpress-seo' ); ?></div>
								<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13k' ); ?>"
									class="yoast-link--license">
									<?php
									printf(
										/* translators: %s expands to the extension title */
										esc_html__( 'Manage your %s subscription on MyYoast', 'wordpress-seo' ),
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
										$extension->get_title()
									);
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
									echo $new_tab_message;
									?>
								</a>
							<?php else : ?>
								<div class="yoast-button yoast-button--noarrow  yoast-button--extension yoast-button--extension-not-activated"><?php esc_html_e( 'Not activated', 'wordpress-seo' ); ?></div>
								<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13i' ); ?>"
									class="yoast-link--license">
									<?php
									printf(
										/* translators: %s expands to the extension title */
										esc_html__( 'Activate %s for your site on MyYoast', 'wordpress-seo' ),
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
										$extension->get_title()
									);
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
									echo $new_tab_message;
									?>
								</a>
							<?php endif; ?>
						<?php else : ?>
							<a target="_blank" class="yoast-button-upsell"
								href="<?php echo esc_url( $extension->get_buy_url() ); ?>">
								<?php
								printf(
									/* translators: %s expands to the product name */
									esc_html__( 'Buy %s', 'wordpress-seo' ),
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The possible `get_buy_button` values are hardcoded (buy_button or title); only passed through the WPSEO_Extensions class.
									$extension->get_buy_button()
								);
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
								echo $new_tab_message;
								echo '<span aria-hidden="true" class="yoast-button-upsell__caret"></span>';
								?>
							</a>

							<a target="_blank" class="yoast-link--more-info"
								href="<?php echo esc_url( $extension->get_info_url() ); ?>">
								<?php
								printf(
									/* translators: Text between 1: and 2: will only be shown to screen readers. 3: expands to the product name. */
									esc_html__( 'More information %1$sabout %3$s%2$s', 'wordpress-seo' ),
									'<span class="screen-reader-text">',
									'</span>',
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
									$extension->get_title()
								);
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
								echo $new_tab_message;
								?>
							</a>
						<?php endif; ?>
					</div>
				</section>
			<?php endforeach; ?>
		</section>
	</div>

</div>
