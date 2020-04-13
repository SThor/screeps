module.exports = {
  travelTo: function(creep, target, opts) {
    // Breadcrumbs for harvesters
    if(creep.memory.role == "harvester")
    {
      // Check room memory and breadcrumb existence
      if(!Memory.room) Memory.room = {}
      if(!Memory.room[creep.pos]) Memory.room[creep.pos] = 0
      // lay breadcrumb 
      Memory.room[creep.pos] += 1
    }
    // move
    creep.moveTo(target, opts)
  }
}

