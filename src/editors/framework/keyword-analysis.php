<?php

namespace Yoast\WP\SEO\Editors\Framework;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Describes how it is determined if the Keyword analysis is turned on.
 */
class Keyword_Analysis implements Analysis_Feature_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Whether this analysis is enabled.
	 *
	 * @return bool Whether this analysis is enabled.
	 */
	public function is_enabled(): bool {
		return $this->is_globally_enabled() && $this->is_user_enabled();
	}

	/**
	 * Whether this analysis is enabled by the user.
	 *
	 * @return bool Whether this analysis is enabled by the user.
	 */
	public function is_user_enabled(): bool {
		return ! \get_the_author_meta( 'wpseo_keyword_analysis_disable', \get_current_user_id() );
	}

	/**
	 * Whether this analysis is enabled globally.
	 *
	 * @return bool Whether this analysis is enabled globally.
	 */
	public function is_globally_enabled(): bool {
		return $this->options_helper->get( 'keyword_analysis_active', true );
	}

	/**
	 * Gets the name.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return 'keywordAnalysis';
	}

	/**
	 * Gets the legacy key.
	 *
	 * @return string The legacy key.
	 */
	public function get_legacy_key(): string {
		return 'keywordAnalysisActive';
	}
}
