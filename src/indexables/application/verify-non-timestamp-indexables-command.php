<?php

namespace Yoast\WP\SEO\Indexables\Application;

use Yoast\WP\SEO\Indexables\Domain\Abstract_Indexables_Command;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;

class Verify_Non_Timestamp_Indexables_Command extends Abstract_Indexables_Command {

	public function get_last_batch(): Last_Batch_Count {
		return $this->last_batch_count;
	}
}
