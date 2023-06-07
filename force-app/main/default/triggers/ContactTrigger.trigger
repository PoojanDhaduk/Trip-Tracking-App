trigger ContactTrigger on Contact(before insert, before update, before delete, after insert, after update, after delete, after undelete) {

    Boolean isActive = TRUE;
    if(isActive){
        switch on Trigger.operationType {
            when BEFORE_INSERT {
                ZipCodeHandler.replaceCityAndState(Trigger.new);
                // System.debug('Before Insert Fired');
                //handler.beforeInsert(Trigger.new);
            }
            when BEFORE_UPDATE {
                ZipCodeHandler.replaceCityAndState(Trigger.new);
                // System.debug('Before Update Fired');
                // handler.beforeUpdate(Trigger.old, Trigger.new, Trigger.oldMap, Trigger.newMap);
            }
            when BEFORE_DELETE {
                // handler.beforeDelete(Trigger.old, Trigger.oldMap);
            }
            when AFTER_INSERT {
                //handler.afterInsert(Trigger.new, Trigger.newMap);
            }
            when AFTER_UPDATE {
                //handler.afterUpdate(Trigger.old, Trigger.new, Trigger.oldMap, Trigger.newMap);
            }
            when AFTER_DELETE {
                // handler.afterDelete(Trigger.old, Trigger.oldMap);
            }
            when AFTER_UNDELETE {
                // handler.afterUndelete(Trigger.new, Trigger.newMap);
            }
        }
    }
}
