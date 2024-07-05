export const generatePIN = (): number => {
    let pin = "";
    for (let i = 0; i < 6; i++) {
      pin += Math.floor(Math.random() * 10);
    }
    console.log(pin,"ithu ride pin");
    
    return parseInt(pin);
  };
  