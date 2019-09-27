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
 * Class Debug_Marker_Close_Presenter
 */
final class Debug_Marker_Close_Presenter extends Abstract_Indexable_Presenter {

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
			"<!-- / %s. -->\n\n",
			\esc_html( $this->product_helper->get_name() )
		);
	}
}
