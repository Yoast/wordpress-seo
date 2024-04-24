<?php

namespace Yoast\WP\SEO\Editors\Framework;

use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Get the groups of metadata for the editor.
 *
 * @makePublic
 */
class Metadata_Groups {

	/**
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Social is enabled.
	 *
	 * @var bool
	 */
	protected $is_social_enabled;

	/**
	 * Should show advanced settings.
	 *
	 * @var bool
	 */
	protected $is_advanced_enabled;

	/**
	 * Integrations_Action constructor.
	 *
	 * @param Options_Helper    $options_helper    The WPSEO options helper.
	 * @param Capability_Helper $capability_helper The capability helper.
	 */
	public function __construct( Options_Helper $options_helper, Capability_Helper $capability_helper ) {
		$this->options_helper      = $options_helper;
		$this->capability_helper   = $capability_helper;
		$this->is_social_enabled   = $this->options_helper->get( 'opengraph', false ) || $this->options_helper->get( 'twitter', false );
		$this->is_advanced_enabled = $this->capability_helper->current_user_can( 'wpseo_edit_advanced_metadata' ) || $this->options_helper->get( 'disableadvanced_meta' ) === false;
	}

	/**
	 * Get list of groups of metadata for a post editor.
	 *
	 * @return array<string> List of metadata groups.
	 */
	public function get_post_metadata_groups(): array {
		$groups = [ 'general', 'schema' ];

		if ( $this->is_advanced_enabled ) {
			$groups[] = 'advanced';
		}

		if ( $this->is_social_enabled ) {
			$groups[] = 'social';
		}

		return $groups;
	}

	/**
	 * Get term metadata groups.
	 *
	 * @return array<string> List of metadata groups.
	 */
	public function get_term_metadata_groups(): array {
		$groups = [ 'content' ];

		if ( $this->is_advanced_enabled ) {
			$groups[] = 'settings';
		}

		if ( $this->is_social_enabled ) {
			$groups[] = 'social';
		}

		return $groups;
	}
}
