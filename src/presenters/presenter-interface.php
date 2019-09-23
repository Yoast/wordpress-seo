<?php

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Models\Indexable;

interface Presenter_Interface {
	public function present( Indexable $indexable );
}
