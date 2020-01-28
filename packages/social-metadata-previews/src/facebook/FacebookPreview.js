/* External dependencies */
import React, {Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import FacebookSiteAndAuthorNames from "./FacebookSiteAndAuthorNames";
import FacebookImage from "./FacebookImage";
import FacebookTitle from "./FacebookTitle";
import FacebookDescription from "./FacebookDescription";

const FacebookPreviewWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	background-color: #F2F3F5;
	max-width: none;
	border: none;
	box-shadow: none;
	border: 1px solid #dddfe2;
	border-radius: 0;
	zoom: 1;
	overflow: hidden;
	position: relative;
	z-index: 0;

	width:500px;
`;

const OuterTextWrapper = styled.div`
	background-color: #f2f3f5;
    border-bottom: 1px solid #dddfe2;
    margin: 0;
    padding: 10px 12px;
	position: relative;
	
	width: 500px;
	height: 57px;
`;

const InnerTextWrapper = styled.div`
	max-height: 190px;
`;

const TitleAndDescriptionWrapper = styled.div`
`;

/**
 * Renders FacebookPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
class FacebookPreview extends Component {
	/**
	 * The constructor.
	 *
	 * @param {Object} props The component's props.
	 */
	constructor( props ) {
		super( props );
		this.state = {
			imageType:''
		};
	}

	getImageMode (imageMode) {
		this.setState({ imageType: imageMode })
	}

	render() {
		return (
			<FacebookPreviewWrapper>
				<FacebookImage src={ this.props.image } alt={ this.props.alt } getImageMode={() => this.getImageMode}  />
					<OuterTextWrapper>
						<InnerTextWrapper>
							<FacebookSiteAndAuthorNames siteName={ this.props.siteName } authorName={ this.props.authorName } />
								<TitleAndDescriptionWrapper>
									<FacebookTitle title={ this.props.title } />
									<FacebookDescription>
										{ this.props.description }
									</FacebookDescription>
								</TitleAndDescriptionWrapper>
						</InnerTextWrapper>
					</OuterTextWrapper>
			</FacebookPreviewWrapper>
		);
};

}
FacebookPreview.propTypes = {
	siteName: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	authorName: PropTypes.string,
	description: PropTypes.string,
	image: PropTypes.string.isRequired,
	alt: PropTypes.string,
};

FacebookPreview.defaultProps = {
	authorName: "",
	description: "",
	alt: "",
};


export default FacebookPreview;
