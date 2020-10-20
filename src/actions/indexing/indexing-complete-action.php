<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Indexing action to call when the indexing is completed.
 */
class Indexing_Complete_Action {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * Indexing_Complete_Action constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Wraps up the indexing process.
	 *
	 * @return void
	 */
	public function complete() {
		$this->options->set( 'indexation_started', null );
		$this->options->set( 'indexing_reason', '' );
	}
}
