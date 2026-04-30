<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use Yoast\WP\SEO\Helpers\Indexing_Helper;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Indexing action to call when the indexing is completed.
 */
class Indexing_Complete_Action implements LoggerAwareInterface {

	use LoggerAwareTrait;

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Indexing_Complete_Action constructor.
	 *
	 * @param Indexing_Helper $indexing_helper The indexing helper.
	 */
	public function __construct( Indexing_Helper $indexing_helper ) {
		$this->indexing_helper = $indexing_helper;
		$this->logger          = new NullLogger();
	}

	/**
	 * Wraps up the indexing process.
	 *
	 * @return void
	 */
	public function complete() {
		$this->logger->info( 'Indexing complete invoked.' );
		$this->indexing_helper->complete();
	}
}
