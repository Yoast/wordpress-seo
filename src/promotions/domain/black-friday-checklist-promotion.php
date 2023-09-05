<?php

namespace Yoast\WP\SEO\Promotions\Domain;

/**
 * Class to manage the Black Friday promotion.
 *
 * @makePublic
 */
class Black_Friday_Checklist_Promotion extends Abstract_Promotion implements Promotion_Interface {

	/**
	 * Class constructor.
	 */
	public function __construct() {
		parent::__construct(
			'black_friday_checklist_promotion',
			new Time_Interval(
				\gmmktime( 11, 00, 00, 9, 19, 2023 ),
				\gmmktime( 11, 00, 00, 11, 25, 2023 )
			)
		);
	}
}
