import { LightningElement, wire, api, track } from 'lwc';
import getRelatedLocations from '@salesforce/apex/LocationHandler.getRelatedLocations';

export default class MyComponent extends LightningElement {
    @api contactId;
    isAddModalOpen = false;
    locationName = '';
    address = {};
    showData = false;
    showPagination = false;
    locationData = [];
    pageWiseData = [];
    currentPage = 1;
    pageSize = 5;
    pageNumbers = [];
    totalrecords;

    connectedCallback() {
        this.fetchRecords();
    }

    //fetchRecords function will give all the location records whenever it is called.
    @api fetchRecords() {
        getRelatedLocations({ contactId: this.contactId })
            .then(data => {
                if (data.length > 0) {
                    this.showData = true;
                    this.showPagination = true;
                    this.locationData = data;
                    this.totalrecords = this.locationData.length;
                    this.createPageWiseData();
                    this.calculatePageNumbers();
                }
                else {
                    this.showData = false;
                }
            })
            .catch(error => {
                console.log('Error:', error);
            });
    }

    //logical methods for pagination from here.
    createPageWiseData() {
        this.pageWiseData = this.locationData.slice((this.currentPage - 1) * this.pageSize, ((this.currentPage - 1) * this.pageSize) + this.pageSize);
    }

    calculatePageNumbers() {
        this.pageNumbers = [];
        const totalPages = Math.ceil(this.totalrecords / this.pageSize);
        for (let i = 1; i <= totalPages; i++) {
            this.pageNumbers.push(i);
        }
    }

    openModal() {
        this.isAddModalOpen = true;
    }

    closeModal() {
        this.isAddModalOpen = false;
    }

    handleCreateRecord() {
        this.fetchRecords();
    }

    changePageNumber(event) {
        const temp = this.currentPage;
        const clickedElement = event.target;
        this.currentPage = clickedElement.dataset.id;
        if (temp != this.currentPage) {
            this.createPageWiseData();
        }
    }

    increasePageNumber() {
        if (this.currentPage < this.pageNumbers.length) {
            this.currentPage++;
            this.createPageWiseData();
        }
    }
    decreasePageNumber() {
        if (this.currentPage - 1 > 0) {
            this.currentPage--;
            this.createPageWiseData();
        }
    }
}














// Garbage:
// handleLocationNameChange(event) {
//     this.locationName = event.target.value;
// }

// handleAddressChange(event) {
//     this.address = event.detail;
// }

// import { getObjectInfo  } from 'lightning/uiObjectInfoApi';
// import FIELD_NAME from '@salesforce/schema/Location__c.Name';
// import FIELD_ADDRESS from '@salesforce/schema/Location__c.address__c';
// import FIELD_ADDRESS_STREET from '@salesforce/schema/Location__c.Address__Street__s';
    // @wire(getObjectInfo, { objectApiName: 'Location__c'})
    // wiredAccount({ error, data }) {
    //     if (data) {
    //         console.log(data);
    //     } else if (error) {
    //         console.log(error);
    //     }
    // }
            // fields[FIELD_NAME.fieldApiName] = this.locationName;
        // fields[FIELD_ADDRESS.fieldApiName] = this.address;
        // console.log(JSON.stringify(fields));
        // const recordInput = { apiName: LOCATION_OBJECT.objectApiName, fields };
        // createRecord(recordInput)
        //     .then(result => {
            //         alert('Location created successfully');
            //     })
            //     .catch(error => {
                //         console.error('Error:', error);
                //     });