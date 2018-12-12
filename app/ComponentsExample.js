import React from "react";
import styled from "styled-components";

import YoastWarning from "../composites/Plugin/Shared/components/YoastWarning";


const Container = styled.div`
	max-width: 1024px;
	margin: 0 auto;
	padding: 24px 24px 50em;
	box-sizing: border-box;
`;

/**
 * Renders the yoast-component Components Examples.
 *
 * @returns {ReactElement} The Components example container component.
 */
export default class ComponentsExample extends React.Component {
	/**
	 * Renders all the Component examples.
	 *
	 * @returns {ReactElement} The rendered list of the Component examples.
	 */
	render() {
		/* eslint-disable react/jsx-no-target-blank */
		return (
			<Container>
				<h2>Yoast warning</h2>
				<YoastWarning
					message={ [
						"This is a warning message that also accepts arrays, so you can pass links such as ",
						<a
							key="1"
							href="https://yoa.st/metabox-help-cornerstone"
							target="_blank"
						>cornerstone content</a>,
						", for example.",
						<p key="2">This spans to multiple lines.</p>,
					] }
				/>
			</Container>
		);
		/* eslint-enable react/jsx-no-target-blank */
	}
}
