import { LightningElement, api } from 'lwc';
import TRIP_DATE from '@salesforce/schema/Trip__c.Trip_Date__c';
import TRIP_MILEAGES from '@salesforce/schema/Trip__c.Mileages__c';
import TRIP_TAGS from '@salesforce/schema/Trip__c.Tags__c';
import TRIP_NOTES from '@salesforce/schema/Trip__c.Notes__c';
import { showMessage } from 'c/serviceComponent';

export default class CreateTripComponent extends LightningElement {
    @api contactId;
    originId = '';
    destinationId = '';
    showaddOriginModal=false;
    showaddDestinationModal=false;
    isOriginSelected;
    selectedOriginName;
    isDestinationSelected;
    selectedDestinationName;
    showEditOriginModal;
    showEditDestinationModal;

    fields = [TRIP_DATE, TRIP_MILEAGES, TRIP_TAGS, TRIP_NOTES]; 

    //when user will click on the submit button all the data from the form and two other fields
    //  origin and destination location id will be stored into newly created trip record.
    handleSubmit(event){
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Trip_Origin__c = this.originId;
        fields.Trip_Destination__c = this.destinationId;
        fields.Contact__c = this.contactId;

        if(this.originId == this.destinationId && this.originId != '' && this.destinationId != ''){
            showMessage(this , 'Origin and Destination cannot be same!' , 'Error message' , 'Error');
        }
        else{
            this.template.querySelector('lightning-record-form').submit(fields);
        }
    }

    //function to fetch the id and store it for further use whenever the location is selected from lookup component.
    getOriginId(event){
        this.originId = event.detail;
    }

    //function to fetch the id and store it for further use whenever the location is selected from lookup component.
    getDestinationId(event){
        this.destinationId = event.detail;
    }

    //TO  SHOW  TOAST EVENT ON SUCCESS
    handleSuccess(){
        const passContactId = new CustomEvent('tripcreation', {
            detail: this.contactId
        });
        this.dispatchEvent(passContactId);
        showMessage(this , 'Trip Created Successfully' , 'Success message' , 'success');
    }

    //To hide create trip component when selected on cancle trip component.
    handleCancel(){
        const cancelNew = new CustomEvent('cancelnewtrip', {
            detail: this.contactId
        });
        this.dispatchEvent(cancelNew);
    }

    //To open modal for adding origin and destination locations
    openAddOriginModal(){
        this.showaddOriginModal  = true;
        // console.log("showAddoriginModal" + this.showaddOriginModal);
    }
    
    openAddDestinationModal(){
        this.showaddDestinationModal  = true;
        // console.log("showAddoriginModal" + this.showaddOriginModal);
    }

    //To hide add origin and destination modals
    hideaddOriginModal(event){
        this.showaddOriginModal= false;
        // console.log("showAddoriginModal" + this.showaddOriginModal);
    }

    hideaddDestinationModal(event){
        this.showaddDestinationModal= false;
        // console.log("showAddoriginModal" + this.showaddOriginModal);
    }
    
    setOriginId(event){
        this.isOriginSelected= true;
        this.selectedOriginName = event.detail.Name;
        this.originId = event.detail.Id;
        // console.log(this.selectedOriginName);
    }
    
    setDestinationId(event){
        this.isDestinationSelected = true;
        this.destinationId = event.detail.Id;
        this.selectedDestinationName = event.detail.Name;
        // console.log(this.selectedDestinationName);
    }

    openEditOriginModal(){
        if(this.originId!= ''){
            this.showEditOriginModal = true;
        }
        else{
            showMessage(this , 'Please Select : Origin Location' , 'Success message' , 'Warning');
        }
    }
    openEditDestinationModal(){
        if(this.destinationId!= ''){
            this.showEditDestinationModal = true;
        }
        else{
            showMessage(this , 'Please Select : Destination Location' , 'Success message' , 'Warning');
        }
    }
    hideEditOriginModal(){
        this.showEditOriginModal = false;
    }
    hideEditDestinationModal(){
        this.showEditDestinationModal = false;
    }
}