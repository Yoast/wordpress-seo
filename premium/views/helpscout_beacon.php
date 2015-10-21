<script>!function(e,o,n){window.HSCW=o,window.HS=n,n.beacon=n.beacon||{};var t=n.beacon;t.userConfig={},t.readyQueue=[],t.config=function(e){this.userConfig=e},t.ready=function(e){this.readyQueue.push(e)},o.config={docs:{enabled:!0,baseUrl:"//yoast.helpscoutdocs.com/"},contact:{enabled:!0,formId:"f9665afe-77cd-11e5-8846-0e599dc12a51"}};var r=e.getElementsByTagName("script")[0],c=e.createElement("script");c.type="text/javascript",c.async=!0,c.src="https://djtflbt20bdde.cloudfront.net/",r.parentNode.insertBefore(c,r)}(document,window.HSCW||{},window.HS||{});</script>

<script type="text/javascript">
	HS.beacon.config( {
		instructions: '<?php
			echo esc_js( __( "Please explain what you're trying to find or do. If something isn't working, please explain what you expect to happen. If you can make a screenshot, please attach it.", 'yoastcom' ) );
			echo ' ';
			echo esc_js( __( "Note: submitting this form also sends us debug info about your server.", 'yoastcom' ) );
		?>',
		icon : 'question',
		color: '#A4286A',
		poweredBy: false,
		translation : <?php echo $translation; ?>
	});
	HS.beacon.ready(function() {
		HS.beacon.identify(<?php echo $identify; ?>);

		<?php if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_xml'  ) : ?>
		HS.beacon.suggest([
			'5375e852e4b03c6512282d5a',
			'5375e110e4b0d833740d5700'
		]);
		<?php endif; ?>
	});

</script>