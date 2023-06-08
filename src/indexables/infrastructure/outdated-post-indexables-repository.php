<?php

namespace Yoast\WP\SEO\Indexables\infrastructure;

use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Indexables\Application\Ports\Outdated_Post_Indexables_Repository_Interface;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Indexables\Domain\Outdated_Post_Indexables_List;
use Yoast\WP\SEO\Indexables\Domain\Plugin_Deactivated_Timestamp;

class Outdated_Post_Indexables_Repository implements Outdated_Post_Indexables_Repository_Interface {

	public function __construct( wpdb $wpdb ) {
	}

	/**
	 * @inheritDoc
	 */
	public function get_outdated_post_indexables(
		Last_Batch_Count $count,
		Plugin_Deactivated_Timestamp $deactivated_timestamp
	): Outdated_Post_Indexables_List {
		$indexable_table = Model::get_table_name( 'Indexable' );
	}
}
