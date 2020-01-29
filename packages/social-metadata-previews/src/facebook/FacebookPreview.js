/* External dependencies */
import React, {Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import FacebookSiteAndAuthorNames from "./FacebookSiteAndAuthorNames";
import FacebookImage from "./FacebookImage";
import FacebookTitle from "./FacebookTitle";
import FacebookDescription from "./FacebookDescription";
import { determineImageProperties } from "../helpers/determineImageProperties"

const FacebookPreviewWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	flex-direction: ${ props => props.mode === 'landscape' ? 'column': 'row'};
	background-color: #f2f3f5;
	max-width: none;
	border: none;
	box-shadow: none;
	border: 1px solid #dddfe2;
	border-radius: 0;
	zoom: 1;
	overflow: hidden;
	position: relative;
	z-index: 0;
	width: 500px;
`;

const OuterTextWrapper = styled.div`
	background-color: #f2f3f5;
    margin: 0;
    padding: 10px 12px;
	position: relative;
	border-bottom: ${ props => props.mode === 'landscape' ? '' : '1px solid #dddfe2'  }
	border-top ${ props => props.mode === 'landscape' ? '' : '1px solid #dddfe2'  };
	border ${ props => props.mode === 'landscape' ? '1px solid #dddfe2' : ''  };
	width: ${ props => checkWidth(props.mode) };
	height: ${ props => checkHeight(props.mode) };
	display: flex;
	flex-direction: column;
	justify-content:center;
`;

let InnerTextWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 136px;
	font-size: 12px;
	margin: 0;
	max-height: 190px;
`; 

const TitleAndDescriptionWrapper = styled.div`
	max-height: 46px;
	overflow: hidden;
`;

/**
 * Checks de height depending on the mode.
 *
 * @param {string} mode The mode. landscape, square, portrait.
 *
 * @returns {string} The height pixels.
 */
const checkHeight = (mode) => {
	switch (mode) {
		case 'landscape':
			return '57px';

		case 'square':
			return '136px';

		case 'portrait':
			return '215px';

		default:
			return '57px';
	}
}

/**
 * Checks de width depending on the mode.
 *
 * @param {string} mode The mode. landscape, square, portrait.
 *
 * @returns {string} The width pixels.
 */
const checkWidth = (mode) => {
	switch (mode) {
		case 'landscape':
			return '474px';

		case 'square':
			return '318px';

		case 'portrait':
			return '318px';

		default:
			return '474px';
	}
}

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
			imageProperties: {
				mode: null,
				height: null,
				width:null,
			},
			status: "loading",
		};
	}

	componentDidMount() {
		return determineImageProperties( this.props.image, "Facebook" ).then( ( imageProperties ) => {
			console.log('imageprops',imageProperties)
			this.setState({
				imageProperties: imageProperties,
				status: "loaded",
			});
		} ).catch( () => {
			this.setState( {
				imageProperties: {
					mode: null,
					height: null,
					width:null,
				},
				status: "errored",
			})
		});
	}

	render() {
		const { imageProperties} = this.state
		return (
			<FacebookPreviewWrapper mode={ imageProperties.mode } >
				<FacebookImage 
					src={ this.props.image } 
					alt={ this.props.alt } 
					imageProperties={ imageProperties } 
					status={this.state.status} 
				/>
					<OuterTextWrapper mode={ imageProperties.mode }>
						<InnerTextWrapper >
							<FacebookSiteAndAuthorNames 
								siteName={ this.props.siteName } 
								authorName={ this.props.authorName } 
								mode={ imageProperties.mode } 
							/>
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
};

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
