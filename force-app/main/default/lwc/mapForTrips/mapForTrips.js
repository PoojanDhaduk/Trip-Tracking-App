import { LightningElement, api , wire} from 'lwc';
import getDataForMap from '@salesforce/apex/LocationHandler.getDataForMap';
import getTripLocationDetails from '@salesforce/apex/GetTripHandler.getTripLocationDetails';

export default class MapForTrips extends LightningElement {
    @api tripId ='';
    @api originId;
    @api destinationId;
    mapMarkers = [ ];

    //on the connectedCallback this imparative apex method will return data from location object and process it into the
    // mapMarkers to pass it into lightning map and show the locations 
    connectedCallback() {
        if(this.tripId != ''){
            getTripLocationDetails({ tripId: this.tripId })
            .then(result => {
                this.mapMarkers = [
                    {
                        location: {
                            Street: result.Trip_Origin__r.Address__c.street,
                            City: result.Trip_Origin__r.Address__c.city,
                            Country: result.Trip_Origin__r.Address__c.country
                        },
                        title: "From: "+result.Trip_Origin__r.Address__c.street,   
                    },
                    {
                        location: {
                            Street: result.Trip_Destination__r.Address__c.street,
                            City: result.Trip_Destination__r.Address__c.city,
                            Country: result.Trip_Destination__r.Address__c.country 
                        },
                        title: "TO: "+result.Trip_Destination__r.Address__c.street,
                    },
                ];
            })
            .catch(error => {
                console.log('Error:', error);
            });
        }
    }

    //this wire method will fetch the data from create trip component and show the map dynamically
    //whenever the locations are selected
    @wire(getDataForMap, { originId: '$originId' , destinationId : '$destinationId' })
    wiredData1({ error, data }) {
      if (data) {
        console.log('Data', data);
        this.mapMarkers = [
            {
            location: {
                Street: data.origin.Address__c.street,
                City: data.origin.Address__c.city,
                Country: data.origin.Address__c.country
            },
            title: "From: "+data.origin.Address__c.street,
            } ,
            {
            location: {
                Street: data.destination.Address__c.street,
                City: data.destination.Address__c.city,
                Country: data.destination.Address__c.country
            },
            title: "To: "+data.destination.Address__c.street,
        } 
        ]
      } else if (error) {
        this.mapMarkers = [];
      }
    }
}






// garbage:
// mapIcon: {
//     path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
//     fillColor: 'Green',
//     fillOpacity: 1,
//     strokeWeight: 0,
//     scale: .10,
//     anchor: {x: 122.5, y: 115}
//     },