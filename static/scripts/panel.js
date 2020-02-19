function Panel(state) {
	this.state = state;
	this.game = state.game;
	

	var thisPanel = this;

	this.playButton = new Button(state, 
		function(x, y) {return Math.hypot(x-PLAY_BUTTON_X, y-PLAY_BUTTON_Y) <= PLAY_BUTTON_R;},
		function(state) {state.nextRound();},
		true);
	state.addButton(this.playButton);

	this.fullscreenButton = new Button(state, 
		function(x, y) {return Math.hypot(x-FULLSCREEN_BUTTON_X, y-FULLSCREEN_BUTTON_Y) <= FULLSCREEN_BUTTON_R;},
		function(state) {state.toggleFullscreen();},
		true);
	state.addButton(this.fullscreenButton);

	this.sellButton = new Button(state,
		function(x, y) {return Math.abs(x-SELL_BUTTON_MID_X) <= SELL_BUTTON_WIDTH/2 && y >= SELL_BUTTON_Y && y<= SELL_BUTTON_Y + SELL_BUTTON_HEIGHT},
		function(state) {state.sellFocusedTower();},
		false);
	state.addButton(this.sellButton);

	this.upgradeButton = new Button(state,
		function(x, y) {return Math.abs(x-UPGRADE_BUTTON_MID_X) <= UPGRADE_BUTTON_WIDTH/2 && y >= UPGRADE_BUTTON_Y && y<= UPGRADE_BUTTON_Y + UPGRADE_BUTTON_HEIGHT},
		function(state) {state.focusedTower.nextUpgrade()},
		false);
	state.addButton(this.upgradeButton);
}

//Draws the panel
Panel.prototype.draw = function() {
	
	this.drawBase();

	if (this.state.focusedTower == null) {
		this.drawTopBox();
		this.drawTowerBox();
	} else {
		this.drawDescriptionBox();
		this.drawSellButton();
		this.drawUpgradeButton();
	}

	this.drawButtons();
}

