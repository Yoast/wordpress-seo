<?php

namespace Yoast\WP\SEO\Indexables\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;

class Verification_Cron_Batch_Handler {

	/**
	 * @var Options_Helper
	 */
	protected $options_helper;

	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	public function get_current_post_indexables_batch():int {
		return $this->options_helper->get( 'cron_verify_post_indexables_last_batch', 0 );
	}

	public function set_current_post_indexables_batch( int $batch_count ) {
		$this->options_helper->set( 'cron_verify_post_indexables_last_batch', $batch_count );
	}

	public function get_current_non_timestamped_indexables_batch():int {
		return $this->options_helper->get( 'cron_verify_non_timestamped_indexables_last_batch', 0 );
	}

	public function set_current_non_timestamped_indexables_batch( Last_Batch_Count $last_batch_count, Batch_Size $batch_size) {
		$batch_count = $last_batch_count->get_last_batch() + $batch_size->get_batch_size();
		$this->options_helper->set( 'cron_verify_non_timestamped_indexables_last_batch', $batch_count );
	}
}
