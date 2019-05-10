"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Able;
(function (Able) {
    function flatten(definition, abilities) {
        abilities = abilities.slice();
        for (const ability of abilities) {
            const members = definition[ability];
            if (members) {
                for (const member of members) {
                    if (!abilities.includes(member)) {
                        abilities.push(member);
                    }
                }
            }
        }
        return abilities;
    }
    Able.flatten = flatten;
    function extractValues(abilities) {
        const values = {};
        const remainder = [];
        for (const ability of abilities) {
            if (ability[0] === "?") {
                const [key, value] = ability.substr(1).split("=", 2);
                if (key[key.length - 2] === "[" && key[key.length - 1] === "]") {
                    const arrKey = key.substr(0, key.length - 2);
                    if (!(values[arrKey] instanceof Array)) {
                        values[arrKey] = [];
                    }
                    if (typeof value !== "undefined") {
                        values[arrKey].push(value);
                    }
                }
                else {
                    values[key] = typeof value === "undefined" ? "" : value;
                }
            }
            else {
                remainder.push(ability);
            }
        }
        return [values, remainder];
    }
    Able.extractValues = extractValues;
    function applyValues(abilities, values) {
        const REGEX = /\{([^}]+)\}/g;
        return abilities.reduce((outerAbilitiesAcc, ability) => {
            const match = ability.match(REGEX);
            if (!match) {
                return outerAbilitiesAcc.concat([ability]);
            }
            return outerAbilitiesAcc.concat(match
                .map((k) => k.substr(1, k.length - 2))
                .reduce((abilitiesAcc, k) => abilitiesAcc.reduce((acc, innerAbility) => acc.concat(arr(values[k]).map((v) => innerAbility.replace(`{${k}}`, v))), []), [ability]));
        }, []);
    }
    Able.applyValues = applyValues;
    function resolve(definition, abilities) {
        const flattened = Able.flatten(definition, abilities);
        const [extractedValues, extractedAbilities] = Able.extractValues(flattened);
        return Able.applyValues(extractedAbilities, extractedValues);
    }
    Able.resolve = resolve;
    function getMissingAbilities(abilities, requiredAbilities) {
        return requiredAbilities.filter((ability) => !abilities.includes(ability));
    }
    Able.getMissingAbilities = getMissingAbilities;
    function canAccess(appliedAbilities, requiredAbilities) {
        return this.getMissingAbilities(appliedAbilities, requiredAbilities).length === 0;
    }
    Able.canAccess = canAccess;
})(Able = exports.Able || (exports.Able = {}));
function arr(valueOrValues) {
    if (valueOrValues === "") {
        return [""];
    }
    else if (typeof valueOrValues === "undefined" || valueOrValues === null) {
        return [];
    }
    else if (typeof valueOrValues === "string") {
        return [valueOrValues];
    }
    else {
        return valueOrValues;
    }
}
//# sourceMappingURL=Able.js.map