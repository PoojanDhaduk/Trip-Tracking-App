import { LightningElement, api, wire } from 'lwc';
import getTripList from '@salesforce/apex/GetTripHandler.getTripList';
import countRelatedTrips from '@salesforce/apex/GetTripHandler.countRelatedTrips';
export default class ContactTrips extends LightningElement {
  @api contactId;
  tripData = [];
  showdata = true;
  createNewTrip = false;
  oldContactId;
  currentPage = 1;
  pageSize = 5;
  pageNumbers;
  totalRecords;
  
  //getiing data of trips when the component is inserted into DOM at initial phase.
  connectedCallback(){
    this.countRelatedTrips();
  }

  countRelatedTrips(){
    countRelatedTrips({ contactId: this.contactId })
      .then(result => {
        this.totalRecords = result;
        this.calculatePageNumbers();
      })
      .catch(error => {
        console.error('Error:', error);
    });
  }

  renderedCallback(){
    if(this.oldContactId != this.contactId){
      this.oldContactId = this.contactId;
      this.updateListData();
    }
  }

  //function to that will fetch the data needed on the bases of page numbers.
  updateListData(){
    getTripList({ contactId: this.contactId  , pageSize: this.pageSize , pageNumber : this.currentPage})
      .then(data => {
        this.tripData = data;
        if (data.length == 0) { 
          this.showdata = false;
        }
        else {
          this.showdata = true;
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  //whenever new trip is created data needs to be refreshed so that new trip can be added in the trip list.
  refreshTripData(event) {
    const textVal = event.detail;
    this.contactId = textVal;
    this.createNewTrip = false;
    this.countRelatedTrips();
    this.updateListData();
  }

  handlCancel(){
    this.toggleCreateComponent();
  }

  //function to toggle view of create trip child component
  toggleCreateComponent() {
    if (this.createNewTrip == false) {
      this.createNewTrip = true;
    }
    else {
      this.createNewTrip = false;
    }
  }

  //this function will show the map on the click of row.
  showData(event){
    const clickedElement = event.target;
    const value = clickedElement.getAttribute('data-text');
    let target = this.template.querySelector(`[data-id="${value}"]`);
    if(target.style.display == "table-cell"){
      target.style.display = "none";
    }
    else{
     target.style.display = "table-cell";
    }
  }

  closeViewTripComponent(event){
    const value = event.detail;
    let target = this.template.querySelector(`[data-id="${value}"]`);
    target.style.display = "none";
  }
  
  //function to calculate page numbers on the basis of total record exists/
  calculatePageNumbers() {
    this.pageNumbers = [];
    const totalPages = Math.ceil(this.totalRecords/ this.pageSize);
    for (let i = 1; i <= totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }

  //chanign page number as per the event listned by system.
  changePageNumber(event){
    const temp = this.currentPage;
    const clickedElement = event.target;
    this.currentPage = clickedElement.dataset.id;
    if(temp!=this.currentPage){
      this.updateListData();
    }
  }
  
  increasePageNumber(){
    if(this.currentPage< this.pageNumbers.length){
      this.currentPage++;
      this.updateListData();
    }
  }
  decreasePageNumber(){
    if(this.currentPage -1>0){
      this.currentPage--;
      this.updateListData();
    }
  }
}