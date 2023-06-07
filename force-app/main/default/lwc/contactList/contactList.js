import { LightningElement } from 'lwc';
import getContacts from '@salesforce/apex/GetContactHandler.getContacts';
import { NavigationMixin } from 'lightning/navigation';

export default class ContactList extends NavigationMixin(LightningElement) {
  contacts = [];
  contactId;
  connectedCallback(){
    getContacts()
    .then(response => {
      this.contacts = response;
    })
    .catch(error => console.log(error));
  }

  //on selection of contact new page will open up with the selected contact details
  showContact(event){
    const clickedElement = event.target;
    const value = clickedElement.getAttribute('data-id');
    this.contactId = value;

    
    let cmpDef = {
      componentDef: "c:contactDetailComponent",
      attributes: {
          contactId: this.contactId
      }
    };
    
    let encodedDef = btoa(JSON.stringify(cmpDef));
    this[NavigationMixin.Navigate]({
        type: "standard__webPage",
        attributes: {
            url: "/one/one.app#" + encodedDef
        }
    });
  }
}














