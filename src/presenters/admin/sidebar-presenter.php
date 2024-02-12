<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;

/**
 * Presenter class for the Yoast SEO sidebar.
 */
class Sidebar_Presenter extends Abstract_Presenter {

	/**
	 * Presents the sidebar.
	 *
	 * @return string The sidebar HTML.
	 */
	public function present() {
		$title = \__( 'BLACK FRIDAY - 30% OFF', 'wordpress-seo' );

		$assets_uri              = \trailingslashit( \plugin_dir_url( \WPSEO_FILE ) );
		$buy_yoast_seo_shortlink = WPSEO_Shortlinker::get( 'https://yoa.st/jj' );
		\ob_start();
		?>
			<div class="wpseo_content_cell" id="sidebar-container">
				<div id="sidebar" class="yoast-sidebar">
					<div class="wpseo_content_cell_title yoast-sidebar__title">
						<?php
						/* translators: %1$s expands to Yoast */
						\printf( \esc_html__( '%1$s recommendations for you', 'wordpress-seo' ), 'Yoast' );
						?>
					</div>
					<div class="yoast-sidebar__product">
						<figure class="product-image">
							<figure class="product-image">
								<img
									width="75" height="75"
									src="<?php echo \esc_url( $assets_uri . 'packages/js/images/Yoast_SEO_Icon.svg' ); ?>"
									class="attachment-full size-full content-visible"
									alt="Yoast SEO logo"
									loading="lazy"
									decoding="asyc"
									fetchpriority="low"
									sizes="(min-width: 1321px) 75px">
							</figure>
						</figure>
						<?php if ( \YoastSEO()->classes->get( Promotion_Manager::class )->is( 'black-friday-2023-promotion' ) ) : ?>
							<div class="sidebar__sale_banner_container">
								<div class="sidebar__sale_banner">
										<span class="banner_text"><?php echo \esc_html( $title ); ?></span>
								</div>
							</div>
						<?php endif; ?>
						<h2 class="yoast-get-premium-title">
							<?php
							/* translators: %1$s and %2$s expand to a span wrap to avoid linebreaks. %3$s expands to "Yoast SEO Premium". */
							\printf( \esc_html__( '%1$sGet%2$s %3$s', 'wordpress-seo' ), '<span>', '</span>', 'Yoast SEO Premium' );
							?>
						</h2>
						<p>
							<?php
							echo \esc_html__( 'Use AI to generate titles and meta descriptions, automatically redirect deleted pages, get 24/7 support, and much, much more!', 'wordpress-seo' );
							?>
						</p>
						<?php if ( \YoastSEO()->classes->get( Promotion_Manager::class )->is( 'black-friday-2023-promotion' ) ) : ?>
							<div class="sidebar__sale_text">
								<p>
									<?php
									/* translators: %1$s expands to an opening strong tag, %2$s expands to a closing strong tag */
									\printf( \esc_html__( '%1$s SAVE 30%% %2$s on your 12 month subscription', 'wordpress-seo' ), '<strong>', '</strong>' );
									?>
								</p>
							</div>
						<?php endif; ?>
						<p class="plugin-buy-button">
							<a class="yoast-button-upsell" data-action="load-nfd-ctb" data-ctb-id="f6a84663-465f-4cb5-8ba5-f7a6d72224b2" target="_blank" href="<?php echo \esc_url( $buy_yoast_seo_shortlink ); ?>">
								<?php
								if ( \YoastSEO()->classes->get( Promotion_Manager::class )->is( 'black-friday-2023-promotion' ) ) {
									echo \esc_html__( 'Claim your 30% off now!', 'wordpress-seo' );
								}
								else {
									/* translators: %s expands to Yoast SEO Premium */
									\printf( \esc_html__( 'Get %1$s', 'wordpress-seo' ), 'Yoast SEO Premium' );
								}
								?>
								<span aria-hidden="true" class="yoast-button-upsell__caret"></span>
							</a>
						</p>
						<p class="yoast-price-micro-copy">
							<?php
								echo \esc_html__( 'Only $/€/£99 per year (ex VAT)', 'wordpress-seo' );
							?>
							<br />
							<?php
								echo \esc_html__( '30-day money back guarantee.', 'wordpress-seo' );
							?>
						</p>
						<hr class="yoast-upsell-hr" aria-hidden="true">
						<div class="review-container">
							<a href="https://www.g2.com/products/yoast-yoast/reviews" target="_blank" rel="noopener">
								<span class="claim">
									<?php \esc_html_e( 'Read reviews from real users', 'wordpress-seo' ); ?>
								</span>
								<span class="rating">
									<img alt="" loading="lazy" fetchpriority="low" decoding="async" height="22" width="22" src="<?php echo \esc_url( $assets_uri . 'packages/js/images/g2_logo_white_optm.svg' ); ?>">
									<img alt="" loading="lazy" fetchpriority="low" decoding="async" height="20" width="20" src="<?php echo \esc_url( $assets_uri . 'packages/js/images/star-rating-star.svg' ); ?>">
									<img alt="" loading="lazy" fetchpriority="low" decoding="async" height="20" width="20" src="<?php echo \esc_url( $assets_uri . 'packages/js/images/star-rating-star.svg' ); ?>">
									<img alt="" loading="lazy" fetchpriority="low" decoding="async" height="20" width="20" src="<?php echo \esc_url( $assets_uri . 'packages/js/images/star-rating-star.svg' ); ?>">
									<img alt="" loading="lazy" fetchpriority="low" decoding="async" height="20" width="20" src="<?php echo \esc_url( $assets_uri . 'packages/js/images/star-rating-star.svg' ); ?>">
									<img alt="" loading="lazy" fetchpriority="low" decoding="async" height="20" width="20" src="<?php echo \esc_url( $assets_uri . 'packages/js/images/star-rating-half.svg' ); ?>">
									<span class="rating-text">4.6 / 5</span>

								</span>
							</a>
						</div>
					</div>
				</div>
				<div class="yoast-sidebar__section">
					<h2>
						<?php
						\esc_html_e( 'Learn SEO', 'wordpress-seo' );
						?>
					</h2>
					<p>
						<?php
						$academy_shortlink = WPSEO_Shortlinker::get( 'https://yoa.st/3t6' );

						/* translators: %1$s expands to Yoast SEO academy, which is a clickable link. */
						\printf( \esc_html__( 'Want to learn SEO from Team Yoast? Check out our %1$s!', 'wordpress-seo' ), '<a href="' . \esc_url( $academy_shortlink ) . '" target="_blank"><strong>Yoast SEO academy</strong></a>' );
						echo '<br/>';
						\esc_html_e( 'We have both free and premium online courses to learn everything you need to know about SEO.', 'wordpress-seo' );
						?>
					</p>
					<p>
						<a href="<?php echo \esc_url( $academy_shortlink ); ?>" target="_blank">
							<?php
							/* translators: %1$s expands to Yoast SEO academy */
							\printf( \esc_html__( 'Check out %1$s', 'wordpress-seo' ), 'Yoast SEO academy' );
							?>
						</a>
					</p>
				</div>
			</div>
		<?php
		return \ob_get_clean();
	}
}
