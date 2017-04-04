var common = require('common');

var  roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        
        var sources = creep.pos.findClosestByRange(FIND_SOURCES);
        // check if not already on position
        var isOnFlag = false;
        for (var flag in Game.flags){
            if(Game.flags[flag].color == common.MINING_FLAG_COLOR){
                if(creep.pos.x == Game.flags[flag].pos.x && creep.pos.y == Game.flags[flag].pos.y ){
                    isOnFlag = true;
                    break;
                }
            }
        }
        
        console.log(creep.name, creep.pos, isOnFlag?"isOnFlag":"not on flag")
        if(isOnFlag){
            var err = creep.harvest(sources)
            err = creep.drop(RESOURCE_ENERGY)
        }else{
            
            nearestAvailFlag = Game.flags[common.getAvailableMiningFlag()[0]];
            console.log(creep.name, creep.pos, nearestAvailFlag)
            creep.moveTo(nearestAvailFlag);
            if( creep.harvest(nearestAvailFlag) == ERR_NOT_IN_RANGE ) {
                creep.moveTo(nearestAvailFlag);
            }
        }
        
        // if(creep.carry.energy < creep.carryCapacity) {
        //     var sources = creep.room.find(FIND_SOURCES);
        //     if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(sources[0]);
        //     }
        // }
        // else if(Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
        //     if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(Game.spawns['Spawn1']);
        //     }
        // }
    }
};

module.exports = roleHarvester;