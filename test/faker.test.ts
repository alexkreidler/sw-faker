import { BasicGenerator, BasicMapProcessor } from '../src';
import { parseInput } from '../src/input';
import { schemaOrgMap } from '../src/mapper';

describe('basic data faker', () => {
  it('processes schema.org data', async () => {
    const g = new BasicGenerator(new BasicMapProcessor(), [schemaOrgMap]);
    const input = await parseInput('../data/person.jsonld');
    console.log(input);
    
    const res = await g.fake(input)
    expect(res).toMatchObject({});
  });
});
