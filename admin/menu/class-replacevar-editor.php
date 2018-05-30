<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Menu
 */

/**
 * Registers the regular admin menu and network admin menu implementations.
 */
class WPSEO_Replacevar_Editor {
	private $yform;
	private $title;
	private $description;

	public function __construct( $yform, $title, $description ) {
		$this->yform = $yform;
		$this->title = $title;
		$this->description = $description;
	}

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function render() {
		$this->yform->hidden( $this->title, $this->title );
		$this->yform->hidden( $this->description, $this->description );
		?>
			<div
				data-react-replacevar
				data-react-replacevar-title="<?php echo esc_attr( $this->title ) ?>"
				data-react-replacevar-metadesc="<?php echo esc_attr( $this->description ) ?>"
			></div>
		<?php
	}
}
