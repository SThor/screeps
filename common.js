/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common');
 * mod.thing == 'a thing'; // true
 */

// var MINING_FLAG_COLOR = COLOR_GREEN;

module.exports = {
    MINING_FLAG_COLOR : COLOR_GREEN,
    CARRIER_FLAG_COLOR : COLOR_RED,
    WAITING_FLAG_COLOR: COLOR_BROWN,
    NB_CARRIER_BY_FLAG : 1.5, // multiplier
    COLOR_PATH : {
        harvester : {
            work : {stroke: '#FF5500', lineStyle: 'dashed'},
            refill : {stroke: '#FF5500' }
        },
        carrier : {
            work : {stroke: '#FF55FF', lineStyle: 'dashed'},
            refill : {stroke: '#FF55FF' }
        },
        builder : {
            work : {stroke: '#55FF55', lineStyle: 'dashed'},
            refill : {stroke: '#55FF55' }
        },
        upgrader : {
            work : {stroke: '#DCDCDC', lineStyle: 'dashed'},
            refill : {stroke: '#DCDCDC' }  
        }
    },
    getAvailableMiningFlag : function(){
        var creep, flag;
        var availFlag = [];
        // for each flag of the mining color, check that no creeps is on it.
        for (var f in Game.flags){
            flag=Game.flags[f]
            // check only miner flags
            if(flag.color == this.MINING_FLAG_COLOR){
                availFlag.push(flag.name);
                
                for (var i in Game.creeps){
                    creep = Game.creeps[i];
                    if(creep.pos.x == flag.pos.x && creep.pos.y == flag.pos.y ){
                        availFlag.pop() // remove used flag
                    }
                }
            }
        }
        // console.log(JSON.stringify(availFlag));
        return availFlag;
    },
    totalEnergyAvailable : function(room){
        var energyAvailable = 0;
        var container;
        // Game.spawns.Spawn1.room.
        var containers = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
        });
        for(var c in containers){
            container = containers[c];
            energyAvailable+=container.energyAvailable;
        }
        return energyAvailable;
    }
};