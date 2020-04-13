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
    
    spawner.run()
    
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

    // Add road construction request
    if(Game.time % 50 == 0)
    {
      console.log("Let's build cette biatch")
      // Find highest requested position
      var max = {
        value:0
        }
      if(!Memory.room) Memory.room = {}

      console.log(Object.values(Memory.room))
      console.log(Object.keys(Memory.room))

      for(var key of Object.keys(Memory.room))
      {
        console.log(key + " "  + Memory.room[key])
        if(max.value < Memory.room[key])
        {
          max.value = Memory.room[key]
          max.key = key
        }
      }

      if(max.value > 0)
      {
        console.log("Building " + max.value)
        var  keyArray = max.key.split(' ')
        var posArray = keyArray[3].split(',')
        var ret = Game.rooms[keyArray[1]].createConstructionSite(parseInt(posArray[0]), parseInt(posArray[1]), STRUCTURE_ROAD)
        console.log("Result " + ret)
        // remove count
        Memory.room[max.key] = 0
      }
    }
}
