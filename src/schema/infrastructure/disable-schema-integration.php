<?php

namespace Yoast\WP\SEO\Schema\Infrastructure;

use Yoast\WP\SEO\Conditionals\Schema_Disabled_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Handles disabling schema.
 */
class Disable_Schema_Integration implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return string[]
	 */
	public static function get_conditionals() {
		return [ Schema_Disabled_Conditional::class ];
	}

	/**
	 * Registers action hook.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		if ( ! \is_admin() ) {
			// No need to run this on admin pages, which would actually break some functionality in the schema settings page.
			// Specifically, in the schema settings page, we want to be able to understand whether schema has been disabled programmatically too.
			\add_filter( 'wpseo_json_ld_output', [ $this, 'disable_schema_output' ] );
		}
	}

	/**
	 * Turns the schema output off while the Schema Framework setting is disabled.
	 *
	 * The setting is checked again on every call, as it can be enabled after the hook has been registered within the
	 * same request, e.g. by an ability. The filter would otherwise report the graph as turned off by code.
	 *
	 * @param array<string, string>|bool $data The schema data, or `false` when the schema output is turned off.
	 *
	 * @return array<string, string>|bool The unchanged schema data, or `false` when the setting is disabled.
	 */
	public function disable_schema_output( $data ) {
		if ( $this->options_helper->get( 'enable_schema', true ) === false ) {
			return false;
		}

		return $data;
	}
}
