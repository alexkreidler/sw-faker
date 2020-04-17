import { NamedNode, Dataset } from "rdf-js";
import { JsonLd } from "jsonld/jsonld-spec";

// Complex properties
// These will only be tried if the simply properties have failed
// For thesse, the system needs a way to determine the effective "type" of the property, which it can then pass to the simple MapProcessor
// It needs support for dereferencing these IRIs

// Implementation note: for now, we don't want to hard code in rdf-vocabularies if possible. Let's just encode a few core ones like
// http://schema.org/rangeIncludes and similar

export interface ComplexPropertyProcessor {
  node: NamedNode;

  // fetches the data from the given IRI
  fetchData(): Promise<Dataset>;
  readonly data: Dataset;

  // returns the effective type of the node
  // this can then be looked up if in the mapping if it is a simple value
  // if not, it needs to be represented
  getType(): NamedNode;
}

/**
 *Representation is a representation of a JSON-LD object. For example,
 and address could be represented as a string, or a Person as a string.
 *
 * @export
 * @interface Representation
 */
export interface Representation {
  node: NamedNode;
  representation: JsonLd;
}
