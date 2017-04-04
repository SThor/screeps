/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.movingCarrier');
 * mod.thing == 'a thing'; // true
 */
var common = require("common");

module.exports = {
    run : function(creep){
        var err, flag, creep;
        var availFlag = [];
        
        if(!creep.memory.base_flag){
            for (var f in Game.flags){
                flag=Game.flags[f]
                // check only miner flags
                if(flag.color == common.CARRIER_FLAG_COLOR){
                    availFlag.push(flag.name);
                }
            }
            creep.memory.base_flag = availFlag[Math.floor(Math.random()*availFlag.length)]
        }
        
        if(creep.carry.energy < creep.carryCapacity) {

            var target = Game.flags[creep.memory.base_flag];
            creep.moveTo(target);
            var targetEnergy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if(creep.pickup(targetEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }else{
            // carry full capacity
        
            // priority on the spawner
            if(Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
                if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1']);
                }
                return;
            }
            
            // find the closest extension not full of energy
            var closestExtensionNotFull = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity
            });
            
            // if no extension need refill, ignore
            if(closestExtensionNotFull){
                if(err=creep.transfer(closestExtensionNotFull,RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestExtensionNotFull);
                }
                // console.log("[extension] : err", err)
                return;
            }
            
            var closestTowerNotFull = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity
            });
            
            // if no extension need refill, ignore
            if(closestTowerNotFull){
                if(err=creep.transfer(closestTowerNotFull,RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTowerNotFull);
                }
                // console.log("[Tower] : err", err)
                return;
            }
    
            // if spawner AND the extension got full energy, fill up container
            var closestContainerNotFull = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < 2000
            });
            
            if(closestContainerNotFull){
                // var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
                if(err=creep.transfer(closestContainerNotFull,RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestContainerNotFull);
                }
                // console.log("[container] : err", err)
                return;
            }
        }
    }
};