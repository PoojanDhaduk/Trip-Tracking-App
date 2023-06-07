public with sharing class ZipCodeHandler {
    public static void replaceCityAndState(List<Contact> newList){
        List<String> postCodeList = new List<String>();
        
        for(Contact con :newList){
            postCodeList.add(con.MailingPostalCode);
        }

        List< Address__c> addressList = [SELECT City__c , State__c , Zip_code__c From Address__c WHERE Zip_code__c IN : postCodeList WITH SECURITY_ENFORCED];
        Map<String , Address__c> addressMap = new Map<String , Address__c>();

        for(Address__c add : addressList){
            addressMap.put(add.Zip_code__c , add);
        }    

        for(contact con : newList){
            Address__c tempAdd = addressMap.get(con.MailingPostalCode);
            if(tempAdd == null){
                con.addError('Please Enter a valid Zip Code From Addresses Available in the DataBase');
            }
            else{
                con.MailingState = tempAdd.State__c;
                con.MailingCity = tempAdd.City__c;
            }
        }
    
    }
}