import styled from 'styled-components';

import CONSTANTS from './../constants';

const AddButton = styled.button`
    background-color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.object :
        CONSTANTS.colors.light.object};
    border-style: none;
    border-radius: .3em;
    color: black;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    margin: .5em;
    padding: .3em .6em;
    width: 12em;
`

export default AddButton;