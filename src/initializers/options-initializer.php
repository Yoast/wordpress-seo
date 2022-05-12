<?php

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Adds hooks for the options service.
 */
class Options_Initializer implements Initializer_Interface {

	use No_Conditionals;

	/**
	 * Holds the options helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Constructs the options integration.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function initialize() {
		/*
		 * We need to keep track of any change in custom post types and taxonomies to update our option configurations
		 * that expand to public post types / taxonomies.
		 * Clearing the cache will make it so the next options operation re-expands the configurations.
		 */
		\add_action( 'registered_post_type', [ $this->options_helper, 'clear_cache' ] );
		\add_action( 'unregistered_post_type', [ $this->options_helper, 'clear_cache' ] );
		\add_action( 'registered_taxonomy', [ $this->options_helper, 'clear_cache' ] );
		\add_action( 'unregistered_taxonomy', [ $this->options_helper, 'clear_cache' ] );
	}
}
