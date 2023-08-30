<?php

namespace Yoast\WP\SEO\Promotions\Domain;

/**
 * Abstract class for a promotion.
 */
abstract class Abstract_Promotion implements Promotion_Interface{

	private $promotion_name;

	private $time_interval;

	/**
	 * Class constructor.
	 */
	public function __construct( string $promotion_name, Time_Interval $time_interval ) {
		$this->promotion_name = $promotion_name;
		$this->time_interval = $time_interval;
	}

	public function get_promotion_name() {
		return $this->promotion_name;
	}

	public function get_time_interval() {
		return $this->time_interval;
	}

}
