// import { loadTrueType } from "./component-true-type"

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
  loadSprite("breakableSand", "sprites/sand1.png");
  loadSprite("UnbreakableSand", "sprites/Unbreakabe Sand.png");
  loadSprite("inventory", "sprites/inventory.png");

  //loadTrueType("hanalei", "fonts/HanaleiFill.ttf");

  loadSound("Bleeps_Of_Joy(IGT)", "sounds/Bleeps_Of_Joy(IGT).mp3");
  loadSound("Progression(Purplemaia Kajam)", "sounds/Progression(Purplemaia Kajam).mp3");
  loadSound("Slip_Past(IGT)", "sounds/Slip_Past(IGT).mp3");
  loadSound("Soothing_and_Fading(IGT)", "sounds/Soothing_and_Fading(IGT).mp3");
  loadSound("Sparked(IGT)", "sounds/Sparked(IGT).mp3");
  loadSound("Venture(IGT)", "sounds/Venture(IGT).mp3");
  loadSound("Pick_Up(Purplemaia_Kajam SFX)", "sounds/Pick_Up(Purplemaia_Kajam SFX).mp3");
  loadSound("Jump(Purplemaia_Kajam_SFX)", "sounds/Jump(Purplemaia_Kajam_SFX).mp3");
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
