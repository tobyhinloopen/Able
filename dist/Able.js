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
                values[key] = typeof value === "undefined" ? "" : value;
            }
            else {
                remainder.push(ability);
            }
        }
        return [values, remainder];
    }
    Able.extractValues = extractValues;
    function applyValues(abilities, values) {
        const REGEX = /\{([^}]+)\}/;
        return abilities
            .map((ability) => ability.replace(REGEX, (original, key) => key in values ? values[key] : original))
            .filter((ability) => !REGEX.test(ability));
    }
    Able.applyValues = applyValues;
    function getMissingAbilities(abilities, requiredAbilities) {
        return requiredAbilities.filter((ability) => !abilities.includes(ability));
    }
    Able.getMissingAbilities = getMissingAbilities;
    function canAccess(appliedAbilities, requiredAbilities) {
        return this.getMissingAbilities(appliedAbilities, requiredAbilities).length === 0;
    }
    Able.canAccess = canAccess;
})(Able = exports.Able || (exports.Able = {}));
//# sourceMappingURL=Able.js.map