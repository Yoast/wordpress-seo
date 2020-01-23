import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";
import { makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import Banner from "./CardBanner";

const Container = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	background-color: ${ colors.$color_white };
	width: 100%;
	box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
`;

const HeaderImage = styled.img`
	width: 100%;
	vertical-align: bottom;
`;

const Content = styled.div`
	padding: 12px 16px;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;

const HeaderLink = styled.a`
	text-decoration: none;
	color: ${ colors.$color_pink_dark };
	/* IE11 bug header image height see https://github.com/philipwalton/flexbugs#flexbug-5 */
	overflow: hidden;

	&:hover,
	&:focus,
	&:active {
		text-decoration: underline;
		color: ${ colors.$color_pink_dark };
	}

	&:focus,
	&:active {
		box-shadow: none;
	}
`;

const HeaderTitle = styled.h2`
	margin: 16px 16px 0 16px;
	font-weight: 400;
	font-size: 1.5em;
	line-height: 1.2;
	color: currentColor;
`;

const OutboundHeaderLink = makeOutboundLink( HeaderLink );

/**
 * Card component.
 */
class Card extends React.Component {
	/**
	 * Returns the header image and title, with a link if provided.
	 *
	 * @returns {React.Component} The header image.
	 */
	getHeader() {
		if ( ! this.props.header ) {
			return null;
		}

		if ( this.props.header.link ) {
			return (
				<OutboundHeaderLink href={ this.props.header.link }>
					<HeaderImage src={ this.props.header.image } alt="" />
					<HeaderTitle>{ this.props.header.title }</HeaderTitle>
				</OutboundHeaderLink>
			);
		}

		return (
			<Fragment>
				<HeaderImage src={ this.props.header.image } alt="" />;
				<HeaderTitle>{ this.props.header.title }</HeaderTitle>
			</Fragment>
		);
	}

	/**
	 * Gets the banner if a banner text is provided.
	 *
	 * @returns {React.Component} The banner or null.
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
				{ this.getHeader() }
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

Card.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string,
	header: PropTypes.shape( {
		title: PropTypes.string,
		image: PropTypes.string.isRequired,
		link: PropTypes.string,
	} ),
	banner: PropTypes.shape( {
		text: PropTypes.string.isRequired,
		textColor: PropTypes.string,
		backgroundColor: PropTypes.string,
	} ),
	children: PropTypes.any,
};

Card.defaultProps = {
	className: "",
	id: "",
	header: null,
	banner: null,
	children: null,
};
