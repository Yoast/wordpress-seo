<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   5.1
 */

use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

do_action( 'wpseo_install_and_activate_addons' );

$premium_extension = [
	'buyUrl'   => WPSEO_Shortlinker::get( 'https://yoa.st/zz' ),
	'infoUrl'  => WPSEO_Shortlinker::get( 'https://yoa.st/zy' ),
	'title'    => 'Yoast SEO Premium',
	/* translators: %1$s expands to Yoast SEO */
	'desc'     => sprintf( __( 'The premium version of %1$s with more features & support.', 'wordpress-seo' ), 'Yoast SEO' ),
	'image'    => plugin_dir_url( WPSEO_FILE ) . 'packages/js/images/Yoast_SEO_Icon.svg',
	'benefits' => [],
];

$extensions = [
	WPSEO_Addon_Manager::LOCAL_SLUG => [
		'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zt' ),
		'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zs' ),
		'title'         => 'Local SEO',
		'display_title' => __( 'Stand out for local searches', 'wordpress-seo' ),
		'desc'          => __( 'Rank better locally and in Google Maps, without breaking a sweat!', 'wordpress-seo' ),
		'image'         => plugins_url( 'images/local_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
		'benefits'      => [
			__( 'Attract more customers to your site and physical store', 'wordpress-seo' ),
			__( 'Automatically get technical SEO best practices for local businesses', 'wordpress-seo' ),
			__( 'Easily add maps, address finders, and opening hours to your content', 'wordpress-seo' ),
			__( 'Optimize your business for multiple locations', 'wordpress-seo' ),
		],
	],
	WPSEO_Addon_Manager::VIDEO_SLUG => [
		'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zx/' ),
		'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zw/' ),
		'title'         => 'Video SEO',
		'display_title' => __( 'Drive more views to your videos', 'wordpress-seo' ),
		'desc'          => __( 'Optimize your videos to show them off in search results and get more clicks!', 'wordpress-seo' ),
		'image'         => plugins_url( 'images/video_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
		'benefits'      => [
			__( 'Automatically get technical SEO best practices for video content', 'wordpress-seo' ),
			__( 'Make sure your videos load quickly for users', 'wordpress-seo' ),
			__( 'Make your videos responsive for all screen sizes', 'wordpress-seo' ),
			__( 'Optimize your video previews & thumbnails', 'wordpress-seo' ),
		],
	],
	WPSEO_Addon_Manager::NEWS_SLUG  => [
		'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zv/' ),
		'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zu/' ),
		'title'         => 'News SEO',
		'display_title' => __( 'Rank higher in Google\'s news carousel', 'wordpress-seo' ),
		'desc'          => __( 'Are you in Google News? Increase your traffic from Google News by optimizing for it!', 'wordpress-seo' ),
		'image'         => plugins_url( 'images/news_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
		'benefits'      => [
			__( 'Optimize your site for Google News', 'wordpress-seo' ),
			__( 'Ping Google on the publication of a new post', 'wordpress-seo' ),
			__( 'Add all necessary schema.org markup', 'wordpress-seo' ),
			__( 'Get XML sitemaps', 'wordpress-seo' ),
		],
	],
];

// Add Yoast WooCommerce SEO when WooCommerce is active.
if ( YoastSEO()->helpers->woocommerce->is_active() ) {
	$extensions[ WPSEO_Addon_Manager::WOOCOMMERCE_SLUG ] = [
		'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zr' ),
		'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zq' ),
		'title'         => 'Yoast WooCommerce SEO',
		'display_title' => __( 'Drive more traffic to your online store', 'wordpress-seo' ),
		/* translators: %1$s expands to Yoast SEO */
		'desc'          => sprintf( __( 'Seamlessly integrate WooCommerce with %1$s and get extra features!', 'wordpress-seo' ), 'Yoast SEO' ),
		'image'         => plugins_url( 'images/woo_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
		'benefits'      => [
			__( 'Write product pages that rank using the SEO analysis', 'wordpress-seo' ),
			__( 'Increase Google clicks with rich results', 'wordpress-seo' ),
			__( 'Add global identifiers for variable products', 'wordpress-seo' ),
			/* translators: %1$s expands to Yoast SEO, %2$s expands to WooCommerce */
			sprintf( __( 'Seamless integration between %1$s and %2$s', 'wordpress-seo' ), 'Yoast SEO', 'WooCommerce' ),
			__( 'Turn more visitors into customers!', 'wordpress-seo' ),
		],
		'buy_button'    => 'WooCommerce SEO',
	];
}

