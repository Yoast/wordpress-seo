import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "yoast-components";
import Banner from "./Banner";

const Container = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	background-color: ${ colors.$color_white };
	width: 100%;
	list-style-type: none;
	box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
`;

const HeaderImage = styled.img`
	width: 100%;
`;

const Content = styled.div`
	margin: 0;
	padding: 18px;
	padding-top: 8px;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;


class Card extends React.Component {
	/**
	 * Returns the header image, either with a link to the course if it is present,
	 * or not if it is not.
	 * @returns {React.Component} the header image
	 */
	getHeaderImage() {
		if ( ! this.props.header ) {
			return null;
		}
		if ( this.props.header.link ) {
			return (
				<a href={ this.props.header.link }>
					<HeaderImage src={ this.props.header.image } alt={ this.props.header.title || "" } />
				</a>
			);
		}
		return <HeaderImage src={ this.props.header.image } alt={ this.props.header.title || "" } />;
	}

	/**
	 * Gets the banner if a banner text is provided.
	 *
	 * @returns {React.Component} the banner or null.
	 */
	getBanner() {
		if ( ! this.props.banner ) {
			return null;
		}
		return (
			<Banner { ...this.props.banner }>
				{ this.props.banner.text }
			</Banner>
		);
	}

	/**
	 * Renders the component.
	 *
	 * @returns {ReactElement} The rendered component.
	 */
	render() {
		return (
			<Container className={ this.props.className } id={ this.props.id }>
				{ this.getHeaderImage() }
				{ this.getBanner() }
				<Content>
					{ this.props.children }
				</Content>
			</Container>
		);
	}
}

export default Card;

export const FullHeightCard = styled( Card )`
	height: 100%;
`;
