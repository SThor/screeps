var utility = require('utility');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.state) creep.memory.state = "harvest";

        if(creep.memory.state == "build" && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.state = "harvest";
            creep.say('🔄 harvest');
        }
        if(creep.memory.state == "harvest" && creep.store.getFreeCapacity() == 0) {
            creep.memory.state = "build";
            creep.say('🚧 build');
        }

        if(creep.memory.state == "build") {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            targets = targets.sort((a,b)=>a.progress<b.progress)
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    utility.travelTo(creep, targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
          utility.harvestFood(creep);
        }
    }
};

module.exports = roleBuilder;
