<?php

namespace Yoast\WP\SEO\Indexables\Application;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

class Cron_Verification_Gate {

	/**
	 * @var \Yoast\WP\SEO\Helpers\Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Indexable_Helper $indexable_helper ) {
		$this->indexable_helper = $indexable_helper;
	}

	/**
	 * Determine whether cron verification of indexables should be performed.
	 *
	 * @return bool Should cron verification be performed.
	 */
	public function should_verify_on_cron() {
		if ( ! $this->indexable_helper->should_index_indexables() ) {
			return false;
		}

		// The filter supersedes everything when preventing cron verification.
		if ( \apply_filters( 'Yoast\WP\SEO\enable_cron_verification', true ) !== true ) {
			return false;
		}

		return true;
	}
}
