
import { Observable } from "../observable/observable.js";

export { Attribute }

const Attribute = value => {
    const validObs = Observable(true);
    const valueObs = Observable(value);

    // Set the unity validator.
    let validator = _ => true;

    const setValidator = func => {
        // Whenever the valueObs changes
        // then we get a value (the new value).
        // The new value is used to check if
        // it is still valid.
        valueObs.onChange(value => { 
            validObs.setValue(func(value));
        });
    }

    return { validObs, setValidator }
}