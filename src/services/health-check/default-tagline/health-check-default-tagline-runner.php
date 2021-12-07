<?php

namespace Yoast\WP\SEO\Services\Health_Check\Default_Tagline;

use Yoast\WP\SEO\Services\Health_Check\Health_Check_Runner_Interface;

/**
 * Health_Check_Default_Tagline_Runner
 */
class Health_Check_Default_Tagline_Runner implements Health_Check_Runner_Interface {

	/**
	 * 
	 */
	const DEFAULT_BLOG_DESCRIPTION = 'Just another WordPress site';
	
	/**
	 * has_default_startline
	 *
	 * @var bool
	 */
	private $has_default_startline = true;
	
	/**
	 * run
	 *
	 * @return void
	 */
	public function run() {
		$blog_description         = get_option( 'blogdescription' );

		// We are using the WordPress internal translation.
		$translated_blog_description = __($this->DEFAULT_BLOG_DESCRIPTION, 'default' );

		$this->has_default_startline = $translated_blog_description === $blog_description || self::DEFAULT_BLOG_DESCRIPTION === $blog_description;
	}
	
	/**
	 * is_successful
	 *
	 * @return bool
	 */
	public function is_successful() {
		return !$this->has_default_startline;
	}
}