import { LightningElement ,api} from 'lwc';

export default class ViewTripComponent extends LightningElement {
    @api tripId;
    handleClose(){
        const event = new CustomEvent('closetrip', {
            detail: this.tripId
        });            
        this.dispatchEvent(event);
    }
}