const { API_KEY } = require("./api-key");
const { Game, convertCoordsToBBoxes } = require("@gathertown/gather-game-client");
const { setgroups } = require("process");
global.WebSocket = require("isomorphic-ws");
const SPACE_ID = "DIzNBrGwiwgHESRq\\kauche-office"; // replace with your spaceId of choice
const mapId = "welcome" //replace with your map of choice 
const game = new Game(SPACE_ID, () => Promise.resolve({ apiKey: API_KEY }));
game.connect();
game.subscribeToConnection((connected) => console.log("connected?", connected));

//starting x and y for the leftmost pokeball, the rest of the pokeballs will spawn to the right of the first one
//office-island: x38 y69
const startX = 35;
const startY = 40;

//images left at index 0, right at 1, up at 2, down at 3, then repeats with alternate forms for each direction
//this part looks gross, someone please tell me how to make it less gross if I wana add the other 3024982049 pokemon
let pokeball =
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/tY3NKLnSH19EEstnaZ6Ix5";

let pokemonObj = [
  {
    name: "Charmander",
    localized: "ヒトカゲ",
    sprite: ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Gs2JPhCJJXGzFEegABNp7g",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/nYQ0cEdRlQdMs6fu7FXVZd",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Tp75dv75IIAWdanFsPfxWG",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Del3VK7aCJhOUXHacVVDJl",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/SWCKU6WP9Eky7yoIeOGqtL",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/O4Ulzd5by5VNdbbKDIrFBj",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/1hHwGrACK86OwGZjcrSC2W",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Rwv9YE7UjV42VFHBnmEvee"
    ]
  },
  {
    name: "Squirtle",
    localized: "ゼニガメ",
    sprite: ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/xx4nBSPOrygFupC430IGfz",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/KjJ2cG5Dh7PpWNlu3rD7Lp",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/s4HyLTU8JGESpfRhxunyFE",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/nCdmyDjwaPTzCBYoq8zEBm",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/DaTUV0NGxOf4YWYbKMcYB5",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/bnBagtD5yKyrQTnQWxXWrf",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/J1edvVDv9xnvEN7Jnwy9ii",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/oEW3B4ac77eaCCXNU3X2Wc"
    ]
  },
  {
    name: "Bulbasaur",
    localized: "フシギダネ",
    sprite: ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/Y5vY4aK8pnt7BeDJtUPWf2",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/vfiSUqMKhQPqckKCAPiOmo",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/X1lhPryAcvwegkB5U6TVQ7",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/l8gT9dqbY6XyY0lL6NleOa",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/xVYesBO0LGlXo3XE4aJX3J",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/YQ7hfTqShZLV1TXC3vXGJ8",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/mQo4E5VgcSQb4cLfANFw8L",
      "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/He157zYI2tOkS44q1cNrcQ"
    ]
  }
]
// let Charmander = {
//   name: "ヒトカゲ",
//   sprite: ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Gs2JPhCJJXGzFEegABNp7g",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/nYQ0cEdRlQdMs6fu7FXVZd",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Tp75dv75IIAWdanFsPfxWG",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Del3VK7aCJhOUXHacVVDJl",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/SWCKU6WP9Eky7yoIeOGqtL",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/O4Ulzd5by5VNdbbKDIrFBj",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/1hHwGrACK86OwGZjcrSC2W",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Rwv9YE7UjV42VFHBnmEvee"
//   ]
// }

// let Squirtle = {
//   name: "ゼニガメ",
//   sprite: ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/xx4nBSPOrygFupC430IGfz",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/KjJ2cG5Dh7PpWNlu3rD7Lp",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/s4HyLTU8JGESpfRhxunyFE",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/nCdmyDjwaPTzCBYoq8zEBm",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/DaTUV0NGxOf4YWYbKMcYB5",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/bnBagtD5yKyrQTnQWxXWrf",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/J1edvVDv9xnvEN7Jnwy9ii",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/oEW3B4ac77eaCCXNU3X2Wc"
//   ]
// }

