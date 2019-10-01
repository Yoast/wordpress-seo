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

/**
 * Class Abstract_Schema_Piece
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */
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

	/**
	 * Abstract_Schema_Piece constructor.
	 *
	 * @param Context_Helper      $context             A value object with context variables.
	 * @param ID_Helper           $id_helper           A helper to retrieve Schema ID's.
	 * @param Current_Page_Helper $current_page_helper A helper to determine current page.
	 */
	public function __construct(
		Context_Helper $context,
		ID_Helper $id_helper,
		Current_Page_Helper $current_page_helper
	) {
		$this->context             = $context;
		$this->id_helper           = $id_helper;
		$this->current_page_helper = $current_page_helper;
	}

	/**
	 * Generate the schema piece.
	 *
	 * @return mixed
	 */
	abstract public function generate();

	/**
	 * Determine whether the schema piece is needed.
	 *
	 * @return bool
	 */
	abstract public function is_needed();
}
