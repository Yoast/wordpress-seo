<?php
/**
 * Final presenter class for the debug close marker.
 *
 * @package Yoast\YoastSEO\Presenters\Debug
 */

namespace Yoast\WP\SEO\Presenters\Debug;

use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Debug_Marker_Close_Presenter
 */
final class Marker_Close_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product;

	/**
	 * Debug_Marker_Close_Presenter constructor.
	 *
	 * @param Product_Helper $product The product helper.
	 */
	public function __construct(
		Product_Helper $product
	) {
		$this->product = $product;
	}

	/**
	 * Returns the debug close marker.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The debug close marker.
	 */
	public function present( Indexable_Presentation $presentation, $output_tag = true ) {
		return \sprintf(
			'<!-- / %s. -->' . PHP_EOL . PHP_EOL,
			\esc_html( $this->product->get_name() )
		);
	}
}
