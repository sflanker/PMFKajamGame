export default function loadAssets() {
	loadSprite("bean", "sprites/bean.png");
  loadSprite("googoly", "sprites/googoly.png");
	loadSprite("grass", "sprites/grass.png");
	loadSprite("apple", "sprites/apple.png");
	loadSprite("portal", "sprites/portal.png");
	loadSprite("coin", "sprites/coin.png");
  loadSprite("tree", "sprites/Tree.png");
  loadSprite("wood", "sprites/wood.png");
  loadSprite("box", "sprites/box.png");
  loadSprite("inventory", "sprites/inventory.png");
loadSprite("pele(interact)", "sprites/pele(interact).png");
loadSprite("pele(inactive)", "sprites/pele(inactive).png",{
  sliceX:3,
  sliceY:3,
  anims: {
    run:{
      from:0,
      to: 6,
    
    },
  
    }
  }
,);
}