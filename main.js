let game = {
  function: {
    clearScreen() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cWidth, cHeight);
    },
    onResize() {
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;

      game.function.moveButtons();
      game.function.clearScreen();
      game.function.drawLines();
    },
    initialize() {

      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;

      game.function.createButton();
      game.function.moveButtons();
      game.function.drawLines();

      let gameLoop = setInterval(game.loop.tick, 1000);
    },
    createButton() {
      for (let i = 0; i < treeUpgrades.length; i++) {
        let item = treeUpgrades[i];


        let mainButton = document.createElement("button");
        let text = document.createTextNode(item.name)
        let text2 = document.createTextNode(" Costs (" + item.price + ") Upgrade Points.");
        mainButton.append(text);
        mainButton.append(document.createElement("BR"));
        mainButton.append(text2);

        mainButton.setAttribute("id", "treeU_" + item.uID);
        mainButton.classList.add("treeButton");
        document.getElementById("buttonStorage").append(mainButton);

        mainButton.addEventListener("click", function() {
          game.function.buyTreeUpgrade(item.uID);
        });

        for (let j = 0; j < item.unlocks.length; j++) {
          game.tree.buttonLines.push({
            from: item.uID,
            to: item.unlocks[j]
          });
        }
      }
    },
    moveButtons() {
      game.tree.buttonPositions.length = 0;

      for (let level = 0; level <= maxTreeLevel; level++) {
        let levelUpgrades = [];
        for (let u = 0; u < treeUpgrades.length; u++) {
          if (treeUpgrades[u].level != level) {
            continue;
          }
          levelUpgrades.push(treeUpgrades[u]);
        }

        let spacing = window.innerWidth * 0.8 / (levelUpgrades.length + 1);
        for (let b = 0; b < levelUpgrades.length; b++) {
          let cButton = document.getElementById("treeU_" + levelUpgrades[b].uID);
          cButton.style.position = "absolute";
          cButton.style.left = window.innerWidth * 0.1 + spacing * (b + 1) - 125;
          cButton.style.top = 200 + 200 * level;

          cButton.style.width = 250;
          cButton.style.height = 120;

          game.tree.buttonPositions.push({
            uID: levelUpgrades[b].uID,
            left: window.innerWidth * 0.1 + spacing * (b + 1) - 125,
            top: 200 + 200 * level
          });
        }
      }
    },
    updateButtons() {
      for (let i = 0; i < treeUpgrades.length; i++) {
        let item = treeUpgrades[i];

        if (!game.tree.upgrades.includes(item.uID)) {
          continue;
        }

        let level = game.tree.upgradeLevels.filter(level => level.uID == item.uID)[0];
        if (level.currentLevel < item.maxLevel) {
          let progress = level.currentLevel / item.maxLevel * 250;
          document.getElementById("treeU_" + item.uID).style.backgroundPosition = progress + "px";

          if (!document.getElementById("treeU_" + item.uID).classList.contains("pBought")) {
            document.getElementById("treeU_" + item.uID).classList.add("pBought");
          }

          continue;
        }
        if (document.getElementById("treeU_" + item.uID).classList.contains("pBought")) {
          document.getElementById("treeU_" + item.uID).classList.remove("pBought");
          document.getElementById("treeU_" + item.uID).style.background = "";
        }

        if (!document.getElementById("treeU_" + item.uID).classList.contains("bought")) {
          document.getElementById("treeU_" + item.uID).classList.add("bought");

          //change the text in the buttons
          if (!item.bName) {
            document.getElementById("treeU_" + item.uID).innerHTML = item.name;
          } else {
            document.getElementById("treeU_" + item.uID).innerHTML = item.bName;
          }
        }
      }
    },
    drawLines() {
      for (let i = 0; i < game.tree.buttonLines.length; i++) {
        let line = game.tree.buttonLines[i];
        let button1 = game.tree.buttonPositions.filter(button => button.uID == line.from)[0];
        let button2 = game.tree.buttonPositions.filter(button => button.uID == line.to)[0];


        ctx.beginPath();
        ctx.moveTo(button1.left + 125, button1.top + 60);
        ctx.lineTo(button2.left + 125, button2.top + 60);
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 20;
        ctx.stroke();
      }
    },
    buyTreeUpgrade(uID) {
      let item = treeUpgrades.filter(item => item.uID == uID)[0];
      let level = game.tree.upgradeLevels.filter(level => level.uID == uID)[0];
      for (let i = 0; i < item.needs.length; i++) {
        if (!game.tree.upgrades.includes(item.needs[i])) {
          return;
        }
      }
      if (game.player.upgradePoints < item.price) {
        return;
      }
      if (game.tree.upgrades.includes(item.uID) && level.currentLevel == item.maxLevel) {
        return;
      }
      if (!level) {
        game.tree.upgrades.push(item.uID);
        game.tree.upgradeLevels.push({
          uID: item.uID,
          currentLevel: 1
        });
      } else {
        if (level.uID != uID) {
          return;
        }
        level.currentLevel++;
      }

      game.player.upgradePoints -= item.price;
      game.function.updateButtons();
      game.loop.update();

    }
  },
  loop: {
    tick() {
      game.time++;

      // 1 up/min
      if (game.tree.upgrades.includes(1)) {
        if (game.time == 60) {
          game.player.upgradePoints++;
          game.loop.update();
        }
      }

      if (game.tree.upgrades.includes(2)) {
        let level = game.tree.upgradeLevels[2].currentLevel;
        let timeForPoint = Math.round(60 / level);

        if (game.time % timeForPoint == 0) {
          game.player.upgradePoints++;
          game.loop.update();
        }

      }

      //reset timer
      if (game.time >= 60) {
        game.time = 0;
      }
    },
    update() {
      document.getElementById("upCount").innerHTML = game.player.upgradePoints;
    }
  },
  tree: {
    upgrades: [],
    upgradeLevels: [],
    buttonPositions: [],
    buttonLines: []
  },
  player: {
    upgradePoints: 0
  },
  time: 0

}

game.function.initialize();
window.addEventListener("resize", game.function.onResize);