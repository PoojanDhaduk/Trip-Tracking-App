public with sharing class LocationHandler {

    @AuraEnabled
    public static String createLocation(String locationName , Map<String,Object> addressMap , Id contactId){
        try {
            Location__c l1 = new Location__c();
            l1.Name = locationName;
            l1.Address__Street__s = (String)addressMap.get('street');
            l1.Address__City__s = (String)addressMap.get('city');
            l1.Address__CountryCode__s =(String)addressMap.get('country');
            l1.Address__StateCode__s = (String)addressMap.get('province');
            l1.Address__PostalCode__s = (String)addressMap.get('postalCode');
            l1.Contact__c = contactId;

            insert l1;

            return l1.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static Location__c getLocationDataToEdit(Id locationId){
        try {
            Location__c location = [SELECT Name, Address__City__s, Address__CountryCode__s, Address__PostalCode__s, Address__StateCode__s, Address__Street__s FROM Location__c WHERE Id=: locationId WITH SECURITY_ENFORCED];
            return location;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String editLocation(String locationName , Map<String,Object> addressMap , Id locationId){
        try {
            Location__c l1 = new Location__c();
            l1.Id = locationId;
            l1.Name = locationName;
            if(addressMap!= null){
                l1.Address__Street__s = (String)addressMap.get('street');
                l1.Address__City__s = (String)addressMap.get('city');
                l1.Address__CountryCode__s =(String)addressMap.get('country');
                l1.Address__StateCode__s = (String)addressMap.get('province');
                l1.Address__PostalCode__s = (String)addressMap.get('postalCode');
            }
            update l1;
            return l1.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }



    @AuraEnabled
    public static List<Map<String , String>> getRelatedLocations(String contactId){
        try {
            Set<Id> locationIdSet = new Set<Id>();
            List<Map<String , String>> locationData = new List<Map<String,String>>();
            List<Trip__c> tripList = [SELECT Trip_Origin__c, Trip_Destination__c FROM Trip__c WHERE Contact__c =: contactId WITH SECURITY_ENFORCED];
            
            for(Trip__c trip : tripList){
                locationIdSet.add(trip.Trip_Origin__c);
                locationIdSet.add(trip.Trip_Destination__c);
            }
            
            List<Location__c> untrippedLocation = [SELECT Name, Address__City__s, Address__StateCode__s, Address__PostalCode__s FROM Location__c WHERE Contact__c =: contactId  WITH SECURITY_ENFORCED];
            List<Location__c> locationList = [SELECT Name, Address__City__s, Address__StateCode__s, Address__PostalCode__s FROM Location__c WHERE Id IN: locationIdSet WITH SECURITY_ENFORCED];
            locationList.addAll(untrippedLocation);


            for(Location__c location : locationList){
                String address;
                if(location.Address__City__s != null && location.Address__StateCode__s != null){
                    address = location.Address__City__s + ' ' + location.Address__StateCode__s + ' ' + location.Address__PostalCode__s ;
                }
                else{
                    address = location.Address__PostalCode__s;
                }
                Map<String,String> tempMap = New Map<String,String>();
                tempMap.put('Name', location.Name);
                tempMap.put('Address', address);
                locationData.add(tempMap);
            }
            System.debug(locationData);
            return  locationData;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Location__c> findLocations(String locationName){
        try {
            String strKey ='%'+locationName+'%';
            System.debug(strKey);
            List<Location__c> locationList = [SELECT Id , Name FROM Location__c WHERE Name like :strKey WITH SECURITY_ENFORCED];
            System.debug(locationList); 
            return locationList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Map<String , Location__c> getDataForMap(Id originId , Id destinationId){
        try {
            Map<String , Location__c> locationData = new Map<String, Location__c>();
            Location__c originData = [SELECT Name, Address__c FROM Location__c WHERE Id = : originId WITH SECURITY_ENFORCED];
            Location__c destinationData = [SELECT Name, Address__c FROM Location__c WHERE Id = : destinationId WITH SECURITY_ENFORCED];
            locationData.put('origin' , originData);
            locationData.put('destination' , destinationData);
            return locationData;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static void removeContactFromLocation(List<Trip__c> tripList){
        System.debug(tripList);
        Set<Id> locationIds = new Set<Id>();
        List<Location__c> locationList = new List<Location__c>();
        for(Trip__c trip: tripList){
            locationIds.add(trip.Trip_Origin__c);
            locationIds.add(trip.Trip_Destination__c);
        }
        locationList = [SELECT Contact__c FROM Location__C WHERE Id IN : locationIds WITH SECURITY_ENFORCED];
        for(Location__c location :locationList){
            if(location.Contact__c != null){
                location.Contact__c = null;
            }
        }
        update locationList;
    }
}