<?php
/**
 * @package WPSEO\Admin
 * @since      5.1
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$extension_list = new WPSEO_Extensions();
$extensions = $extension_list->get();

// First invalidate all licenses.
array_map( array( $extension_list, 'invalidate' ), $extensions );

$extensions = new WPSEO_Extension_Manager();

$extensions->add(
	'wordpress-seo-premium',
	new WPSEO_Extension(
		array(
			'url'       => WPSEO_Shortlinker::get( 'https://yoa.st/pe-premium-page' ),
			'title'     => 'Yoast SEO Premium',
			/* translators: %1$s expands to Yoast SEO */
			'desc'      => sprintf( __( 'The premium version of %1$s with more features & support.', 'wordpress-seo' ), 'Yoast SEO' ),
			'image'     => plugins_url( 'images/extensions-premium-ribbon.png', WPSEO_FILE ),
			'benefits'  => array(),
		)
	)
);

$extensions->add(
	'wpseo-video',
	new WPSEO_Extension(
		array(
			'buyUrl'    => WPSEO_Shortlinker::get( 'https://yoa.st/zx/' ),
			'infoUrl'   => WPSEO_Shortlinker::get( 'https://yoa.st/zw/' ),
			'title'     => 'Video SEO',
			'desc'      => __( 'Optimize your videos to show them off in search results and get more clicks!', 'wordpress-seo' ),
			'image'     => plugins_url( 'images/extensions-video.png', WPSEO_FILE ),
			'benefits'  => array(
				__( 'Show your videos in Google Videos', 'wordpress-seo' ),
				__( 'Enhance the experience of sharing posts with videos', 'wordpress-seo' ),
				__( 'Make videos responsive through enabling fitvids.js', 'wordpress-seo' ),
			),
		)
	)
);

$extensions->add(
	'wpseo-news',
	new WPSEO_Extension(
		array(
			'buyUrl'    => WPSEO_Shortlinker::get( 'https://yoa.st/zv/' ),
			'infoUrl'   => WPSEO_Shortlinker::get( 'https://yoa.st/zu/' ),
			'title'     => 'News SEO',
			'desc'      => __( 'Are you in Google News? Increase your traffic from Google News by optimizing for it!', 'wordpress-seo' ),
			'image'     => plugins_url( 'images/extensions-news.png', WPSEO_FILE ),
			'benefits'  => array(
				__( 'Optimize your site for Google News', 'wordpress-seo' ),
				__( 'Immediately pings Google on the publication of a new post', 'wordpress-seo' ),
				__( 'Creates XML News Sitemaps', 'wordpress-seo' ),
			),
		)
	)
);

$extensions->add(
	'wpseo-local',
	new WPSEO_Extension(
		array(
			'buyUrl'    => WPSEO_Shortlinker::get( 'https://yoa.st/zt' ),
			'infoUrl'   => WPSEO_Shortlinker::get( 'https://yoa.st/zs' ),
			'title'     => 'Local SEO',
			'desc'      => __( 'Rank better locally and in Google Maps, without breaking a sweat!', 'wordpress-seo' ),
			'image'     => plugins_url( 'images/extensions-local.png', WPSEO_FILE ),
			'benefits'  => array(
				__( 'Get found by potential clients', 'wordpress-seo' ),
				__( 'Easily insert Google Maps, a store locator, opening hours and more', 'wordpress-seo' ),
				__( 'Improve the usability of your contact page', 'wordpress-seo' ),
			),
		)
	)
);

