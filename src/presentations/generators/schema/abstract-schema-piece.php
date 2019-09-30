<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Schema\Context_Helper;
use Yoast\WP\Free\Helpers\Schema\ID_Helper;
use Yoast\WP\Free\Presentations\Generators\Generator_Interface;

abstract class Abstract_Schema_Piece implements Generator_Interface {
	/**
	 * @var Context_Helper
	 */
	protected $context;

	/**
	 * @var ID_Helper
	 */
	protected $id_helper;

	/**
	 * @var Current_Page_Helper
	 */
	protected $current_page_helper;

	public function __construct(
		Context_Helper $context,
		ID_Helper $id_helper,
		Current_Page_Helper $current_page_helper
	) {
		$this->context             = $context;
		$this->id_helper           = $id_helper;
		$this->current_page_helper = $current_page_helper;
	}

	abstract public function generate();

	abstract public function is_needed();
}