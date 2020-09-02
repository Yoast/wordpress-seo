const { default: DiviHelper } = require("./compatibility/diviHelper");

console.log( 'hoi' );
console.log( document );

const slot = document.createElement( 'div' );
slot.classList.add( [ 'elementor-component-tab', 'elementor-panel-navigation-tab' ] );
slot.innerHTML = '<p>tadaaa</p>';
document.getElementById( 'body' ).appendChild( slot );
// document.getElementById( 'elementor-panel-elements-navigation' ).appendChild( slot );
