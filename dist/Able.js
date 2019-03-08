"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Able {
    static flatten(definition, abilities) {
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
    static extractValues(abilities) {
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
    static applyValues(abilities, values) {
        const REGEX = /\{([^}]+)\}/;
        return abilities
            .map((ability) => ability.replace(REGEX, (original, key) => key in values ? values[key] : original))
            .filter((ability) => !REGEX.test(ability));
    }
    static getMissingAbilities(appliedAbilities, requiredAbilities) {
        return requiredAbilities.filter((ability) => !appliedAbilities.includes(ability));
    }
    static canAccess(appliedAbilities, requiredAbilities) {
        return this.getMissingAbilities(appliedAbilities, requiredAbilities).length === 0;
    }
}
exports.Able = Able;
//# sourceMappingURL=Able.js.map