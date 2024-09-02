import Constants from "./Constants";
console.log("Constants:", Constants);

export const formatPrice = (price, currency) => {
    switch (currency) {
        case '$':
        case '£':
        case '€':
            return `${currency}${price}`;
        default:
            throw new Error('Unsupported currency');
    }
};

export const getGameCondition = (cond,RunCounter) => {
    let GameCondition;
    console.log("Constants:", Constants);
    console.log("++++++ Constants.ONE_SHOT="+Constants.ONE_SHOT)
    if (cond === 'o') {
        GameCondition = Constants.ONE_SHOT;
      }
      else if (cond === 'r') {
        GameCondition = Constants.REPEATED;
      }
      else if (cond === 'rand') { // GameCondition = 'Random';
        let rnd = Math.floor(Math.random() * 2);
        if (rnd)
          GameCondition = Constants.ONE_SHOT;
        else
          GameCondition = Constants.REPEATED;
      }
      else if (cond === 'u_d') { // GameCondition = 'Uniform distribution';
        console.log("--->  in get game coondition u_d RunCounter="+RunCounter +"   "+Constants.ONE_SHOT)
        if(!RunCounter)
            GameCondition = null;
        
        if (RunCounter % 2) { 
          GameCondition = Constants.ONE_SHOT;
        }
        else {
          GameCondition = Constants.REPEATED;
        }
      }
      console.log("===== GameCondition="+GameCondition)
      return GameCondition;
};