// Add Yoast WooCommerce SEO when WooCommerce is active.
if ( class_exists( 'Woocommerce' ) ) {
	$extensions->add(
		'wpseo-woocommerce',
		new WPSEO_Extension(
			array(
				'buyUrl'     => WPSEO_Shortlinker::get( 'https://yoa.st/zr' ),
				'infoUrl'    => WPSEO_Shortlinker::get( 'https://yoa.st/zq' ),
				'title'      => 'Yoast WooCommerce SEO',
				/* translators: %1$s expands to Yoast SEO */
				'desc'       => sprintf( __( 'Seamlessly integrate WooCommerce with %1$s and get extra features!', 'wordpress-seo' ), 'Yoast SEO' ),
				'image'      => plugins_url( 'images/extensions-woo.png', WPSEO_FILE ),
				'benefits'   => array(
					sprintf( __( 'Improve sharing on Pinterest', 'wordpress-seo' ) ),

					/* translators: %1$s expands to Yoast, %2$s expands to WooCommerce */
					sprintf( __( 'Use %1$s breadcrumbs instead of %2$s ones', 'wordpress-seo' ), 'Yoast', 'WooCommerce' ),

					/* translators: %1$s expands to Yoast SEO, %2$s expands to WooCommerce */
					sprintf( __( 'A seamless integration between %1$s and %2$s', 'wordpress-seo' ), 'Yoast SEO', 'WooCommerce' ),
				),
				'buy_button' => 'WooCommerce SEO',
			)
		)
	);
}
?>

