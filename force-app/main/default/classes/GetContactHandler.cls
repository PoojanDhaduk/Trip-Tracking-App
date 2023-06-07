public with sharing class GetContactHandler {
    @AuraEnabled(cacheable = true)
    public static List<Contact> getContacts(){
        try {
            List<Contact> contactList = [SELECT Name , Phone , Email , MailingPostalCode FROM Contact WITH SECURITY_ENFORCED];
            return contactList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
            
        }
    }
    @AuraEnabled
    public static Contact getSelectedContact(String contactId){
        try {
            Contact selectedContact = [SELECT Name , Standard_Vehicle__c, Department, Phone, Monthly_Mileage__c, MailingAddress , Email , MailingCity , MailingState , MailingPostalCode ,Car_Image__c FROM Contact WHERE Id =: contactId WITH SECURITY_ENFORCED];
            return selectedContact;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}