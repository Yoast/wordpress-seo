<?php


namespace Yoast\WP\SEO\Introductions\Application;

use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Domain\Introduction_Interface;

/**
 * Represents the introduction for the AI fix assessments feature.
 */
class Ai_Fix_Assessments_Upsell implements Introduction_Interface {

	use User_Allowed_Trait;

	public const ID = 'ai-fix-assessments-upsell';

	/**
	 * Holds the user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Holds the product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Constructs the introduction.
	 *
	 * @param User_Helper    $user_helper    The user helper.
	 * @param Product_Helper $product_helper The product helper.
	 */
	public function __construct( User_Helper $user_helper, Product_Helper $product_helper ) {
		$this->user_helper    = $user_helper;
		$this->product_helper = $product_helper;
	}

	/**
	 * Returns the ID.
	 *
	 * @return string The ID.
	 */
	public function get_id() {
		return self::ID;
	}

	/**
	 * Returns the name of the introdyction.
	 *
	 * @return string The name.
	 */
	public function get_name() {
		\_deprecated_function( __METHOD__, 'Yoast SEO Premium 21.6', 'Please use get_id() instead' );

		return self::ID;
	}

	/**
	 * Returns the requested pagination priority. Lower means earlier.
	 *
	 * @return int The priority.
	 */
	public function get_priority() {
		return 10;
	}

	/**
	 * Returns whether this introduction should show.
	 *
	 * @return bool Whether this introduction should show.
	 */
	public function should_show() {

		if ( $this->product_helper->is_premium() ) {
			return false;
		}

		// Get the current user ID, if no user is logged in we bail as this is needed for the next checks.
		$current_user_id = $this->user_helper->get_current_user_id();
		if ( $current_user_id === 0 ) {
			return false;
		}

		if ( ! $this->is_user_allowed( [ 'edit_posts' ] ) ) {
			return false;
		}

		return true;
	}
}
