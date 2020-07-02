/* External dependencies */
import PropTypes from "prop-types";
import { Fragment, Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import { Button } from "@yoast/components";
import ErrorWithUrl from "@yoast/components/src/internal/ErrorWithUrl";
import ErrorBoundary from "@yoast/components/src/internal/ErrorBoundary";
import FieldGroup from "@yoast/components/src/field-group/FieldGroup";
// Import required CSS.
import "@yoast/components/src/select/select.css";


const id = "country-selector";

/**
 * Defines how a select option should look.
 */

const selectProps = {
	onChange: PropTypes.func,
};
const selectDefaultProps = {
	onChange: () => {},
};

/**
 * Renders a HTML option based on a name and value.
 *
 * @param {string} name The name of the option.
 * @param {string} value The value of the option.
 *
 * @returns {React.Component} An HTML option.
 */
const Option = ( { name, value } ) => <option key={ value } value={ value }>{ name }</option>;

Option.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
};

/**
 * List of all available databases for the SEMrush API
 * See: https://www.semrush.com/api-analytics/#databases
 * @type {*[]}
 */
const countries = [
	{ value: "tr", name: "Turkey - TR" },
	{ value: "ua", name: "Ukraine - UA" },
	{ value: "us", name: "United States - US" },
	{ value: "vn", name: "Vietnam - VN" },
];


/**
 * The SEMrush Country Selector component.
 */
class SemRushCountrySelector extends Component {
	/**
	 * Constructs the CountrySelector.
	 *
	 * @param {Object} props The props for the CountrySelector.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		// Make sure that both jQuery and select2 are defined on the global window.
		if ( typeof window.jQuery === "undefined" || typeof window.jQuery().select2 === "undefined" ) {
			throw new ErrorWithUrl(
				"Make sure to read our docs about the requirements for the MultiSelect -- COUNTRYSELECTOR.",
				"https://github.com/Yoast/javascript/blob/develop/packages/components/README.md#using-the-multiselect"
			);
		}
		super( props );

		this.state = {
			database: "us",
		};

		this.onChangeHandler = this.onChangeHandler.bind( this );
	}

	/**
	 * Creates a select2 component from the select and listen to the change action.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.select2 = jQuery( `#${ id }` );
		this.select2.select2( { width: "50%", dropdownCssClass: "yoast-select__dropdown" } );
		this.select2.on( "change.select2", this.onChangeHandler );
	}

	/**
	 * Handler for the onChange event.
	 *
	 * @param {object} event The event that was fired.
	 *
	 * @returns {void}
	 */
	onChangeHandler() {
		// It is easier to query the select for the selected options than keep track of them in this component as well.
		const selection = this.select2.select2( "data" ).map( option => option.id );
		// X this.props.onChange( selection );
		this.setState( { database: selection[ 0 ] } );
	}

	/**
	 * Renders the SEMrush Country Selector.
	 *
	 * @returns {React.Element} The SEMrush Country Selector.
	 */
	render() {
		return (
			<Fragment>
				<p>
					<FieldGroup
						htmlFor="country-selector"
						label="Show results for:"
					>
						<select
							id={ id }
							name="country-selector"
							defaultValue={ this.state.database }
						>
							{ countries.map( Option ) }
						</select>
						<Button>{ __( "Change Country", "wordpress-seo" ) }</Button>
					</FieldGroup>
				</p>
			</Fragment>
		);
	}
}

SemRushCountrySelector.propTypes = selectProps;
SemRushCountrySelector.defaultProps = selectDefaultProps;

/**
 * Renders the CountrySelector inside its own ErrorBoundary to prevent errors from bubbling up.
 *
 * @param {object} props The props for the CountrySelector.
 *
 * @returns {React.Component} The CountrySelector wrapped in an ErrorBoundary.
 */
const CountrySelectorWithErrorBoundary = ( props ) => (
	<ErrorBoundary>
		<SemRushCountrySelector { ...props } />
	</ErrorBoundary>
);

CountrySelectorWithErrorBoundary.propTypes = selectProps;
CountrySelectorWithErrorBoundary.defaultProps = selectDefaultProps;

export { CountrySelectorWithErrorBoundary as SemRushCountrySelector };


export default SemRushCountrySelector;

