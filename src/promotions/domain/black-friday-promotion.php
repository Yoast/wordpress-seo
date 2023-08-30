<?php

namespace Yoast\WP\SEO\Promotions\Domain;

/**
 * Class to manage the Black Friday promotion.
 *
 * @makePublic
 */
class Black_Friday_Promotion extends Abstract_Promotion implements Promotion_Interface {

	/**
	 * Class constructor.
	 */
	public function __construct() {
		parent::__construct(
			'black_friday_2023',
			new Time_Interval( \gmmktime( 11, 00, 00, 12, 23, 2021 ), \gmmktime( 11, 00, 00, 12, 28, 2025 ) )
		);
	}
}
