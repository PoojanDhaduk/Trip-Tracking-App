import { LightningElement, api, wire } from 'lwc';
import getSelectedContact from '@salesforce/apex/GetContactHandler.getSelectedContact';
import { showMessage } from 'c/serviceComponent';


export default class ContactInfo extends LightningElement {
    @api fieldList = ["Name", "Phone", "Email"];
    @api contactId;
    @api objectApiName = "Contact";
    @api addressCombination;
    toggleViewAndEdit = true;
    editRightSection = false;

    //getting address when the component is firstly inserted into DOM with connected call back.
    connectedCallback() {
        this.getfulladdress();
    }

    // this function wil toggle between view and edit layout whenever it is called from html file
    toggleView() {
        if (this.toggleViewAndEdit == true) {
            this.toggleViewAndEdit = false;
        }
        else {
            this.toggleViewAndEdit = true;
        }
    }

    //function to toggle on right side edit section
    toggleRightSectionView() {
        if (this.editRightSection == true) {
            this.editRightSection = false;
        }
        else {
            this.editRightSection = true;
        }
    }

    //this function will return combination of address using imparative aoex method
    getfulladdress() {
        getSelectedContact({ contactId: this.contactId })
            .then(data => {
                if (data.MailingAddress.city && data.MailingAddress.state && data.MailingAddress.postalCode) {
                    this.addressCombination = data.MailingAddress.city + " " + data.MailingAddress.state + " " + data.MailingAddress.postalCode;
                }
                else {
                    this.addressCombination = "No Address Avaiable";
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    
    // function to display success message on updation of the record
    handleSuccess() {
        this.getfulladdress();
        this.toggleViewAndEdit = true;
        this.editRightSection = false;
        showMessage(this , 'Record Updated Successfully' , 'Success message' , 'success');
    }

    // function to handle errors 
    handleError(event) {
        showMessage(this , event.detail.detail , 'Error message' , 'Error');
    }
}