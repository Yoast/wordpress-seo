<?php

namespace Yoast\WP\SEO\Introductions\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Introductions\Domain\Introduction_Interface;

/**
 * Represents the introduction for the AI generate titles and introduction upsell.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Ai_Generate_Titles_And_Descriptions_Introduction_Upsell implements Introduction_Interface {

	use Current_Page_Trait;
	use User_Allowed_Trait;
	use Version_Trait;

	/**
	 * Holds the product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructs the introduction.
	 *
	 * @param Product_Helper $product_helper The product helper.
	 * @param Options_Helper $options_helper The options' helper.
	 */
	public function __construct(
		Product_Helper $product_helper,
		Options_Helper $options_helper
	) {
		$this->product_helper = $product_helper;
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the ID.
	 *
	 * @deprecated 23.1
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_id() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 23.1' );
		return 'ai-generate-titles-and-descriptions-upsell';
	}

	/**
	 * Returns the unique name.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_name() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 21.6', 'Please use get_id() instead' );

		return $this->get_id();
	}

	/**
	 * Returns the requested pagination priority. Lower means earlier.
	 *
	 * @deprecated 23.1
	 * @codeCoverageIgnore
	 *
	 * @return int
	 */
	public function get_priority() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 23.1' );
		return 10;
	}

	/**
	 * Returns whether this introduction should show.
	 *
	 * @deprecated 23.1
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function should_show() {
		// Outdated introduction.
		return false;
	}
}
