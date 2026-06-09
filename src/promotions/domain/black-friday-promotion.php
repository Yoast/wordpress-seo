<?php

namespace Yoast\WP\SEO\Promotions\Domain;

/**
 * Class to manage the Black Friday promotion.
 */
class Black_Friday_Promotion extends Abstract_Promotion implements Promotion_Interface {

	/**
	 * Class constructor.
	 */
	public function __construct() {
		parent::__construct(
			'black-friday-promotion',
			new Time_Interval( \gmmktime( 10, 00, 00, 11, 26, 2026 ), \gmmktime( 10, 00, 00, 12, 1, 2026 ) ),
		);
	}
}
