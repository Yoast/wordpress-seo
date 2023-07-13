<?php

namespace Yoast\WP\SEO\Introductions\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Introductions\Domain\Introduction_Interface;

/**
 * Represents the introduction for the AI generate titles and introduction upsell.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @makePublic
 */
class Ai_Generate_Titles_And_Descriptions_Introduction_Upsell implements Introduction_Interface {

	use Current_Page_Trait;
	use Version_Trait;
	use User_Allowed_Trait;

	/**
	 * Holds the product helper.
	 *
	 * @var \Yoast\WP\SEO\Helpers\Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the options' helper.
	 *
	 * @var \Yoast\WP\SEO\Helpers\Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructs the introduction.
	 *
	 * @param \Yoast\WP\SEO\Helpers\Product_Helper $product_helper The product helper.
	 * @param \Yoast\WP\SEO\Helpers\Options_Helper $options_helper The options' helper.
	 */
	public function __construct(
		Product_Helper $product_helper,
		Options_Helper $options_helper
	) {
		$this->product_helper = $product_helper;
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the unique name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'ai-generate-titles-and-descriptions-upsell';
	}

	/**
	 * Returns the requested pagination priority. Lower means earlier.
	 *
	 * @return int
	 */
	public function get_priority() {
		return 10;
	}

	/**
	 * Returns whether this introduction should show.
	 *
	 * @return bool
	 */
	public function should_show() {
		if ( $this->product_helper->is_premium() ) {
			return false;
		}

		if ( $this->options_helper->get( 'previous_version', '' ) === '' ) {
			// The current installation is a new one (not upgraded yet).
			return false;
		}

		if ( ! $this->is_version_between( $this->product_helper->get_version(), '20.11-RC4', '21.1-RC0' ) ) {
			return false;
		}

		if ( ! $this->is_user_allowed( [ 'edit_posts' ] ) ) {
			return false;
		}

		return true;
	}
}
