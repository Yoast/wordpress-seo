<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WordProof\SDK\Helpers\PostMeta;
use WordProof\SDK\WordPressSDK;
use Yoast\WP\SEO\Conditionals\Third_Party\WordProof_Plugin_Inactive_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * WooCommerce integration.
 */
class WordProof implements Integration_Interface
{

	protected $post_meta_key = "_yoast_wpseo_wordproof_timestamp";
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
		\add_filter('wordproof_timestamp_show_certificate', [$this, 'show_certificate'], 10, 2);
	}

	public function sdk_setup()
	{
		WordPressSDK::getInstance('yoast', 'staging')
			->certificate()
			->initialize();
	}

	public function add_post_meta_key($array)
	{
		$array[] = $this->post_meta_key;
		return $array;
	}

	public function show_certificate($value, $post)
	{
		ray($value, $post->ID, PostMeta::get($post->ID, $this->post_meta_key))->blue();
		if (!$value)
			return $value;

		return boolval(PostMeta::get($post->ID, $this->post_meta_key));
	}
}
