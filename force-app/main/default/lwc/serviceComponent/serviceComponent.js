import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const showMessage = ( self , message , title , variant ) => {
    const toastEvent = new ShowToastEvent({
        title : title ,
        message : message ,
        variant : variant
    })
    self.dispatchEvent(toastEvent);
}

export {showMessage}