class AttributeGenerator {
    constructor(attributes, obj) {
        this.attributes = attributes;
        this.obj = obj;
        this.associateAttributes();
    }

    associateAttributes() {
        for (const attribute of this.attributes) {
            const { name } = attribute;
            //console.log (name + " Val : " + this.obj[attribute.name]);
            
            attribute.targetValue = 0;
            attribute.move = true;
            Object.defineProperty(attribute, `value`, {
                get: () => this.obj[attribute.name],
                set: (value) => {
                    //attribute.value = value;
                    this.obj[attribute.name] = value;
                }
            });


        }

    }

    move(){
        for (const attribute of this.attributes) {
            const { name, range, variation, targetValue, continuous, move } = attribute;
            attribute.move = true;
        }
    }

    stop(){
        for (const attribute of this.attributes) {
            const { name, range, variation, targetValue, continuous, move } = attribute;
            attribute.move = false;
        }
    }

    /**
     * 
     * Generate a random set of attributes.
     */
    generateRandomSet() {    
        for (const attribute of this.attributes) {
            this.randomTarget(attribute);
        }
    }
    
    randomTarget(attribute) {
        const { name, range, variation } = attribute;
        const minValue = range[0];
        const maxValue = range[1];
        const variationStep = variation;

        const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const adjustedValue = Math.round(randomValue / variationStep) * variationStep;

        attribute.targetValue = adjustedValue;
        attribute.move = true;
    }

    setValuesToTarget() {
        for (const attribute of this.attributes) {
            // only set values where target not used
            if (attribute.continuous != true)
                attribute.value = attribute.targetValue;
        }
    }

    /**
     *  Move the attributes towards the target values.
     */
    step(timeBetweenCalls) {
        for (const attribute of this.attributes) {
            const { name, range, variation, targetValue, continuous, move } = attribute;
            const stepSize = variation * timeBetweenCalls;

            if ((continuous == true) && (move == true)){
                console.log("Updating continous attribute: " + name + " to " + targetValue);
                if (attribute.value < targetValue) {
                    if (attribute.value + stepSize > targetValue){
                        attribute.value = targetValue;
                        attribute.move = false;
                        console.log("Clamped continous attribute: " + name + " to " + targetValue);                        
                        this.randomTarget(attribute);
                    }else
                        attribute.value += stepSize;
                } else if (attribute.value > targetValue - stepSize) {
                    if (attribute.value - stepSize < targetValue){
                        attribute.value = targetValue;
                        attribute.move = false;
                        console.log("Clamped continous attribute: " + name + " to " + targetValue);
                        this.randomTarget(attribute);
                    }else
                        attribute.value -= stepSize;
                }
            }
        }
    }
}

export { AttributeGenerator }
// Example usage
/*
const attributes = [
    { name: 'attribute1', range: [10, 20], variation: 2 },
    { name: 'attribute2', range: [5, 15], variation: 1 },
    { name: 'attribute3', range: [0, 100], variation: 10 }
];

const generator = new AttributeGenerator(attributes);
const randomSet = generator.generateRandomSet();
console.log(randomSet);

// Accessing and setting values
generator.obj.attr1 = 15;
generator.obj.attr2 = 8;
console.log(generator.obj.attr1); // Output: 15
console.log(generator.obj.attr2); // Output: 8
*/
 



