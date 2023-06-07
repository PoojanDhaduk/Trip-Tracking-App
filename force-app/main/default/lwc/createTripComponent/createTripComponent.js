import { LightningElement, api } from 'lwc';
import TRIP_DATE from '@salesforce/schema/Trip__c.Trip_Date__c';
import TRIP_MILEAGES from '@salesforce/schema/Trip__c.Mileages__c';
import TRIP_TAGS from '@salesforce/schema/Trip__c.Tags__c';
import TRIP_NOTES from '@salesforce/schema/Trip__c.Notes__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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
        const fields = event.detail.fields;
        fields.Trip_Origin__c = this.originId;
        fields.Trip_Destination__c = this.destinationId;
        fields.Contact__c = this.contactId;
        this.template.querySelector('lightning-record-form').submit(fields);
    }

    //function to fetch the id and store it for further use whenever the location is selected from lookup component.
    getOriginId(event){
        this.originId = event.detail;
        // console.log("origin"+ this.originId);
    }

    //function to fetch the id and store it for further use whenever the location is selected from lookup component.
    getDestinationId(event){
        this.destinationId = event.detail;
        // console.log("destination"+ this.destinationId);
    }

    //TO  SHOW  TOAST EVENT ON SUCCESS
    handleSuccess(){
        const passContactId = new CustomEvent('tripcreation', {
            detail: this.contactId
        });
        this.dispatchEvent(passContactId);

        const event = new ShowToastEvent({
            title: 'Success message',
            message: 'Trip Created Successfully',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
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
            const evt = new ShowToastEvent({
                title: 'No Location Selected',
                message: 'Please Select : From Location',
                variant: 'warning',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }
    }
    openEditDestinationModal(){
        if(this.destinationId!= ''){
            this.showEditDestinationModal = true;
        }
        else{
            const evt = new ShowToastEvent({
                title: 'No Location Selected',
                message: 'Please Select : To Location',
                variant: 'warning',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }
    }
    hideEditOriginModal(){
        this.showEditOriginModal = false;
    }
    hideEditDestinationModal(){
        this.showEditDestinationModal = false;
    }
}