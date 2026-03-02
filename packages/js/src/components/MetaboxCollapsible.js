import { useEffect } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import styled from "styled-components";

const StyledMetaboxCollapsible = styled( Collapsible )`
	h2 > button {
		padding-left: 24px;
		padding-top: 16px;

		&:hover {
			background-color: #f0f0f0;
		}
	}

	div[class^="collapsible_content"] {
		padding: 24px 0;
		margin: 0 24px;
		border-top: 1px solid rgba(0,0,0,0.2);
	}

`;

/**
 * The MetaboxCollapsible.
 *
 * @param {Object} props The props
 *
 * @returns {React.Component} A MetaboxCollapsible component
 */
const MetaboxCollapsible = ( { initialIsOpen, id, ...rest } ) => {
	useEffect( () => {
		if ( initialIsOpen && id ) {
			document.getElementById( id )?.focus();
		}
	}, [] );

	return <StyledMetaboxCollapsible hasPadding={ true } hasSeparator={ true } initialIsOpen={ initialIsOpen } id={ id } { ...rest } />;
};

export default MetaboxCollapsible;