// The total number of plugins to consider is the length of the array + 1 for Premium.
// @phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$number_plugins_total = ( count( $extensions ) + 1 );
// @phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$number_plugins_active = 0;

$extensions['yoast-seo-plugin-subscription'] = [
	'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/premium-page-bundle-buy' ),
	'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/premium-page-bundle-info' ),
	/* translators: used in phrases such as "More information about all the Yoast plugins" */
	'title'         => __( 'all the Yoast plugins', 'wordpress-seo' ),
	'display_title' => __( 'Cover all your SEO bases', 'wordpress-seo' ),
	'desc'          => '',
	'image'         => plugins_url( 'images/plugin_subscription.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
	'benefits'      => [
		__( 'Get all 5 Yoast plugins for WordPress at a big discount', 'wordpress-seo' ),
		__( 'Reach new customers who live near your business', 'wordpress-seo' ),
		__( 'Drive more views to your videos', 'wordpress-seo' ),
		__( 'Rank higher in Google\'s news carousel', 'wordpress-seo' ),
		__( 'Drive more traffic to your online store', 'wordpress-seo' ),

	],
	/* translators: used in phrases such as "Buy all the Yoast plugins" */
	'buy_button'    => __( 'all the Yoast plugins', 'wordpress-seo' ),
];

$addon_manager                  = new WPSEO_Addon_Manager();
$has_valid_premium_subscription = YoastSEO()->helpers->product->is_premium() && $addon_manager->has_valid_subscription( WPSEO_Addon_Manager::PREMIUM_SLUG );

/* translators: %1$s expands to Yoast SEO. */
$wpseo_extensions_header = sprintf( __( '%1$s Extensions', 'wordpress-seo' ), 'Yoast SEO' );
$new_tab_message         = sprintf(
	'<span class="screen-reader-text">%1$s</span>',
	/* translators: Hidden accessibility text. */
	esc_html__( '(Opens in a new browser tab)', 'wordpress-seo' )
);

$sale_badge         = '';
$premium_sale_badge = '';

if ( YoastSEO()->classes->get( Promotion_Manager::class )->is( 'black-friday-2024-promotion' ) ) {
	/* translators: %1$s expands to opening span, %2$s expands to closing span */
	$sale_badge_span = sprintf( esc_html__( '%1$s30%% OFF%2$s', 'wordpress-seo' ), '<span>', '</span>' );

	$sale_badge = '<div class="yoast-seo-premium-extension-sale-badge">' . $sale_badge_span . '</div>';

	$premium_sale_badge = ( $has_valid_premium_subscription ) ? '' : $sale_badge;
}

?>

