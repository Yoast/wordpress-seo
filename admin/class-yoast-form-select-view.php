<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class for generating the html for the select
 */
class Yoast_Form_Select_View {

	/**
	 * @var Yoast_Form_Select
	 */
	private $select;

	/**
	 * Yoast_Form_Select_View constructor.
	 *
	 * @param Yoast_Form_Select $select The select option that provides the data for the view.
	 */
	public function __construct( Yoast_Form_Select $select ) {
		$this->select = $select;
	}

	/**
	 * Returns the rendered view
	 *
	 * @return string
	 */
	public function get_html() {
		ob_start();

		// Extract it, because we want each value accessible via a variable instead of accessing it as an array.
		extract( $this->select->get_select_values() );

		require( dirname( WPSEO_FILE ) . '/admin/views/form/select.php' );

		$rendered_output = ob_get_contents();
		ob_end_clean();

		return $rendered_output;
	}

	/**
	 * Prints the rendered view.
	 */
	public function print_html() {
		echo $this->get_html();
	}

}
