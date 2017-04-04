var roleHarvester = require('role.harvester.js');
var roleUpgrader = require('role.upgrader.js');
var roleBuilder = require('role.builder');
var roleMovingCarrier = require('role.movingCarrier');
var common = require("common")

module.exports = {
    loop : function () {
        var harvesters = [];
        var builders = [];
        var upgraders = [];
        var carriers = [];
        
        var flag;
        var nbCarrierFlag=0;
        var nbHarvesterFlag=0;

        for (var f in Game.flags){
            flag=Game.flags[f]
            // check only miner flags
            if(flag.color == common.CARRIER_FLAG_COLOR){
                nbCarrierFlag++
            }
            if(flag.color == common.MINING_FLAG_COLOR){
                nbHarvesterFlag++
            }
        }
        var buildersLimit = {'upgrader':5, 'harvester':nbHarvesterFlag, 'builder' : 4, 'carrier': nbCarrierFlag*common.NB_CARRIER_BY_FLAG};
        // console.log("CPU Start ", Game.cpu.getUsed(), "over", Game.cpu.limit);
        
        for (var i in Game.creeps) {
            if(Game.creeps[i].memory.role == 'harvester') {
                harvesters.push(Game.creeps[i]);
                roleHarvester.run(Game.creeps[i]);
            }
            if(Game.creeps[i].memory.role == 'builder') {
                builders.push(Game.creeps[i]);
                roleBuilder.run(Game.creeps[i]);
               
            }
            if(Game.creeps[i].memory.role == 'upgrader') {
                upgraders.push(Game.creeps[i]);
                roleUpgrader.run(Game.creeps[i]);
            }
            if(Game.creeps[i].memory.role == 'carrier') {
                carriers.push(Game.creeps[i]);
                roleMovingCarrier.run(Game.creeps[i], carriers, buildersLimit);
                // roleCarrier.run(Game.creeps[i], carriers, buildersLimit);
            }
        }
        console.log("Carrier : " +carriers.length+ "/"+ buildersLimit.carrier +"[" + carriers.map(function(a){return a.name}).join(",") +"]" + " Upgrader : " +upgraders.length+ "/"+ buildersLimit.upgrader +"[" + upgraders.map(function(a){return a.name}).join(",") +"]" + " Builder : " +builders.length+"/"+buildersLimit.builder+ "[" + builders.map(function(a){return a.name}).join(",") +"]" +" Harvester "+ harvesters.length+ "/"+buildersLimit.harvester+"[" + harvesters.map(function(a){return a.name}).join(",") +"]"  )
        
        if(Game.spawns.Spawn1.room.energyAvailable > 200){
            var err;
            var spawn = Game.spawns.Spawn1;
            for(var name in Memory.creeps) {
                if(!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }
            }
            
            if(harvesters.length < buildersLimit.harvester ) {
                var bodyHarvester = [WORK, WORK, MOVE]
                if(spawn.canCreateCreep(bodyHarvester, 'harvester_'+ Math.floor(Math.random()*1000)) == OK) {
                    spawn.createCreep(bodyHarvester, 'harvester_'+ Math.floor(Math.random()*1000), {role: 'harvester'});
                }else{
                    err = spawn.createCreep([WORK, MOVE], 'harvester_'+Math.floor(Math.random()*1000), {role: 'harvester'});
                    console.log(err < 0 ? "Cannot create creep harvester ("+err+")":"Carrier created (err : "+err+")" );
                }
                
            }
            if(carriers.length < buildersLimit.carrier ) {
                var bodyCarrier = [MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
                if(spawn.canCreateCreep(bodyCarrier, 'carrier_'+ Math.floor(Math.random()*1000)) == OK) {
                    spawn.createCreep(bodyCarrier, 'carrier_'+ Math.floor(Math.random()*1000), {role: 'carrier'});
                }else{
                    err = spawn.createCreep([MOVE, CARRY, CARRY], 'carrier_'+ Math.floor(Math.random()*1000), {role: 'carrier'});
                    console.log(err < 0 ? "Cannot create creep carrier ("+err+")":"Carrier created (err : "+err+")" );
                }
            }
            
            if(builders.length < buildersLimit.builder ) {
                var bodyBuilder = [WORK, WORK, CARRY, CARRY, MOVE, MOVE] //lol
                if(spawn.canCreateCreep(bodyBuilder, 'builder_'+ Math.floor(Math.random()*1000)) == OK) {
                    spawn.createCreep(bodyBuilder, 'builder_'+ Math.floor(Math.random()*1000),  {role: 'builder'});
                }else{
                    spawn.createCreep([WORK, CARRY, CARRY, MOVE], 'builder_'+ Math.floor(Math.random()*1000), {role: 'builder'});
                    console.log(err < 0 ? "Cannot create creep Builder ("+err+")":"Builder created (err : "+err+")" );    
                }
            }
            
            if(upgraders.length < buildersLimit.upgrader ) {
                var bodyUpgrader = [MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY]
                if(spawn.canCreateCreep(bodyUpgrader, 'upgrader_'+ Math.floor(Math.random()*1000)) == OK) {
                    spawn.createCreep(bodyUpgrader, 'upgrader_'+ Math.floor(Math.random()*1000), {role: 'upgrader'});
                }else{
                    spawn.createCreep([WORK, CARRY,CARRY, MOVE], 'upgrader_'+ Math.floor(Math.random()*1000), {role: 'upgrader'});
                    console.log(err < 0  ? "Cannot create creep Upgrader ("+err+")":"Upgrader created (err : "+err+")" );
                }
            }
        }
    
        // console.log("CPU : Before tower ", Game.cpu.getUsed());
        var tower = Game.getObjectById('TOWER_ID');
        
        if(tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
    
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
        console.log("CPU end : ",Game.cpu.getUsed());
        
    }
}