<div class="wrap yoast wpseo_table_page">

	<h1 id="wpseo-title" class="yoast-h1"><?php
		/* translators: %1$s expands to Yoast SEO */
		printf( __( '%1$s Extensions', 'wordpress-seo' ), 'Yoast SEO' );
		?></h1>

	<div id="extensions">
		<section class="yoast-seo-premium-extension">
			<?php
			$extension = $extensions->get( 'wordpress-seo-premium' );
			$extensions->remove( 'wordpress-seo-premium' );
			?>
			<h2><?php
				/* translators: %1$s expands to Yoast SEO Premium */
				printf( __( '%1$s, take your optimization to the next level!', 'wordpress-seo' ), '<span class="yoast-heading-highlight">' . $extension->get_title() . '</span>' );
				?></h2>

			<ul class="yoast-seo-premium-benefits yoast-list--usp">
				<li class="yoast-seo-premium-benefits__item">
					<span class="yoast-seo-premium-benefits__title"><?php _e( 'Redirect manager', 'wordpress-seo' ); ?></span>
					<span class="yoast-seo-premium-benefits__description"><?php _e( 'create and manage redirects from within your WordPress install.', 'wordpress-seo' ); ?></span>
				</li>
				<li class="yoast-seo-premium-benefits__item">
					<span class="yoast-seo-premium-benefits__title"><?php _e( 'Multiple focus keywords', 'wordpress-seo' ); ?></span>
					<span class="yoast-seo-premium-benefits__description"><?php _e( 'optimize a single post for up to 5 keywords.', 'wordpress-seo' ); ?></span>
				</li>
				<li class="yoast-seo-premium-benefits__item">
					<span class="yoast-seo-premium-benefits__title"><?php _e( 'Social previews', 'wordpress-seo' ); ?></span>
					<span class="yoast-seo-premium-benefits__description"><?php _e( 'check what your Facebook or Twitter post will look like.', 'wordpress-seo' ); ?></span>
				</li>
				<li class="yoast-seo-premium-benefits__item">
					<span class="yoast-seo-premium-benefits__title"><?php _e( 'Premium support', 'wordpress-seo' ); ?></span>
					<span class="yoast-seo-premium-benefits__description"><?php _e( 'gain access to our 24/7 support team.', 'wordpress-seo' ); ?></span>
				</li>
			</ul>

			<?php if ( $extension_list->is_installed( $extension->get_title() ) ) : ?>
				<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-installed"><?php _e( 'Installed', 'wordpress-seo' ); ?></div>

				<?php if ( $extensions->is_activated( 'wordpress-seo-premium' ) ) : ?>
					<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-activated"><?php _e( 'Activated', 'wordpress-seo' ); ?></div>
					<a target="_blank" href="https://my.yoast.com" class="yoast-link--license"><?php _e( 'Manage your license on My Yoast', 'wordpress-seo' ); ?></a>
				<?php else : ?>
					<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-not-activated"><?php _e( 'Not activated', 'wordpress-seo' ); ?></div>
					<a target="_blank" href="https://my.yoast.com" class="yoast-link--license"><?php _e( 'Activate your license on My Yoast', 'wordpress-seo' ); ?></a>
				<?php endif; ?>
				</a>

			<?php else : ?>

				<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/zz' ); ?>" class="yoast-button yoast-button--noarrow yoast-button-go-to yoast-button--extension yoast-button--extension-buy">
					<?php
					/* translators: $1$s expands to Yoast SEO Premium */
					printf( __( 'Buy %1$s', 'wordpress-seo' ), $extension->get_title() );
					?></a>

				<a target="_blank" href="<?php WPSEO_Shortlinker::get( 'https://yoa.st/zy' ); ?>" class="yoast-link--more-info"><?php
					printf(
					/* translators: Text between %1$s and %2$s will only be shown to screen readers. %3$s expands to the product name. */
						__( 'More information %1$sabout %3$s%2$s', 'wordpress-seo' ),
						'<span class="screen-reader-text">',
						'</span>',
						$extension->get_title() );
					?></a>
			<?php endif; ?>

			<p><small class="yoast-money-back-guarantee"><?php _e( 'Comes with our 30-day no questions asked money back guarantee', 'wordpress-seo' ); ?></small></p>
		</section>

		<hr class="yoast-hr" aria-hidden="true" />

		<section class="yoast-promo-extensions">
			<h2><?php
				/* translators: %1$s expands to Yoast SEO */
				$yoast_seo_extensions = sprintf( __( '%1$s extensions', 'wordpress-seo' ), 'Yoast SEO' );

				$yoast_seo_extensions = '<span class="yoast-heading-highlight">' . $yoast_seo_extensions . '</span>';

				/* translators: %1$s expands to Yoast SEO extensions */
				printf( __( '%1$s to optimize your site even further', 'wordpress-seo' ), $yoast_seo_extensions );
				?></h2>

			<?php foreach ( $extensions->get_all() as $id => $extension ) : ?>
				<section class="yoast-promoblock secondary yoast-promo-extension">
					<img alt="" width="280" height="147" src="<?php echo esc_attr( $extension->get_image() ); ?>" />
					<h3><?php echo esc_html( $extension->get_title() ); ?></h3>

					<ul class="yoast-list--usp">
						<?php foreach ( $extension->get_benefits() as $benefit ) : ?>
							<li><?php echo esc_html( $benefit ); ?></li>
						<?php endforeach; ?>
					</ul>

					<div class="yoast-button-container">
						<?php if ( $extension_list->is_installed( $extension->get_title() ) ) : ?>
							<div class="yoast-button yoast-button--noarrow  yoast-button--extension yoast-button--extension-installed"><?php _e( 'Installed', 'wordpress-seo' ); ?></div>

							<?php if ( $extensions->is_activated( $id ) ) : ?>
								<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-activated"><?php _e( 'Activated', 'wordpress-seo' ); ?></div>
								<a target="_blank" href="https://yoa.st/13k" class="yoast-link--license"><?php _e( 'Manage your license on My Yoast', 'wordpress-seo' ); ?></a>
							<?php else : ?>
								<div class="yoast-button yoast-button--noarrow  yoast-button--extension yoast-button--extension-not-activated"><?php _e( 'Not activated', 'wordpress-seo' ); ?></div>
								<a target="_blank" href="https://yoa.st/13i" class="yoast-link--license"><?php _e( 'Activate your license on My Yoast', 'wordpress-seo' ); ?></a>
							<?php endif; ?>
						<?php else : ?>
							<a target="_blank" class="yoast-button yoast-button--noarrow yoast-button-go-to  yoast-button--extension yoast-button--extension-buy" href="<?php echo esc_url( $extension->get_buy_url() ); ?>">
								<?php /* translators: %s expands to the product name */ ?>
								<?php printf( __( 'Buy %s', 'wordpress-seo' ), $extension->get_buy_button() ); ?>
							</a>

							<a target="_blank" class="yoast-link--more-info" href="<?php echo esc_url( $extension->get_info_url() ); ?>"><?php
								printf(
								/* translators: Text between %1$s and %2$s will only be shown to screen readers. %3$s expands to the product name. */
									__( 'More information %1$sabout %3$s%2$s', 'wordpress-seo' ),
									'<span class="screen-reader-text">',
									'</span>',
									$extension->get_title() );
								?>
							</a>
						<?php endif; ?>
					</div>
				</section>
			<?php endforeach; ?>
		</section>
	</div>

</div>
