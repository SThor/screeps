const defaultBody = [WORK,CARRY,MOVE]

module.exports = {
    genBody: function(){
        if(Game.spawns['Spawn1'].room.energyAvailable>=500){
            return [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
        }else if(Game.spawns['Spawn1'].room.energyAvailable>=300){
            return [WORK,CARRY,CARRY,MOVE,MOVE]
        }else{
            return defaultBody
        }
    },
    
    run: function() {
        var harvesters = _.filter(Game.creeps, (creep)=>creep.memory.role=='harvester');
        var builders = _.filter(Game.creeps, (creep)=>creep.memory.role=='builder');
        var upgraders = _.filter(Game.creeps, (creep)=>creep.memory.role=='upgrader');
        
        if(harvesters.length<2){
            Game.spawns['Spawn1'].spawnCreep(this.genBody(), 'Harvester' + Game.time,{memory: {role: 'harvester'}});
        }else if(upgraders.length<2){
            Game.spawns['Spawn1'].spawnCreep(this.genBody(), 'Upgrader' + Game.time,{memory: {role: 'upgrader'}});
        }else if(builders.length<2){
            Game.spawns['Spawn1'].spawnCreep(this.genBody(), 'Builder' + Game.time,{memory: {role: 'builder'}});
        }else if(builders.length<2){
            Game.spawns['Spawn1'].spawnCreep(this.genBody(), 'Repairer' + Game.time,{memory: {role: 'repairer'}});
        }
        
        if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
        }
    }
};