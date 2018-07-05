<?php
/**
 * @var string $properties
 */

$yform = Yoast_Form::get_instance();
?>
<div class="paper tab-block" <?php echo $properties; ?>>

	<?php
	if( $collapsible ) {
		printf(
			'<h2 id="%1$s"><button type="button" class="toggleable-container-trigger" aria-expanded="%4$s">%2$s <span class="toggleable-container-icon dashicons %3$s" aria-hidden="true"></span></button></h2>',
			esc_attr( $title ),
			esc_html( $title ) . $title_after . $help_text,
			$toggle_icon,
			$expanded
		);
	}
	else {
		printf( '<h2>' . esc_html( $title ) . $title_after . $help_text . '</h2>' );
	}

	?>
	<div class="<?php echo esc_attr( $class ); ?>">
		<?php require $view_file; ?>
	</div>


</div>
