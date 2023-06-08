import { LightningElement , api ,wire} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';

export default class ContactDetailComponent extends LightningElement  {
    @api contactId;
    contactName;
    tabLabel2;
    tabLabel3;
    activeTab = '1';
    isFirstTimeForLocationTab = true;

    //wire method to get details of selected contact to make it dynamic in use
    @wire(getRecord, { recordId: '$contactId', fields: [CONTACT_NAME_FIELD] })
    wiredRecord({error , data}){
      if(data){
        this.contactName = data.fields.Name.value;
        this.tabLabel2 = data.fields.Name.value + "'s Trips";
        this.tabLabel3 = data.fields.Name.value + "'s Locations";
      }
      else if(error){
        console.log(error);
      } 
    }

    handleActivefirst(){
      this.activeTab = '1';
    }

    //functionality to redirect to the trip tab on click of add trip button on the main component
    openTripTab(){
      this.activeTab = '2';
    }
    
    //render the third component contactLocation to refresh location data
    handleActivethird(){
      this.activeTab = '3';
      if(!this.isFirstTimeForLocationTab){
        this.template.querySelector('c-contact-locations').fetchRecords();
      }
      else{
        this.isFirstTimeForLocationTab=false;
      }
    }
}