<div class="wrap yoast wpseo_table_page">

	<h1 id="wpseo-title" class="yoast-h1"><?php echo esc_html( $wpseo_extensions_header ); ?></h1>

	<div id="extensions">
		<section class="yoast-seo-premium-extension">
			<?php echo $premium_sale_badge; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: Output is already escaped ?>
			<h2>
				<?php esc_html_e( 'Rank higher in search results', 'wordpress-seo' ); ?>
				<img alt="" width="100" height="100" src="<?php echo esc_url( $premium_extension['image'] ); ?>"/>
			</h2>
			<?php
			if ( ! $has_valid_premium_subscription ) :
				?>
				<ul class="yoast-seo-premium-benefits yoast-list--usp">
					<li class="yoast-seo-premium-benefits__item">
						<?php
						printf(
							/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
							esc_html__( '%1$sAI%2$s: Better SEO titles and meta descriptions, faster.', 'wordpress-seo' ),
							'<strong>',
							'</strong>'
						);
						?>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<?php
						printf(
							/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
							esc_html__( '%1$sMultiple keywords%2$s: Rank higher for more searches.', 'wordpress-seo' ),
							'<strong>',
							'</strong>'
						);
						?>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<?php
						printf(
							/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
							esc_html__( '%1$sSuper fast%2$s internal linking suggestions.', 'wordpress-seo' ),
							'<strong>',
							'</strong>'
						);
						?>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<?php
						printf(
							/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
							esc_html__( '%1$sNo more broken links%2$s: Automatic redirect manager.', 'wordpress-seo' ),
							'<strong>',
							'</strong>'
						);
						?>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<?php
						printf(
							/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
							esc_html__( '%1$sAppealing social previews%2$s people actually want to click on.', 'wordpress-seo' ),
							'<strong>',
							'</strong>'
						);
						?>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<?php
						printf(
							/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
							esc_html__( '%1$s24/7 support%2$s: Also on evenings and weekends.', 'wordpress-seo' ),
							'<strong>',
							'</strong>'
						);
						?>
					</li>
				</ul>
			<?php endif; ?>
			<?php if ( $addon_manager->is_installed( WPSEO_Addon_Manager::PREMIUM_SLUG ) ) : ?>
				<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-installed"><?php esc_html_e( 'Installed', 'wordpress-seo' ); ?></div>

				<?php
				if ( $has_valid_premium_subscription ) :
					++$number_plugins_active;
					?>
					<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-activated"><?php esc_html_e( 'Activated', 'wordpress-seo' ); ?></div>
					<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13k' ); ?>" class="yoast-link--license">
						<?php
						printf(
							/* translators: %s expands to the extension title */
							esc_html__( 'Manage your %s subscription on MyYoast', 'wordpress-seo' ),
							esc_html( $premium_extension['title'] )
						);
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
						echo $new_tab_message;
						?>
					</a>
				<?php else : ?>
					<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-not-activated"><?php esc_html_e( 'Not activated', 'wordpress-seo' ); ?></div>
					<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13i' ); ?>" class="yoast-link--license">
						<?php
						printf(
							/* translators: %s expands to the extension title */
							esc_html__( 'Activate %s for your site on MyYoast', 'wordpress-seo' ),
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
							esc_html( $premium_extension['title'] )
						);
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
						echo $new_tab_message;
						?>
					</a>
				<?php endif; ?>

			<?php else : ?>

				<a target="_blank" data-action="load-nfd-ctb" data-ctb-id="f6a84663-465f-4cb5-8ba5-f7a6d72224b2" href="<?php echo esc_url( $premium_extension['buyUrl'] ); ?>" class="yoast-button-upsell">
					<?php
					printf(
						/* translators: $s expands to Yoast SEO Premium */
						esc_html__( 'Buy %s', 'wordpress-seo' ),
						esc_html( $premium_extension['title'] )
					);
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
					echo $new_tab_message;
					echo '<span aria-hidden="true" class="yoast-button-upsell__caret"></span>';
					?>
				</a>

				<a target="_blank"  href="<?php echo esc_url( $premium_extension['infoUrl'] ); ?>" class="yoast-link--more-info">
					<?php
					esc_html_e( 'Explore now', 'wordpress-seo' );
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
					echo $new_tab_message;
					?>
				</a>
			<?php endif; ?>
			<?php if ( ! $has_valid_premium_subscription ) { ?>
				<p>
					<small class="yoast-money-back-guarantee"><?php esc_html_e( 'With a 30-day money-back guarantee. No questions asked.', 'wordpress-seo' ); ?></small>
				</p>
			<?php } ?>
		</section>

		<hr class="yoast-hr" aria-hidden="true"/>

		<section class="yoast-promo-extensions">
			<h2>
				<?php
				printf(
					/* translators: %1$s expands to a span opening tag, %2$s expands to a span closing tag, %3$s expands to Yoast SEO */
					esc_html__( '%1$sOutrank your competitors even further%2$s with these %3$s plugins', 'wordpress-seo' ),
					'<span class="yoast-heading-highlight">',
					'</span>',
					'Yoast SEO'
				);
				?>
			</h2>

			<?php
			foreach ( $extensions as $slug => $extension ) :

				// Skip the "All the plugins" card if the user has already all the plugins active.
				if ( $slug === 'yoast-seo-plugin-subscription' && $number_plugins_active === $number_plugins_total ) {
					continue;
				}
				?>
				<section class="yoast-promoblock secondary yoast-promo-extension">
					<?php if ( ! $addon_manager->has_valid_subscription( $slug ) || ! $addon_manager->is_installed( $slug ) ) : ?>
						<?php echo $sale_badge; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: Output already escaped ?>
					<?php endif; ?>
					<h3>
						<img alt="" width="100" height="100" src="<?php echo esc_url( $extension['image'] ); ?>"/>
						<?php echo esc_html( $extension['display_title'] ); ?>
					</h3>
					<ul class="yoast-list--usp">
						<?php foreach ( $extension['benefits'] as $benefit ) : ?>
							<li><?php echo esc_html( $benefit ); ?></li>
						<?php endforeach; ?>
					</ul>

					<div class="yoast-button-container">
						<?php if ( $addon_manager->is_installed( $slug ) ) : ?>
							<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-installed"><?php esc_html_e( 'Installed', 'wordpress-seo' ); ?></div>

							<?php
							if ( $addon_manager->has_valid_subscription( $slug ) ) :
								++$number_plugins_active;
								?>
								<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-activated"><?php esc_html_e( 'Activated', 'wordpress-seo' ); ?></div>
								<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13k' ); ?>" class="yoast-link--license">
									<?php
									printf(
										/* translators: %s expands to the extension title */
										esc_html__( 'Manage your %s subscription on MyYoast', 'wordpress-seo' ),
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
										$extension['title']
									);
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
									echo $new_tab_message;
									?>
								</a>
							<?php else : ?>
								<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-not-activated"><?php esc_html_e( 'Not activated', 'wordpress-seo' ); ?></div>
								<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13i' ); ?>" class="yoast-link--license">
									<?php
									printf(
										/* translators: %s expands to the extension title */
										esc_html__( 'Activate %s for your site on MyYoast', 'wordpress-seo' ),
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
										$extension['title']
									);
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
									echo $new_tab_message;
									?>
								</a>
							<?php endif; ?>
						<?php else : ?>
							<a target="_blank" class="yoast-button-upsell" href="<?php echo esc_url( $extension['buyUrl'] ); ?>">
								<?php
								printf(
									/* translators: %s expands to the product name, e.g. "News SEO" or "all the Yoast Plugins" */
									esc_html__( 'Buy %s', 'wordpress-seo' ),
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The possible `get_buy_button` values are hardcoded (buy_button or title); only passed through the WPSEO_Extensions class.
									( isset( $extension['buy_button'] ) ) ? $extension['buy_button'] : $extension['title']
								);
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
								echo $new_tab_message;
								echo '<span aria-hidden="true" class="yoast-button-upsell__caret"></span>';
								?>
							</a>
							<?php if ( $slug === 'yoast-seo-plugin-subscription' ) : ?>
								<p class="yoast-subscription-discount">
									<?php esc_html_e( 'Only $/€/£229 per year (ex VAT). Save over 40% with this subscription!', 'wordpress-seo' ); ?>
								</p>
							<?php endif; ?>
							<a target="_blank" class="yoast-link--more-info" href="<?php echo esc_url( $extension['infoUrl'] ); ?>">
								<?php
								esc_html_e( 'Explore now', 'wordpress-seo' );
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
