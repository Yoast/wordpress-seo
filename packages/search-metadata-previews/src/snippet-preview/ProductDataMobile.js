import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { round, capitalize } from "lodash";

import { StarRating } from "@yoast/components";

const ProductData = styled.div`
	display: flex;
	margin-top: -16px;
	line-height: 1.6;
`;

const ProductDataCell50 = styled.div`
	flex: 1;
	max-width: 50%;
`;

const ProductDataCell25 = styled.div`
	flex: 1;
	max-width: 25%;
`;

const ProductDataInnerLower = styled.div`
	color: #70757a;
`;

/**
 * Renders ProductData component.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Component} The StarRating Component.
 */
function ProductDataMobile( props ) {
	const { shoppingData } = props;

	return (
		<ProductData>
			{ ( shoppingData.rating > 0 ) &&
				<ProductDataCell50 className="yoast-shopping-data-preview__column">
					<div className="yoast-shopping-data-preview__upper">{ __( "Rating", "wordpress-seo" ) }</div>
					<ProductDataInnerLower className="yoast-shopping-data-preview__lower">
						<span>{ round( ( shoppingData.rating * 2 ), 1 ) }/10 </span>
						<StarRating rating={ shoppingData.rating } />
						<span> ({ shoppingData.reviewCount })</span>
					</ProductDataInnerLower>
				</ProductDataCell50>
			}
			{ ( shoppingData.price ) &&
				<ProductDataCell25 className="yoast-shopping-data-preview__column">
					<div className="yoast-shopping-data-preview__upper">{ __( "Price", "wordpress-seo" ) }</div>
					<ProductDataInnerLower
						className="yoast-shopping-data-preview__lower"
						dangerouslySetInnerHTML={ { __html: shoppingData.price } }
					/>
				</ProductDataCell25>
			}
			{ ( shoppingData.availability ) &&
				<ProductDataCell25 className="yoast-shopping-data-preview__column">
					<div className="yoast-shopping-data-preview__upper">{ __( "Availability", "wordpress-seo" ) }</div>
					<ProductDataInnerLower className="yoast-shopping-data-preview__lower">
						{ capitalize( shoppingData.availability ) }
					</ProductDataInnerLower>
				</ProductDataCell25>
			}
		</ProductData>
	);
}

export default ProductDataMobile;

ProductDataMobile.propTypes = {
	shoppingData: PropTypes.shape( {
		rating: PropTypes.number,
		reviewCount: PropTypes.number,
		availability: PropTypes.string,
		price: PropTypes.string,
	} ).isRequired,
};
