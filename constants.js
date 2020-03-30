//Canvas with context2d
const canvas = document.getElementById("tree");
const ctx = canvas.getContext("2d");

//canvas width, height
const cWidth = canvas.width;
const cHeight = canvas.height;

//treeupgrades
const maxTreeLevel = 1;
const treeUpgrades = [{
    uID: 0,
    name: "Allow for passive generation of Upgrade Points.",
    price: 0,
    level: 0,
    unlocks: [1, 2],
    needs: [],
    maxLevel: 1
  },
  {
    uID: 1,
    name: "Get 1 up/min generation.",
    price: 0,
    level: 1,
    unlocks: [],
    needs: [0],
    maxLevel: 1
  },
  {
    uID: 2,
    name: "Get +1 up/min generation",
    bName: "+10 up/min generation",
    price: 1,
    level: 1,
    unlocks: [],
    needs: [0],
    maxLevel: 10
  }
];