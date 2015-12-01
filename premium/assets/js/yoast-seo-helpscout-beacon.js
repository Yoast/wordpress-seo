/* global HS */
/* global wpseoHelpscoutBeaconL10n */
(function(){
	'use strict';

	/* jshint ignore:start */
	!function(e,o,n){window.HSCW=o,window.HS=n,n.beacon=n.beacon||{};var t=n.beacon;t.userConfig={},t.readyQueue=[],t.config=function(e){this.userConfig=e},t.ready=function(e){this.readyQueue.push(e)},o.config={docs:{enabled:!0,baseUrl:"//yoast.helpscoutdocs.com/"},contact:{enabled:!0,formId:"f9665afe-77cd-11e5-8846-0e599dc12a51"}};var r=e.getElementsByTagName("script")[0],c=e.createElement("script");c.type="text/javascript",c.async=!0,c.src="https://djtflbt20bdde.cloudfront.net/",r.parentNode.insertBefore(c,r)}(document,window.HSCW||{},window.HS||{});
	/* jshint ignore:end */

	HS.beacon.config( wpseoHelpscoutBeaconL10n.config );
	HS.beacon.ready(function() {
		HS.beacon.identify( wpseoHelpscoutBeaconL10n.identify );

		HS.beacon.suggest(
			wpseoHelpscoutBeaconL10n.suggest
		);
	});
}());
