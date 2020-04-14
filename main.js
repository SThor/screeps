var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

var spawner = require('spawn');

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    spawner.run(Game.spawns['Spawn1'])
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }

    // Add road construction request if there are less than a fixed numbers TODO: than builders in the room?
    if(Game.time % 50 == 0)
    {
      console.log("Let's build cette biatch")
      // Find highest requested position
      var max = {
        value:0
        }
      if(!Memory.room) Memory.room = {}

      for(var key of Object.keys(Memory.room))
      {
        if(max.value < Memory.room[key])
        {
          max.value = Memory.room[key]
          max.key = key
        }
      }

      if(max.value > 0)
      {
        console.log("Building " + max.value + " at " + max.key)
        var keyArray = max.key.split(' ')
        var posArray = keyArray[3].split(',')
        var roomToBuild = Game.rooms[keyArray[1]]
        if(roomToBuild.find(FIND_MY_CONSTRUCTION_SITES).length < 5)
        {
          var ret = roomToBuild.createConstructionSite(parseInt(posArray[0]), parseInt(posArray[1]), STRUCTURE_ROAD)
          console.log("Result " + ret)
        }
        else
        {
          console.log("Too many sites. Let's wait" + roomToBuild.find(FIND_MY_CONSTRUCTION_SITES).length )
        }
        // remove count
        delete Memory.room[max.key]
      }
      else
      {
        console.log("Noone wants anything.")
      }
    }
}
