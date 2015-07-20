<?php
/**
 * @package WPSEO\Internals
 */

/**
 * Holder for SEO Rank information
 */
class WPSEO_Rank {

	const BAD = 'bad';
	const POOR = 'poor';
	const OK = 'ok';
	const GOOD = 'good';
	const NO_FOCUS = 'na';
	const NO_INDEX = 'noindex';

	/**
	 * Holds the translation from seo score slug to actual score range
	 *
	 * @var array
	 */
	public static $range = array(
		'bad'  => array(
			'start' => 1,
			'end'   => 34,
		),
		'poor' => array(
			'start' => 35,
			'end'   => 54,
		),
		'ok'   => array(
			'start' => 55,
			'end'   => 74,
		),
		'good' => array(
			'start' => 75,
			'end' => 100,
		),
	);
}
