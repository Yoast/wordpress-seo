<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WordProof\SDK\WordPressSDK;
use Yoast\WP\SEO\Conditionals\Third_Party\WordProof_Plugin_Inactive_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * WooCommerce integration.
 */
class WordProof implements Integration_Interface
{
	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals()
	{
		return [WordProof_Plugin_Inactive_Conditional::class];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks()
	{
		\add_action('init', [$this, 'sdk_setup'], 11);
		\add_filter('wordproof_timestamp_post_meta_key_overrides', [$this, 'add_post_meta_key']);
	}

	public function sdk_setup()
	{
		WordPressSDK::getInstance('yoast')
			->certificate()
			->initialize();
	}

	public function add_post_meta_key($array)
	{
		$array[] = '_yoast_wpseo_timestamp';
		return $array;
	}
}
