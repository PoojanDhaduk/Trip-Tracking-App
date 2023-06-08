public with sharing class GetTripHandler {

    @AuraEnabled
    public static Integer countRelatedTrips(Id contactId){
        try {
            List<AggregateResult> totalTrips = [Select COUNT(NAME) FROM Trip__c WHERE Contact__c =: contactId WITH SECURITY_ENFORCED];
            Integer count = (Integer)totalTrips[0].get('expr0');
            return count; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Trip__c> getTripList(String contactId , Integer pageSize , Integer pageNumber){
        try {
            Integer offset = (pageNumber - 1) * pageSize;
            List<Trip__c> tripList = [SELECT Name , Trip_Date__c , Trip_Origin__r.Name , Trip_Destination__r.Name , Mileages__c ,Notes__c , Tags__c , Contact__c FROM Trip__c WHERE Contact__c =: contactId  WITH SECURITY_ENFORCED ORDER BY Name ASC LIMIT :pageSize OFFSET :offset];
            List<AggregateResult> totalTrips = [Select COUNT(NAME) FROM Trip__c WHERE Contact__c =: contactId WITH SECURITY_ENFORCED];
            return tripList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Trip__c getTripLocationDetails(String tripId){
        try {
            Trip__c tripLocation = [SELECT Trip_origin__r.address__c , Trip_Destination__r.address__c FROM Trip__C where Id=: tripId WITH SECURITY_ENFORCED];
            return tripLocation;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}