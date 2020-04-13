var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.state) creep.memory.state = "harvest";

        if(creep.memory.state == "harvest" && creep.store.getFreeCapacity() == 0) {
            creep.memory.state = "recharge";
            creep.say('⚡ recharge');
        }
        if(creep.memory.state == "recharge" && creep.store.getUsedCapacity() == 0) {
            creep.memory.state = "harvest";
            creep.say('🔄 harvest');
        }


        if(creep.memory.state == "harvest") {
            
            //todo: pick up dropped ressources
            
            var sources =creep.room.find(FIND_SOURCES);
            sources = _.sortBy(sources, s => creep.pos.getRangeTo(s));
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            targets = _.sortBy(targets, t => creep.pos.getRangeTo(t));
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;