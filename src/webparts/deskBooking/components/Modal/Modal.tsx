import * as React from "react";
import {IconButton} from 'office-ui-fabric-react/lib/components/Button'
import {Modal} from 'office-ui-fabric-react/lib/components/Modal'
import {loadTheme} from 'office-ui-fabric-react/lib/Styling'
import {ContextualMenu} from 'office-ui-fabric-react/lib/components/ContextualMenu'
import {initializeIcons} from 'office-ui-fabric-react/lib/Icons'
import './Modal.css'
import {abmTheme} from '../Constants/Theme'

initializeIcons();
const theme = loadTheme(abmTheme);
const iconButtonStyles = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px'
    },
    rootHovered: {
        color: theme.palette.neutralDark
    }
};

function AbmModal(props: {
  body: JSX.Element,
  showModal: boolean
  dismissModal: () => void,
  heading: string  
}){
  return (
    <Modal isModeless={true} isOpen={props.showModal} containerClassName="abm-ModalContainer" dragOptions={{moveMenuItemText: 'Move', closeMenuItemText: 'Close', menu: ContextualMenu}}>
        <div className="abm-ModalHeading">
            <span>{props.heading}</span>
              <IconButton
                styles={iconButtonStyles}
                iconProps={{ iconName: 'Cancel' }}
                ariaLabel="Close popup modal"
                onClick={props.dismissModal}
              />
        </div>
        <div className="abm-ModalBody">
            {props.body}
        </div>        
    </Modal>
  ) 
}

export default AbmModal;