<?php

namespace Yoast\WP\SEO\Indexables\Application;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * The Cron_Verification_Gate class.
 */
class Cron_Verification_Gate {

	/**
	 * The indexables helper instance.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The constructor.
	 *
	 * @param Indexable_Helper $indexable_helper The indexable helper.
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