// let Bulbasaur = {    //dont judge my bad pixel art plz
//   name: "フシギダネ",
//   sprite: ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/Y5vY4aK8pnt7BeDJtUPWf2",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/vfiSUqMKhQPqckKCAPiOmo",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/X1lhPryAcvwegkB5U6TVQ7",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/l8gT9dqbY6XyY0lL6NleOa",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/xVYesBO0LGlXo3XE4aJX3J",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/YQ7hfTqShZLV1TXC3vXGJ8",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/mQo4E5VgcSQb4cLfANFw8L",
//     "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/UvXBVt6vw9JZoqDn/He157zYI2tOkS44q1cNrcQ"
//   ]
// }

//returns new x,y, and direction sprite should be facing for pokemon based on current location/movement
function getNewPokeLocation(x, y, direction) {
  if (direction == 1 || direction == 2) {     //down
    return [x, y - 1, 3];
  }
  if (direction == 3 || direction == 4) {   //up
    return [x, y + 1, 2];
  }
  if (direction == 5 || direction == 6) {   //left
    return [x + 1, y, 0];
  }
  if (direction == 7 || direction == 8) {    //right
    return [x - 1, y, 1];
  }
}

//moves pokemon to follow u, returns nothing
function movePokemon(context) {
  //make object
  let objectId = context.playerId + "Pokemon";
  let location = getNewPokeLocation(context.player.x, context.player.y, context.player.direction);  //index 0 is x and 1 is y, and 2 is direction
  let state = 'normal';
  let imageLocation = pokemonObj.find(x => x.name === context.player.affiliation).sprite[location[2]]

  //check if image should alternate
  if (game.getObject(objectId) != undefined) {    //something something this gets mad at me if this is undefined and i try to move on
    if (game.getObject(objectId) && game.getObject(objectId).obj.customState == 'normal') {
      imageLocation = pokemonObj.find(x => x.name === context.player.affiliation).sprite[location[2] + 4]
      state = 'walking'
    }
  }
  let obj = {
    id: objectId,
    normal: imageLocation,
    x: location[0],
    y: location[1],
    type: 0,
    width: 1,
    height: 1,
    customState: state
  }

  //add object
  setTimeout(() => {
    game.setObject(mapId, objectId, obj);
  }, 100);
}

function setUp() {
  let pokemons = pokemonObj;
  pokemons.push({ name: "remove", localized: "もういい！もどれ！" })

  setTimeout(() => {
    for (let i = 0; i < pokemons.length; i++) {
      let objectId = pokemons[i].name + "_ball";
      let obj = {
        _name: pokemons[i].name,
        id: objectId,
        normal: pokeball,
        x: startX + i,
        y: startY,
        distThreshold: 1,
        type: 5,
        width: 1,
        height: 1,
        previewMessage: pokemons[i].localized, // this is what shows up in the press x bubble
      };
      game.setObject(mapId, objectId, obj);
    }
  }, 3000);
}

function pokemon() {
  console.log("pokemon")
  game.subscribeToEvent("playerInteracts", (data, context) => {     //watch for pokemon choosing
    let mapObject = game.getObject(data.playerInteracts.objId).obj;
    let pokePick = game.getObject(data.playerInteracts.objId).obj._name;

    if (context.player.affiliation != '' && pokePick == 'remove') {    //put away pokemon
      game.setAffiliation('', context.playerId);
      game.deleteObject(mapId, context.playerId + "Pokemon");
    } else {
      game.setAffiliation(pokePick, context.playerId);   //set pokemon
    }
  });

  game.subscribeToEvent("playerMoves", (data, context) => {    //watch for movements
    if (context.player.affiliation != '') {     //only try and set pokmon if player has selected one
      movePokemon(context); //makes that pokemon follow you!
    }
  });

  //despawn pokemon on leave, goodbye friend :c
  game.subscribeToEvent("playerExits", (data, context) => {
    if (context.player.affiliation != '') {
      console.log("Detach " + context.player.name + "'s " + context.player.affiliation);
      game.deleteObject(mapId, context.playerId + "Pokemon");
    }
  });

}
setTimeout(() => {
  setUp();  //comment out after first run
  pokemon();
}, 10000)