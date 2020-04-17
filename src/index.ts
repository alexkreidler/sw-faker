// here we are only importing the types
// import { NamedNode, Dataset } from "rdf-js";

import { JsonLd } from 'jsonld/jsonld-spec';
import { expand } from 'jsonld';

/* # Input
* This section defines the input structure of the API

* BasicInput requires all the fields that are needed to process a requested fake document
* All fields to generate should simply contain true, but the type and context may optionally be strings. The input will be parsed with JSON-LD to get the fully normalized requested value
*/
export type BasicInput = { [key: string]: true } & (
  | { '@type': string }
  | { '@type': string; '@context': string }
);

// Mapping
// This sectinon of the API allows the core library to map simple values such as schema:email to generator functions

type FunctionMap = { [key: string]: Function };

// The simplified map is how all of our data is represented at first. Then it is processed by adding the prefix to the key of the function map.
export type PrefixMap = { [prefix: string]: FunctionMap };

// TypeGeneratorMap is a map from fully-qualified Semantic Web IRIs to a function which generates representative data
export type TypeGeneratorMap = { [semanticType: string]: Function };

// this may not be necessary
export interface MapProcessor {
  // This function adds the prefix to the key of the function map.
  expand(input: PrefixMap): TypeGeneratorMap;
}

export function normalizeURL(url: URL): URL {
  url.port = "";
  url.search = ""
  url.username = ""
  url.password = ""
  url.protocol = "";
  return url
}

export function normalizeURLString(url: string): string {
  const u = new URL(url);
  return normalizeURL(u).toString().replace(/^https?:\/\//,'');;
}

export class BasicMapProcessor implements MapProcessor {
  constructor() {}
  expand(input: PrefixMap): TypeGeneratorMap {
    let newMap: TypeGeneratorMap = {};
    // we simply loop over the prefixes and their sub items, and create the relevant object representation
    for (const prefix in input) {
      for (const value in input[prefix]) {
        newMap[normalizeURLString(prefix + value)] = input[prefix][value];
      }
    }
    console.log(newMap);

    return newMap;
  }
}

/* Main
 * The following section of the api deals with how the system actually runs
 */

/* Generator is a fake data generator that implements the Semantic Web Faker API
 */
export interface Generator {
  fake(input: BasicInput): Promise<JsonLd>;
}

export class BasicGenerator {
  private realSchemas: TypeGeneratorMap = {};
  private schemas: PrefixMap[] = [];
  constructor(public mapProcessor: MapProcessor, schemas: PrefixMap[]) {
    this.schemas = schemas;
    this.registerSchemas();
  }

  registerSchemas() {
    let ts: TypeGeneratorMap[] = [];
    for (const s of this.schemas) {
      ts.push(this.mapProcessor.expand(s));
    }
    this.realSchemas = Object.assign({}, ...ts);
  }

  async fake(input: BasicInput): Promise<JsonLd> {
    const data = await expand(input);

    let outObj: { [key: string]: string } = {};

    // this may not handle below surface level
    // we may need an alternative object iteration method
    // but it needs to preserve structure
    for (const elem in data[0]) {
      if (elem == "@type") {
        continue;
      }
      const iri = normalizeURLString(elem)

      let generationFunction: Function = this.realSchemas[iri];
      if (!generationFunction) {
        continue;
      }
      
      outObj[iri] = generationFunction();
    }
    return outObj;
  }
}