Panel.prototype.drawBase = function() {
	this.state.context.fillStyle = this.game.panelBaseColor;
	this.state.context.fillRect(PANEL_X, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
}

Panel.prototype.drawTopBox = function() {
	this.state.context.fillStyle = this.game.panelBoxColor;
	this.state.context.fillRect(PANEL_TOWER_BOX_X, PANEL_TOWER_BOX_Y, PANEL_TOWER_BOX_WIDTH, PANEL_TOWER_BOX_HEIGHT);
	
	this.state.context.textAlign = "center";
	this.state.context.textBaseline = "middle";
	this.state.context.fillStyle = this.game.panelTextColor;

	if(this.state.draggingTower || this.state.hoveringTowerOption) {
		this.state.setFontFit("$" + this.state.selection.upgrades[0].cost, PANEL_TOWER_BOX_TOWER_COST_FONT_SIZE, PANEL_TOWER_BOX_INNER_WIDTH);
		this.state.context.fillText("$" + this.state.selection.upgrades[0].cost, PANEL_TOWER_BOX_MID_X, PANEL_TOWER_BOX_Y + PANEL_TOWER_BOX_TOWER_COST_OFFSET_Y);
		this.state.setFontFit(this.state.selection.name, PANEL_TOWER_BOX_TOWER_NAME_FONT_SIZE, PANEL_TOWER_BOX_INNER_WIDTH);
		this.state.context.fillText(this.state.selection.name, PANEL_TOWER_BOX_MID_X, PANEL_TOWER_BOX_Y + PANEL_TOWER_BOX_TOWER_NAME_OFFSET_Y);
	} else {
		this.state.setFontFit("Towers", PANEL_TOWER_BOX_TOWER_TEXT_FONT_SIZE, PANEL_TOWER_BOX_INNER_WIDTH);
		this.state.context.fillText("Towers", PANEL_TOWER_BOX_MID_X, PANEL_TOWER_BOX_Y + PANEL_TOWER_BOX_TOWER_TEXT_OFFSET_Y);
	}
}

Panel.prototype.drawDescriptionBox = function() {
	this.state.context.fillStyle = this.game.panelBoxColor;
	this.state.context.fillRect(PANEL_TOWER_DESCRIPTION_BOX_X, PANEL_TOWER_DESCRIPTION_BOX_Y, PANEL_TOWER_DESCRIPTION_BOX_WIDTH, PANEL_TOWER_DESCRIPTION_BOX_HEIGHT);
	
	this.state.focusedTower.upgrade.drawFit(this.state.context, PANEL_TOWER_DESCRIPTION_BOX_MID_X, PANEL_TOWER_DESCRIPTION_IMAGE_Y, PANEL_TOWER_DESCRIPTION_IMAGE_SIZE)
	
	this.state.context.textAlign = "center";
	this.state.context.textBaseline = "middle";
	this.state.context.fillStyle = this.game.panelTextColor;
	
	this.state.setFontFit(this.state.focusedTower.type.name, PANEL_TOWER_DESCRIPTION_TITLE_FONT_SIZE, PANEL_TOWER_BOX_INNER_WIDTH);
	this.state.context.fillText(this.state.focusedTower.type.name, PANEL_TOWER_DESCRIPTION_BOX_MID_X, PANEL_TOWER_DESCRIPTION_BOX_Y + PANEL_TOWER_DESCRIPTION_TITLE_OFFSET_Y);
}

Panel.prototype.drawSellButton = function() {
	this.state.context.fillStyle = this.game.sellButtonColor;
	this.state.context.fillRect(SELL_BUTTON_MID_X - SELL_BUTTON_WIDTH/2, SELL_BUTTON_Y, SELL_BUTTON_WIDTH, SELL_BUTTON_HEIGHT);

	this.state.context.textAlign = "center";
	this.state.context.textBaseline = "middle";
	this.state.context.fillStyle = this.game.sellButtonTextColor;
	
	this.state.setFontFit("Sell-$" + this.state.focusedTower.baseSellPrice*this.state.game.sellMultiplier, SELL_BUTTON_FONT_SIZE, SELL_BUTTON_INNER_WIDTH);
	this.state.context.fillText("Sell-$" + this.state.focusedTower.baseSellPrice*this.state.game.sellMultiplier, SELL_BUTTON_MID_X, SELL_BUTTON_Y + SELL_BUTTON_HEIGHT/2);
}

Panel.prototype.drawUpgradeButton = function() {
	var nextUpgrade = this.state.focusedTower.type.upgrades[this.state.focusedTower.upgradeNum+1];
	if(nextUpgrade == undefined || this.state.money < nextUpgrade.cost) {
		this.upgradeButton.active = false;
	} else {
		this.upgradeButton.active = true;
	}

	

	if (nextUpgrade == undefined) {
		this.state.context.filter = "opacity(50%)";

		this.state.context.fillStyle = this.game.panelBoxColor;
		this.state.context.fillRect(UPGRADE_BUTTON_MID_X - UPGRADE_BUTTON_WIDTH/2, UPGRADE_BUTTON_Y, UPGRADE_BUTTON_WIDTH, UPGRADE_BUTTON_HEIGHT);

		this.state.context.textAlign = "center";
		this.state.context.textBaseline = "middle";
		this.state.context.fillStyle = this.game.panelTextColor;

		this.state.setFontFit("No Upgrades", UPGRADE_BUTTON_NONE_FONT_SIZE, UPGRADE_BUTTON_NONE_WIDTH);
		this.state.context.fillText("No Upgrades", UPGRADE_BUTTON_MID_X, UPGRADE_BUTTON_NONE_Y);

		this.state.context.filter = "none"
	} else {
		if (this.state.money < nextUpgrade.cost) {
			this.state.context.filter = "opacity(50%)";
		}

		this.state.context.fillStyle = this.game.panelBoxColor;
		this.state.context.fillRect(UPGRADE_BUTTON_MID_X - UPGRADE_BUTTON_WIDTH/2, UPGRADE_BUTTON_Y, UPGRADE_BUTTON_WIDTH, UPGRADE_BUTTON_HEIGHT);

		this.state.context.textAlign = "left";
		this.state.context.textBaseline = "middle";
		this.state.context.fillStyle = this.game.panelTextColor;

		nextUpgrade.drawFit(this.state.context, UPGRADE_BUTTON_ICON_X, UPGRADE_BUTTON_ICON_Y, UPGRADE_BUTTON_ICON_MAX);

		this.state.setFontFit("$" + nextUpgrade.cost, UPGRADE_BUTTON_COST_FONT_SIZE, UPGRADE_BUTTON_TEXT_WIDTH);
		this.state.context.fillText("$" + nextUpgrade.cost, UPGRADE_BUTTON_TEXT_X, UPGRADE_BUTTON_COST_Y);

		this.state.setFontFit(nextUpgrade.name, UPGRADE_BUTTON_NAME_FONT_SIZE, UPGRADE_BUTTON_TEXT_WIDTH);
		this.state.context.fillText(nextUpgrade.name, UPGRADE_BUTTON_TEXT_X, UPGRADE_BUTTON_NAME_Y);
	
		this.state.context.filter = "none";
	}
	
}

//Draws the container and its contexts for the tower options
Panel.prototype.drawTowerBox = function() {
	this.state.context.fillStyle = this.game.panelBoxColor;
	this.state.context.fillRect(PANEL_TOWER_OPTION_BOX_X, PANEL_TOWER_OPTION_BOX_Y, PANEL_TOWER_OPTION_BOX_WIDTH, PANEL_TOWER_OPTION_BOX_HEIGHT);
	
	for (var i=0; i<this.state.towerTypes.length; i++) {
		this.state.context.filter = "none";
		this.state.context.fillStyle = this.game.panelTowerOptionBoxFillColor;
		var towerCoors = this.getTowerOptionCoors(i);
		this.state.context.fillRect(towerCoors.x+PANEL_TOWER_OPTION_PADDING, towerCoors.y+PANEL_TOWER_OPTION_PADDING, PANEL_TOWER_OPTION_SIZE-(2*PANEL_TOWER_OPTION_PADDING), PANEL_TOWER_OPTION_SIZE-(2*PANEL_TOWER_OPTION_PADDING));

		if((this.state.draggingTower || this.state.hoveringTowerOption) && this.state.selection==this.state.towerTypes[i]) {
			this.state.context.strokeStyle = this.game.panelTowerOptionBoxHoverOutlineColor;
			this.state.context.lineWidth = PANEL_TOWER_OPTION_SIZE/15;
			this.state.context.strokeRect(towerCoors.x+PANEL_TOWER_OPTION_PADDING, towerCoors.y+PANEL_TOWER_OPTION_PADDING, PANEL_TOWER_OPTION_SIZE-(2*PANEL_TOWER_OPTION_PADDING), PANEL_TOWER_OPTION_SIZE-(2*PANEL_TOWER_OPTION_PADDING));
		}

		if (this.state.money < this.state.towerTypes[i].upgrades[0].cost) {
			this.state.context.filter = "brightness(40%)";
		}
		
		this.state.towerTypes[i].upgrades[0].drawFit(this.state.context, towerCoors.x+PANEL_TOWER_OPTION_SIZE/2, towerCoors.y+PANEL_TOWER_OPTION_SIZE/2, PANEL_TOWER_OPTION_SIZE);
		this.state.context.filter = "none";
	}
	
	this.drawScrollBar(this.state.context);
}

//Draws the scrollbar in the tower box
Panel.prototype.drawScrollBar = function() {
	this.state.context.fillStyle = this.game.panelTowerOptionScrollBarColor;
	this.state.context.fillRect(PANEL_TOWER_OPTION_SCROLL_BAR_X, PANEL_TOWER_OPTION_SCROLL_BAR_Y, PANEL_TOWER_OPTION_SCROLL_BAR_WIDTH, PANEL_TOWER_OPTION_SCROLL_BAR_HEIGHT);
}

Panel.prototype.drawButtons = function() {
	this.drawPlayButton();
	this.drawFullscreenButton();
}

Panel.prototype.drawPlayButton = function() {
	if (!this.playButton.active) {
		this.state.context.filter = "opacity(30%)";
	}
	if(this.state.buttonPressed && this.state.selection == this.playButton) {
		this.state.context.fillStyle = "#664321"; //This should probably be changed
	} else {
		this.state.context.fillStyle = this.game.panelButtonFillColor;
	}

	this.state.context.beginPath();
	this.state.context.arc(PLAY_BUTTON_X, PLAY_BUTTON_Y, PLAY_BUTTON_R, 0, 2*Math.PI);
	this.state.context.fill();

	this.state.context.fillStyle = this.game.panelButtonSymbolColor;
	this.state.context.beginPath();
	this.state.context.moveTo(PLAY_BUTTON_X - PLAY_BUTTON_R/4, PLAY_BUTTON_Y - PLAY_BUTTON_R/2);
	this.state.context.lineTo(PLAY_BUTTON_X - PLAY_BUTTON_R/4, PLAY_BUTTON_Y + PLAY_BUTTON_R/2);
	this.state.context.lineTo(PLAY_BUTTON_X + PLAY_BUTTON_R/2, PLAY_BUTTON_Y);
	this.state.context.closePath();
	this.state.context.fill();

	this.state.context.filter = "none";
}

Panel.prototype.drawFullscreenButton = function() {
	if(this.state.buttonPressed && this.state.selection == this.fullscreenButton) {
		this.state.context.fillStyle = "#664321"; //This should probably be changed
	} else {
		this.state.context.fillStyle = this.game.panelButtonFillColor;
	}

	this.state.context.beginPath();
	this.state.context.arc(FULLSCREEN_BUTTON_X, FULLSCREEN_BUTTON_Y, FULLSCREEN_BUTTON_R, 0, 2*Math.PI);
	this.state.context.fill();

	this.state.context.strokeStyle = this.game.panelButtonSymbolColor;
	this.state.context.lineWidth = FULLSCREEN_BUTTON_R / 6;

	var nfss = 8;
	var nfsb = 2;
	var fss = 4.5;
	var fsb = 1.75;

	if(document.fullscreenElement == null) {
		this.state.context.beginPath();
		this.state.context.moveTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/nfss, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/nfsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/nfsb, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/nfsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/nfsb, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/nfss);

		this.state.context.moveTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/nfss, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/nfsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/nfsb, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/nfsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/nfsb, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/nfss);

		this.state.context.moveTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/nfss, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/nfsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/nfsb, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/nfsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/nfsb, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/nfss);

		this.state.context.moveTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/nfss, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/nfsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/nfsb, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/nfsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/nfsb, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/nfss);
	} else {
		this.state.context.beginPath();
		this.state.context.moveTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/fss, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/fsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/fss, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/fss);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/fsb, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/fss);

		this.state.context.moveTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/fss, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/fsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/fss, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/fss);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/fsb, FULLSCREEN_BUTTON_Y - FULLSCREEN_BUTTON_R/fss);

		this.state.context.moveTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/fss, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/fsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/fss, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/fss);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X - FULLSCREEN_BUTTON_R/fsb, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/fss);

		this.state.context.moveTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/fss, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/fsb);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/fss, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/fss);
		this.state.context.lineTo(FULLSCREEN_BUTTON_X + FULLSCREEN_BUTTON_R/fsb, FULLSCREEN_BUTTON_Y + FULLSCREEN_BUTTON_R/fss);
	}

	this.state.context.stroke();

	this.state.context.filter = "none";
}

//Gets the coordinates of the top left corner of the tower option in the panel
Panel.prototype.getTowerOptionCoors = function(num) {
	return {
		x: PANEL_TOWER_OPTIONS_X + (PANEL_TOWER_OPTION_SIZE + PANEL_TOWER_OPTION_GAP) * (num%2), 
		y: PANEL_TOWER_OPTIONS_Y + (PANEL_TOWER_OPTION_SIZE + PANEL_TOWER_OPTION_GAP) * Math.floor(num/2)
	};
}

//Returns whether a coordinate pair is inside a tower option
Panel.prototype.optionContains = function(num, x, y) {
	var towerCoors = this.getTowerOptionCoors(num);
	if(x>=towerCoors.x && y>=towerCoors.y && x<=towerCoors.x+PANEL_TOWER_OPTION_SIZE && y<=towerCoors.y+PANEL_TOWER_OPTION_SIZE) {
		return true;
	} else {
		return false;
	}
}