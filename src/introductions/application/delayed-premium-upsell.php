<?php


namespace Yoast\WP\SEO\Introductions\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Introductions\Domain\Introduction_Interface;

/**
 * Represents the Premium upsell that shows on Yoast SEO pages after a delay.
 */
class Delayed_Premium_Upsell implements Introduction_Interface {

	use Current_Page_Trait;

	public const ID         = 'delayed-premium-upsell';
	public const DELAY_DAYS = 14;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Delayed_Premium_Upsell constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the ID.
	 *
	 * @return string The ID.
	 */
	public function get_id(): string {
		return self::ID;
	}

	/**
	 * Returns the name of the introduction.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO Premium 21.6', 'Please use get_id() instead' );

		return self::ID;
	}

	/**
	 * Returns the requested pagination priority. Lower means earlier.
	 *
	 * @return int The priority.
	 */
	public function get_priority(): int {
		return 20;
	}

	/**
	 * Returns whether this introduction should show.
	 *
	 * @return bool Whether this introduction should show.
	 */
	public function should_show(): bool {
		if ( ! $this->is_on_yoast_page( [ 'wpseo_page_settings' ] ) ) {
			return false;
		}

		return $this->should_show_after_delay();
	}

	/**
	 * Determines if the introduction should show based on the selff:DELAY_DAY delay from installation or update.
	 *
	 * @return bool Whether the introduction should show after the delay.
	 */
	private function should_show_after_delay(): bool {
		$delay        = ( self::DELAY_DAYS * \DAY_IN_SECONDS );
		$current_time = \time();

		$last_updated_on = $this->options_helper->get( 'last_updated_on' );
		if ( ( $current_time - $last_updated_on ) >= $delay ) {
			return true;
		}

		$first_activated_on = $this->options_helper->get( 'first_activated_on' );
		if ( ( $current_time - $first_activated_on ) >= $delay ) {
			return true;
		}

		return false;
	}
}
