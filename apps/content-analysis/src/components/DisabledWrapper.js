import React from "react";
import styled from "styled-components";

const Disabled = styled.div`
	pointer-events: none;
	opacity: 0.5;
`;

export const DisabledWrapper = ( { children, isDisabled = false } ) => {
	if ( isDisabled ) {
		return <Disabled>{ children }</Disabled>;
	}

	return children;
};
