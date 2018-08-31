/* global window */
/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { Fragment } from "@wordpress/element";
import get from "lodash/get";
import values from "lodash/values";

/* Internal dependencies */
import PrimaryTaxonomyPicker from "./PrimaryTaxonomyPicker";

/**
 * Gets the display name for a react component.
 *
 * @param {ReactComponent} Component The react component.
 *
 * @returns {string} The component's display name.
 */
function getDisplayName( Component ) {
	return (
		Component.displayName ||
		Component.name ||
		( typeof Component === "string" && Component.length > 0
			? Component
			: "Unknown" )
	);
}

class PrimaryTaxonomyFilter extends React.Component {
	constructor( props ) {
		super( props );

		if ( ! PrimaryTaxonomyFilter.taxonomies || ! PrimaryTaxonomyFilter.primaryTaxonomies ) {
			PrimaryTaxonomyFilter.taxonomies = get( window.wpseoPrimaryCategoryL10n, "taxonomies", {} );
			PrimaryTaxonomyFilter.primaryTaxonomies = values( this.taxonomies ).map(
				taxonomy => taxonomy.name
			);
		}

		this.state = {
			fallbackToOriginalComponent: false,
		};
	}

	/**
	 * Fall back to the original component if an error occurs in the PrimaryTaxonomyPicker.
	 *
	 * @returns {void}
	 */
	componentDidCatch() {
		const { OriginalComponent } = this.props;
		console.warn(
			`An error occurred in ${ getDisplayName( PrimaryTaxonomyFilter ) },` +
			`falling back to ${ getDisplayName( OriginalComponent ) }.`
		);
		this.setState( { fallbackToOriginalComponent: true } );
	}

	/**
	 * Determine whether the taxonomy has primary term support.
	 *
	 * @returns {boolean} Whether or not the taxonomy has primary term support.
	 */
	taxonomyHasPrimaryTermSupport() {
		return PrimaryTaxonomyFilter.primaryTaxonomies.includes( this.props.slug );
	}

	/**
	 * Renders the PrimaryTaxonomyFilter component.
	 *
	 * @returns {ReactElement} The rendered PrimaryTaxonomyFilter.
	 */
	render() {
		const {
			slug,
			OriginalComponent,
		} = this.props;

		if (
			( ! this.taxonomyHasPrimaryTermSupport() ) ||
			this.state.fallbackToOriginalComponent
		) {
			return <OriginalComponent { ...this.props } />;
		}

		const taxonomy = PrimaryTaxonomyFilter.taxonomies[ slug ];

		return (
			<Fragment>
				<OriginalComponent { ...this.props } />
				<PrimaryTaxonomyPicker taxonomy={ taxonomy } />
			</Fragment>
		);
	}
}

PrimaryTaxonomyFilter.propTypes = {
	OriginalComponent: PropTypes.func.isRequired,
	slug: PropTypes.string.isRequired,
};

export default PrimaryTaxonomyFilter;
