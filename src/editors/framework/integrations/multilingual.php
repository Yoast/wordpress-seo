<?php

namespace Yoast\WP\SEO\Editors\Framework\Integrations;

use Yoast\WP\SEO\Conditionals\Third_Party\Polylang_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\TranslatePress_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\WPML_Conditional;
use Yoast\WP\SEO\Editors\Domain\Integrations\Integration_Data_Provider_Interface;

class Multilingual implements Integration_Data_Provider_Interface {

	/**
	 * @var WPML_Conditional
	 */
	private $wpml_conditional;

	/**
	 * @var Polylang_Conditional
	 */
	private $polylang_conditional;

	/**
	 * @var TranslatePress_Conditional
	 */
	private $translate_press_conditional;

	public function __construct( WPML_Conditional $wpml_conditional, Polylang_Conditional $polylang_conditional, TranslatePress_Conditional $translate_press_conditional ) {
		$this->wpml_conditional            = $wpml_conditional;
		$this->polylang_conditional        = $polylang_conditional;
		$this->translate_press_conditional = $translate_press_conditional;
	}

	/**
	 * @inheritDoc
	 */
	public function is_enabled(): bool {
		return $this->multilingual_plugin_active();
	}

	/**
	 * @inheritDoc
	 */
	public function to_array(): array {
		// TODO: Implement to_array() method.
	}

	/**
	 * @inheritDoc
	 */
	public function to_legacy_array(): array {
		return [ 'multilingualPluginActive' => $this->is_enabled() ];
	}

	/**
	 * Checks whether a multilingual plugin is currently active. Currently, we only check the following plugins: WPML,
	 * Polylang, and TranslatePress.
	 *
	 * @return bool Whether a multilingual plugin is currently active.
	 */
	private function multilingual_plugin_active() {
		$wpml_active           = $this->wpml_conditional->is_met();
		$polylang_active       = $this->polylang_conditional->is_met();
		$translatepress_active = $this->translate_press_conditional->is_met();

		return ( $wpml_active || $polylang_active || $translatepress_active );
	}
}
