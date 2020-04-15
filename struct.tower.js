var roleTower = {
	run: function(tower) {
		let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	    if (closestHostile) {
	    	let errCode = tower.attack(closestHostile)
	    }
	}
}

module.exports = roleTower;