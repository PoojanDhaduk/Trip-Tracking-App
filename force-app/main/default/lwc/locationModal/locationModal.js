import { LightningElement,wire,api ,track} from 'lwc';
import createLocation from '@salesforce/apex/LocationHandler.createLocation';
import editLocation from '@salesforce/apex/LocationHandler.editLocation';
import getLocationDataToEdit from '@salesforce/apex/LocationHandler.getLocationDataToEdit';
import { showMessage } from 'c/serviceComponent';

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
                showMessage(this , 'Please Enter Valid 6 Digit Postal Code Ex: 123456.' , 'Error message' , 'Error');
            }
        }
        if(allowCreation){
            createLocation({ locationName: this.locationName , addressMap: this.address , contactId: this.contactId})
            .then(result => {
            showMessage(this , 'Location Created Successfully' , 'Success message' , 'success');
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
                showMessage(this , 'State/Country Code is NOT AVAILABLE. Please Provide Correct State/Country Code. Ex: IN for India' , 'Error message' , 'Error');
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
                showMessage(this , 'Please Enter Valid 6 Digit Postal Code Ex: 123456.' , 'Error message' , 'Error');
            }
        }
        if(allowEdit){
        editLocation({ locationName: this.locationName , addressMap: this.address , locationId: this.locationId})
        .then(result => {
            showMessage(this , 'Location Updated Successfully' , 'Success message' , 'success');
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
                showMessage(this , 'State/Country Code is NOT AVAILABLE. Please Provide Correct State/Country Code. Ex: IN for India' , 'Error message' , 'Error');
            });
        }
    }
}