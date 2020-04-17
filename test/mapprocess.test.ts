import { BasicMapProcessor } from "../src";
import { schemaOrgMap } from "../src/mapper";

describe("basic map processor", () => {
  it("processes schema.org data", () => {
    const mp = new BasicMapProcessor();
    expect(mp.expand(schemaOrgMap)).toMatchObject({});
  });
});
