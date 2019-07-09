import styled from 'styled-components';

import CONSTANTS from '../constants';

const ItineraryListItem = styled.button`
    background-color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.object :
        CONSTANTS.colors.light.object};
    border-style: solid;
    border-color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.heavy :
        CONSTANTS.colors.light.heavy};
    border-radius: .3rem;
    color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.text :
        CONSTANTS.colors.light.text};
    cursor: pointer;
    display: inline-block;
    font-size: 1rem;
    font-weight: 600;
    margin: .5rem auto;
    padding: .3rem .6rem;
    text-align: left;
    width: 20rem;
`

export default ItineraryListItem;