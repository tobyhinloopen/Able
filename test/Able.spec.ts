import * as expect from "expect";
import { Able } from "../src";

describe("Able", () => {
  it("flatten() includes own name", () => {
    expect(Able.flatten({}, ["foo"])).toContain("foo");
  });

  it("flatten() includes group members", () => {
    const flattened = Able.flatten({foo: ["bar", "baz"]}, ["foo"]);
    expect(flattened).toContain("bar");
    expect(flattened).toContain("baz");
  });

  it("flatten() includes group members recursively", () => {
    const definition = {
      foo: ["bar", "baz"],
      baz: ["bam"],
    };
    const flattened = Able.flatten(definition, ["foo"]);
    expect(flattened).toContain("bar");
    expect(flattened).toContain("baz");
    expect(flattened).toContain("bam");
  });

  it("flatten() includes group members recursively (in a loop)", () => {
    const definition = {
      foo: ["bar", "baz"],
      baz: ["bam", "foo"],
    };
    const flattened = Able.flatten(definition, ["foo"]);
    expect(flattened).toHaveLength(4);
    expect(flattened).toContain("foo");
    expect(flattened).toContain("bar");
    expect(flattened).toContain("baz");
    expect(flattened).toContain("bam");
  });

  it("flatten() on it's previous output returns the same result", () => {
    const definition = {
      foo: ["bar", "baz"],
      baz: ["bam", "foo"],
    };
    const prev = Able.flatten(definition, ["foo"]);
    const curr = Able.flatten(definition, prev);
    expect(curr).toEqual(prev);
  });

  it("extractValues() extracts values", () => {
    const abilities = ["other", "?foo=0", "?noEqualSign", "?blankValue=", "?foo=1"];
    expect(Able.extractValues(abilities)).toEqual([{foo: "1", noEqualSign: "", blankValue: ""}, ["other"]]);
  });

  it("applyValues() applies values & removes abilities with missing values", () => {
    const abilities = ["metabase:dashboard:4?district={districtId}", "foo:{bar}"];
    const values = {districtId: "1"};
    expect(Able.applyValues(abilities, values)).toEqual(["metabase:dashboard:4?district=1"]);
  });

  it("canAccess() returns true if all required abilities are present", () => {
    const appliedAbilities = ["metabase:dashboard:4?district=1", "foo", "bar"];
    const requiredAbilities = ["metabase:dashboard:4?district=1"];
    expect(Able.canAccess(appliedAbilities, requiredAbilities)).toEqual(true);
  });

  it("canAccess() returns false if all required abilities are present", () => {
    const appliedAbilities = ["metabase:dashboard:4?district=1", "foo", "bar"];
    const requiredAbilities = ["metabase:dashboard:4?district=1"];
    expect(Able.canAccess(appliedAbilities, requiredAbilities)).toEqual(true);
  });
});
