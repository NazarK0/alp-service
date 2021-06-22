
function resetFocused(json) {
	json["navigation"]["focused"]["main"] = "";
	json["navigation"]["focused"]["serv"] = "";
	json["navigation"]["focused"]["expr"] = "";
	json["navigation"]["focused"]["docs"] = "";
	json["navigation"]["focused"]["cont"] = "";
}

exports.resetFocused = resetFocused;