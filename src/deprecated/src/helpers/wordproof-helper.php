<?php

namespace Yoast\WP\SEO\Helpers;

use ReflectionClass;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\Wordproof_Plugin_Inactive_Conditional;
use Yoast\WP\SEO\Conditionals\User_Can_Publish_Posts_And_Pages_Conditional;

/**
 * A helper object for WordProof integration.
 *
 * @deprecated 22.10
 * @codeCoverageIgnore
 */
class Wordproof_Helper {

	/**
	 * Holds the Current Page helper instance.
	 *
	 * @var Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * Holds the WooCommerce helper instance.
	 *
	 * @var Woocommerce_Helper
	 */
	protected $woocommerce;

	/**
	 * Holds the Options Page helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * WordProof_Helper constructor.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @param Current_Page_Helper $current_page The current page helper.
	 * @param Woocommerce_Helper  $woocommerce  The woocommerce helper.
	 * @param Options_Helper      $options      The options helper.
	 */
	public function __construct( Current_Page_Helper $current_page, Woocommerce_Helper $woocommerce, Options_Helper $options ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		$this->current_page = $current_page;
		$this->woocommerce  = $woocommerce;
		$this->options      = $options;
	}

	/**
	 * Remove site options after disabling the integration.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return bool Returns if the options are deleted
	 */
	public function remove_site_options() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		return \delete_site_option( 'wordproof_access_token' )
			&& \delete_site_option( 'wordproof_source_id' );
	}

	/**
	 * Returns if conditionals are met. If not, the integration should be disabled.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @param bool $return_conditional If the conditional class name that was unmet should be returned.
	 *
	 * @return bool|string Returns if the integration should be disabled.
	 */
	public function integration_is_disabled( $return_conditional = false ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		$conditionals = [ new Non_Multisite_Conditional(), new Wordproof_Plugin_Inactive_Conditional() ];

		foreach ( $conditionals as $conditional ) {
			if ( ! $conditional->is_met() ) {

				if ( $return_conditional === true ) {
					return ( new ReflectionClass( $conditional ) )->getShortName();
				}

				return true;
			}
		}

		return false;
	}

	/**
	 * Returns if the WordProof integration toggle is turned on.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return bool Returns if the integration toggle is set to true if conditionals are met.
	 */
	public function integration_is_active() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		if ( $this->integration_is_disabled() ) {
			return false;
		}

		return $this->options->get( 'wordproof_integration_active', true );
	}

	/**
	 * Return if WordProof should be active for this post editor page.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return bool Returns if WordProof should be active for this page.
	 */
	public function is_active() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		$is_wordproof_active = $this->integration_is_active();

		if ( ! $is_wordproof_active ) {
			return false;
		}

		$user_can_publish = ( new User_Can_Publish_Posts_And_Pages_Conditional() )->is_met();

		if ( ! $user_can_publish ) {
			return false;
		}

		return ( $this->current_page->current_post_is_privacy_policy() || $this->woocommerce->current_post_is_terms_and_conditions_page() );
	}
}
