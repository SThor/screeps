const defaultBody = [WORK,CARRY,MOVE];

module.exports = {
    genBody: function(spawn, forceSmall){
        if(forceSmall){
            return defaultBody;
        }else if(spawn.room.energyCapacityAvailable>=800){
            return [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        }else if(spawn.room.energyCapacityAvailable>=500){
            return [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        }else if(spawn.room.energyCapacityAvailable>=300){
            return [WORK,CARRY,CARRY,MOVE,MOVE];
        }else{
            return defaultBody;
        }
    },

    spawn(spawn, creepRole){
        let errCode = spawn.spawnCreep(this.genBody(spawn,Memory.forceSmall), creepRole + Game.time,{memory: {role: creepRole}});
        if(errCode==OK){
            if(Memory.forceSmall){
                delete Memory.forceSmall;
                console.log('Spawning tiny'+creepRole+' at '+spawn.name);        
            }else{
                console.log('Spawning '+creepRole+' at '+spawn.name);
            }
        }else if(errCode==ERR_NOT_ENOUGH_ENERGY){
            if(!Memory.spawnTries) Memory.spawnTries = 0;
            Memory.spawnTries += 1;
            if(Memory.spawnTries > 30){
                console.log('Failed to spawn '+creepRole+' for '+Memory.spawnTries+' ticks.');
                Memory.forceSmall = true
                delete Memory.spawnTries;
            }
        }
    },
    
    run: function(spawn) {
        var harvesters = _.filter(Game.creeps, (creep)=>creep.memory.role=='harvester');
        var builders = _.filter(Game.creeps, (creep)=>creep.memory.role=='builder');
        var upgraders = _.filter(Game.creeps, (creep)=>creep.memory.role=='upgrader');
        var repairers = _.filter(Game.creeps, (creep)=>creep.memory.role=='repairer');
        

        if(harvesters.length<3){
            this.spawn(spawn,"harvester");
        }else if(upgraders.length<2){
            this.spawn(spawn,"upgrader");
        }else if(builders.length<3){
            this.spawn(spawn,"builder");
        }else if(repairers.length<2){
            this.spawn(spawn,"repairer");
        }
        
        if(spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            {align: 'left', opacity: 0.8});
        }
    }
};