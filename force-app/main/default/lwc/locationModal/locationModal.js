import { LightningElement,wire,api ,track} from 'lwc';
import createLocation from '@salesforce/apex/LocationHandler.createLocation';
import editLocation from '@salesforce/apex/LocationHandler.editLocation';
import getLocationDataToEdit from '@salesforce/apex/LocationHandler.getLocationDataToEdit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LocationModal extends LightningElement {
    @api locationId;
    @api contactId;
    @api isAddModalOpen;
    @api isEditModalOpen;
    locationName = '';
    locationId = '';
    address = '';
    locationDataToEdit={};

    connectedCallback(){
        if(this.locationId){
            getLocationDataToEdit({ locationId: this.locationId })
            .then(result => {
                this.locationName = result.Name;
                this.locationDataToEdit = result;
            })
            .catch(error => {
                console.log('Error:', error);
            });
        }
    }
    
    handleLocationNameChange(event) {
        this.locationName = event.target.value;
    }

    handleAddressChange(event) {
        this.address = event.detail;
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        const event = new CustomEvent('closemodal', {
            detail: false
        });

        this.dispatchEvent(event);
    }

    handleCreateRecord() {
        let allowCreation = true;
        if(this.address != ''){
            const regex = /^[0-9]{6}$/g;
            let postalCode = this.address.postalCode;
            if(!postalCode.match(regex)){
                allowCreation = false;
                const e = new ShowToastEvent({
                    title: 'Error message',
                    message: 'Please Enter Valid 6 Digit Postal Code Ex: 123456',
                    variant: 'Error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(e);
            }
        }
        if(allowCreation){
            createLocation({ locationName: this.locationName , addressMap: this.address , contactId: this.contactId})
            .then(result => {
                const e = new ShowToastEvent({
                    title: 'Success message',
                    message: 'Trip Created Successfully',
                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(e);
            this.closeModal();
            this.locationId = result;
            const event = new CustomEvent('locationcreation', {
                detail: {
                    "Id": this.locationId,
                    "Name": this.locationName
                }
            });
            this.dispatchEvent(event);
            })
            .catch(error => {
                console.log('Error:', error);
                const e = new ShowToastEvent({
                    title: 'Error message',
                    message: 'State/Country Code is NOT AVAILABLE. Please Provide Correct State/Country Code. Ex: IN for India',
                    variant: 'Error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(e);
            });
        }
    }

    handleUpdateRecord(){
        let allowEdit = true;
        if(this.address != ''){
            const regex = /^[0-9]{6}$/g;
            let postalCode = this.address.postalCode;
            if(!postalCode.match(regex)){
                allowEdit = false;
                const e = new ShowToastEvent({
                    title: 'Error message',
                    message: 'Please Enter Valid 6 Digit Postal Code Ex: 123456',
                    variant: 'Error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(e);
            }
        }
        if(allowEdit){
        editLocation({ locationName: this.locationName , addressMap: this.address , locationId: this.locationId})
        .then(result => {
            const e = new ShowToastEvent({
                title: 'Success message',
                message: 'Trip Updated Successfully',
                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(e);
            this.closeModal();
            const event = new CustomEvent('locationupdate', {
                detail: {
                    "Id": this.locationId,
                    "Name": this.locationName
                }
            });
            this.dispatchEvent(event);
            })
            .catch(error => {
                console.log('Error:', error);
                const e = new ShowToastEvent({
                    title: 'Error message',
                    message: 'State/Country Code is NOT AVAILABLE. Please Provide Correct State/Country Code.',
                    variant: 'Error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(e);
            });
        }
    }
}