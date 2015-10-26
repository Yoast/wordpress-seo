<?php

class WPSEO_Metabox_Addon_Section extends WPSEO_Metabox_Section {

	public function display_content() {
		?>
		<div id="wpseo-meta-section-addons" class="wpseo-meta-section">
			<div class="wpseo-metabox-tabs-div" >
				<ul class="wpseo-metabox-tabs" id="wpseo-metabox-tabs">
					<?php do_action( 'wpseo_tab_header' ); ?>
				</ul>
			</div>
			<?php do_action( 'wpseo_tab_content' ); ?>
		</div>
	<?php
	}

	protected function has_tabs() {
		return true;
	}
}
