<?php

namespace Yoast\WP\SEO\Analystics\Framework;

use Yoast\WP\SEO\Actions\Indexing\Abstract_Indexing_Action;

class Missing_Indexables_Collector implements \WPSEO_Collection {

	/**
	 * @var array<Abstract_Indexing_Action> $indexation_actions all the indexation actions.
	 */
	private $indexation_actions;

	public function __construct( Abstract_Indexing_Action  ...$indexation_actions ) {
		$this->indexation_actions = $indexation_actions;
	}

	public function get() {

	}


}
