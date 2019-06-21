import styled from 'styled-components';

import CONSTANTS from './../constants';

const AddButton = styled.button`
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
    font-size: 1rem;
    font-weight: 600;
    margin: .5rem;
    padding: .3rem .6rem;
    ${props => props.stretch ? '' : 'width: 9rem;'}
`

export default AddButton;