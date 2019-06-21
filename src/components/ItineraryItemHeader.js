import styled from 'styled-components';

import CONSTANTS from '../constants';

const ItineraryItemHeader = styled.div`
    background-color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.headerBg :
        CONSTANTS.colors.light.headerBg};
    border: .1rem solid gray;
    border-right: none;
    border-radius: .5rem 0 0 .5rem;
    color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.headerText :
        CONSTANTS.colors.light.headerText};
    display: inline-block;
    font-weight: 700;
    padding-right: .5rem;
    text-align: right;
    width: 7rem;
`;

export default ItineraryItemHeader;