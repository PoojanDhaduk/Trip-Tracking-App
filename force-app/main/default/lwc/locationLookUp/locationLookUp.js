import { LightningElement, api } from 'lwc';
import findLocations from '@salesforce/apex/LocationHandler.findLocations';

export default class LocationLookUp extends LightningElement {
    @api label;
    @api selectedIconName = "standard:address";
    @api objectLabel = "Location__c";
    recordData = [];
    @api selectedRecordName;
    @api searchString = "";
    @api selectedRecordId = "";
    @api isValueSelected = false;
    isDropDownVisible = false;

    //handler for calling apex when user change the value in lookup
    handleChange(event) {
        this.isDropDownVisible = true;
        this.searchString = event.target.value;
        findLocations({ locationName: this.searchString })
          .then(result => {
            this.recordData = result;
          })
          .catch(error => {
            console.error('Error:', error); 
        });
    }
    showDropDown(event){
        this.isDropDownVisible = true;
        this.handleChange(event);
    }
    //handler for clicking outside the selection panel
    handleBlur() {
        this.isDropDownVisible = false;
        this.recordData = [];
    }

    //handle the click inside the search panel to prevent it getting closed
    handleListClick(event) {
        this.isValueSelected = true;
        this.isDropDownVisible = false;
        this.selectedRecordName = event.currentTarget.dataset.value;
        this.selectedRecordId = event.currentTarget.dataset.id;

        const passRecordId = new CustomEvent('selectedrecord', {
            detail: this.selectedRecordId
        });
        this.dispatchEvent(passRecordId);

    }

    //handler for deselection of the selected item
    handleCommit() {
        this.isValueSelected = false; 
        this.selectedRecordId = '';
        const passRecordId = new CustomEvent('selectedrecord', {
            detail: this.selectedRecordId
        });
        this.dispatchEvent(passRecordId);
        console.log('deselected value');
    }
    
    //to close the search panel when clicked outside of search input
    handleInputBlur(event) {
    }
}