/* global window */
/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { Fragment } from "@wordpress/element";
import get from "lodash/get";
import values from "lodash/values";
import { __, sprintf } from "@wordpress/i18n";
import { ClipboardButton } from "@wordpress/components";
import styled from "styled-components";

/* Internal dependencies */
import PrimaryTaxonomyPicker from "./PrimaryTaxonomyPicker";

let taxonomyData = null,
	taxonomiesWithPrimaryTermSupport = null;

const ErrorContainer = styled.div`
	margin: 16px 0 8px;
`;

class PrimaryTaxonomyFilter extends React.Component {
	constructor() {
		super();

		if ( ! taxonomyData || ! taxonomiesWithPrimaryTermSupport ) {
			taxonomyData = get( window.wpseoPrimaryCategoryL10n, "taxonomies", {} );
			taxonomiesWithPrimaryTermSupport = values( taxonomyData ).map(
				taxonomy => taxonomy.name
			);
		}

		this.state = {
			fallbackToOriginalComponent: false,
			error: null,
		};
	}

	/**
	 * Falls back to the original component if an error occurs in the PrimaryTaxonomyPicker.
	 *
	 * @param {string} error The occurred error.
	 *
	 * @returns {void}
	 */
	componentDidCatch( error ) {
		this.setState( { fallbackToOriginalComponent: true, error } );
	}

	/**
	 * Determines whether the taxonomy has primary term support.
	 *
	 * @returns {boolean} Whether or not the taxonomy has primary term support.
	 */
	taxonomyHasPrimaryTermSupport() {
		return taxonomiesWithPrimaryTermSupport.includes( this.props.slug );
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
			return (
				<Fragment>
					<OriginalComponent { ...this.props } />
					<div>
						<ErrorContainer>
							{ sprintf(
								/* Translators: %s expands to Yoast SEO. */
								__( "An error occurred loading the %s primary taxonomy picker.", "wordpress-seo" ),
								"Yoast SEO"
							) }
						</ErrorContainer>
						<ClipboardButton isLarge text={ this.state.error.stack }>
							{ __( "Copy error", "wordpress-seo" ) }
						</ClipboardButton>
					</div>
				</Fragment>
			);
		}

		return (
			<Fragment>
				<OriginalComponent { ...this.props } />
				<PrimaryTaxonomyPicker taxonomy={ taxonomyData[ slug ] } />
			</Fragment>
		);
	}
}

PrimaryTaxonomyFilter.propTypes = {
	OriginalComponent: PropTypes.func.isRequired,
	slug: PropTypes.string.isRequired,
};

export default PrimaryTaxonomyFilter;
