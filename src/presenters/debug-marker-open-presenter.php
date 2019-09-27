<?php
/**
 * Final presenter class for the Open Graph locale.
 *
 * @package Yoast\YoastSEO\Presenters\Site
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Helpers\Product_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Debug_Marker_Open_Presenter
 */
final class Debug_Marker_Open_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Debug_Marker_Close_Presenter constructor.
	 *
	 * @param Product_Helper $product_helper The product helper.
	 */
	public function __construct(
		Product_Helper $product_helper
	) {
		$this->product_helper = $product_helper;
	}

	/**
	 * Returns the debug close marker.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The debug close marker.
	 */
	public function present( Indexable_Presentation $presentation ) {
		return sprintf(
			'<!-- This site is optimized with the %1$s %2$s - https://yoast.com/wordpress/plugins/seo/ -->',
			\esc_html( $this->product_helper->get_name() ),
			/**
			 * Filter: 'wpseo_hide_version' - can be used to hide the Yoast SEO version in the debug marker (only available in Yoast SEO Premium).
			 *
			 * @api bool
			 */
			( ( \apply_filters( 'wpseo_hide_version', false ) && \WPSEO_Utils::is_yoast_seo_premium() ) ? '' : 'v' . \WPSEO_VERSION )
		);
	}
}
