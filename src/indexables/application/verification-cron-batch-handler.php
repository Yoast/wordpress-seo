<?php

namespace Yoast\WP\SEO\Indexables\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;

class Verification_Cron_Batch_Handler {


	/**
	 * @var Options_Helper
	 */
	protected $options_helper;

	public function __construct(Options_Helper $options_helper) {
		$this->options_helper = $options_helper;
	}

	public function get_current_post_indexables_batch(  ):int {
		return $this->options_helper->get( 'cron_verify_post_indexables_last_batch', 0 );
	}

	public function set_current_post_indexables_batch( int $batch_count ) {
		$this->options_helper->set('cron_verify_post_indexables_last_batch',$batch_count);
	}
}
