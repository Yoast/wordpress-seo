import Collapsible from "./SidebarCollapsible";
import { __ } from "@wordpress/i18n";
import { Component } from "@wordpress/element";

class Select2 extends Component {
	componentDidMount() {
		this.select2 = jQuery( "#asdasdsasdsdf" );
		this.select2.select2( { width: "100%" } );
		this.select2.on( "change", e => {
			console.log( e.target.options );
		} );
	}

	render() {
		return (
			<select id="asdasdsasdsdf" onBlur={ alert } className="js-example-basic-multiple" name="states[]">
				<option value="AL">Alabama</option>
				<option value="WY">Wyoming</option>
			</select>
		);
	}
}

class AdvancedSettings extends Component {
	render() {
		return (
			<Collapsible id={ "yoast-cornerstone-collapsible" } title={ __( "Advanced", "wordpress-seo" ) }>
				<Select2 />
			</Collapsible>
		);
	}
}

export default AdvancedSettings;
