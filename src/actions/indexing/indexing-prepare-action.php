<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use Yoast\WP\SEO\Helpers\Indexing_Helper;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Class Indexing_Prepare_Action.
 *
 * Action for preparing the indexing routine.
 */
class Indexing_Prepare_Action implements LoggerAwareInterface {

	use LoggerAwareTrait;

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Action for preparing the indexing routine.
	 *
	 * @param Indexing_Helper $indexing_helper The indexing helper.
	 */
	public function __construct( Indexing_Helper $indexing_helper ) {
		$this->indexing_helper = $indexing_helper;
		$this->logger          = new NullLogger();
	}

	/**
	 * Prepares the indexing routine.
	 *
	 * @return void
	 */
	public function prepare() {
		$this->logger->info( 'Indexing prepare invoked.' );
		$this->indexing_helper->prepare();
	}
}
