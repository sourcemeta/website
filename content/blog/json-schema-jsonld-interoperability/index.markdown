+++
title = "Fully solving JSON Schema and JSON-LD interoperability"
date = 2026-07-14
author = "jviotti"
+++

> TL;DR: The same [JSON Schema](https://json-schema.org) that validates
> your data can now declare what that data *means*. We built a ten-keyword
> extension vocabulary (`x-jsonld-*`) that promotes instances to
> [JSON-LD](https://www.w3.org/TR/json-ld11/) (the JSON serialisation of
> [RDF](https://www.w3.org/RDF/)). Annotate the schemas you already have, and
> every payload they validate becomes knowledge-graph-ready. Over the past
> decade, everyone from
> [MuleSoft](https://github.com/mulesoft-labs/json-ld-schema) to
> [Adobe](https://github.com/adobe/xdm/blob/master/docs/introduction.md) to
> [the Italian
> government](https://datatracker.ietf.org/doc/draft-polli-restapi-ld-keywords/)
> attempted some version of this bridge, and every attempt fell short of the
> same hard part: composition. We solved it, and it ships today in the [JSON
> Schema
> CLI](https://github.com/sourcemeta/jsonschema/blob/main/docs/rdf.markdown)
> and in the [Sourcemeta One](https://one.sourcemeta.com/api/#rdf) registry.

There is a fair chance [JSON-LD](https://json-ld.org) lives in your head as
"the [schema.org](https://schema.org) blob you paste into a web page so [Google
shows rich
results](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)".
But [JSON-LD](https://www.w3.org/TR/json-ld11/) is much more than that. It is
one of the credential formats the [EU Digital Identity
Wallet](https://www.w3.org/TR/vc-data-model-2.0/) accepts, which all 27 member
states must ship by December 2026. It is the foundation of Microsoft's [Digital Twins
Definition
Language](https://learn.microsoft.com/en-us/azure/digital-twins/concepts-models).
It is how [hundreds of thousands of machine-learning
datasets](https://research.google/blog/croissant-a-metadata-format-for-ml-ready-datasets/)
describe themselves on [Hugging
Face](https://huggingface.co/docs/dataset-viewer/en/croissant) and
[Kaggle](https://www.kaggle.com), how [all of EU
law](https://op.europa.eu/en/web/eu-vocabularies/cellar) is published, and how
websites [talk to AI
agents](https://news.microsoft.com/source/features/company-news/introducing-nlweb-bringing-conversational-interfaces-directly-to-the-web/).
[JSON-LD](https://json-ld.org) is what JSON looks like when it graduates into a
[knowledge
graph](https://cacm.acm.org/practice/industry-scale-knowledge-graphs/).

And yet, from where the [JSON Schema](https://json-schema.org) world sits,
[JSON-LD](https://json-ld.org) might as well be on another planet. It does not
matter which door brought you to JSON Schema: OpenAPI specifications ([76% of
the modern ones are majority JSON Schema by
volume](https://www.sourcemeta.com/blog/json-schema-dominates-openapi/)),
[AsyncAPI](https://www.asyncapi.com/) message payloads, [MCP tool
definitions](https://www.sourcemeta.com/blog/ai-only-speaks-json-schema/), [W3C
Web of Things Thing
Descriptions](https://json-schema.org/blog/posts/w3c-wot-case-study), the
IETF's [Semantic Definition
Format](https://datatracker.ietf.org/doc/html/draft-ietf-asdf-sdf) for the
Internet of Things, or plain standalone data models of the kind [governments
now publish in national
registries](https://www.sourcemeta.com/blog/g7-runs-on-json-schema/). *Sooner
or later the same need appears: joining [JSON
Schema](https://json-schema.org)'s validation strengths with
[JSON-LD](https://json-ld.org)'s semantic strengths.*

The rest of this article covers how the two languages each won their own layer
of the data world, who tried to bridge them over the past decade, where every
attempt fell short, and how we made it work.

## Our JSON-LD extension vocabulary

We built the bridge as a [JSON Schema](https://json-schema.org) extension
vocabulary: ten annotation keywords under the `x-jsonld-` prefix, deliberately
continuing the convention introduced by the Italian government's [REST API
Linked Data Keywords IETF
draft](https://datatracker.ietf.org/doc/draft-polli-restapi-ld-keywords/).
Because the keywords are plain `x-` extensions rather than a formal [JSON
Schema
vocabulary](https://json-schema.org/draft/2020-12/json-schema-core#name-extending-json-schema),
annotated schemas remain valid for every implementation, including the many
with no vocabulary support at all.

Here is a schema that describes a
[`schema.org/Order`](https://schema.org/Order) whose `seller` and `customer`
reuse a single `party` definition through
[`$ref`](https://www.learnjsonschema.com/2020-12/core/ref/), where a `party`
reuses a shared `address`, and where a `party` is a
[`schema.org/Person`](https://schema.org/Person) or a
[`schema.org/Organization`](https://schema.org/Organization) depending on its
`kind`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "x-jsonld-type": "https://schema.org/Order",
  "properties": {
    "orderNumber": {
      "type": "string",
      "x-jsonld-id": "https://schema.org/orderNumber"
    },
    "seller": {
      "$ref": "#/$defs/party",
      "x-jsonld-id": "https://schema.org/seller"
    },
    "customer": {
      "$ref": "#/$defs/party",
      "x-jsonld-id": "https://schema.org/customer"
    }
  },
  "required": [ "orderNumber", "seller", "customer" ],
  "$defs": {
    "party": {
      "type": "object",
      "properties": {
        "kind": { "enum": [ "person", "organization" ] },
        "name": { "type": "string", "x-jsonld-id": "https://schema.org/name" },
        "address": {
          "$ref": "#/$defs/address",
          "x-jsonld-id": "https://schema.org/address"
        }
      },
      "required": [ "kind", "name" ],
      "if": { "properties": { "kind": { "const": "person" } } },
      "then": { "x-jsonld-type": "https://schema.org/Person" },
      "else": { "x-jsonld-type": "https://schema.org/Organization" }
    },
    "address": {
      "type": "object",
      "x-jsonld-type": "https://schema.org/PostalAddress",
      "properties": {
        "country": {
          "type": "string",
          "x-jsonld-id": "https://schema.org/addressCountry",
          "x-jsonld-self": "http://publications.europa.eu/resource/authority/country/{this}"
        }
      }
    }
  }
}
```

And here is an order payload, one company selling to one individual, the kind
that would flow through a commerce API:

```json
{
  "orderNumber": "AC-2026-0042",
  "seller": {
    "kind": "organization",
    "name": "ACME GmbH",
    "address": { "country": "DEU" }
  },
  "customer": {
    "kind": "person",
    "name": "Erika Mustermann",
    "address": { "country": "ITA" }
  }
}
```

Now let's run this through the [Sourcemeta JSON Schema
CLI](https://github.com/sourcemeta/jsonschema):

```sh
$ jsonschema rdf schema.json instance.json
```

Both parties come out of the same
[`$ref`](https://www.learnjsonschema.com/2020-12/core/ref/) with different
[RDF](https://www.w3.org/RDF/) types, the seller an
[`Organization`](https://schema.org/Organization) and the customer a
[`Person`](https://schema.org/Person), each carrying an address typed as a
[`schema.org/PostalAddress`](https://schema.org/PostalAddress) with its country
promoted to the [EU country
authority](http://publications.europa.eu/resource/authority/country/) IRI:

```json
[
  {
    "@type": [ "https://schema.org/Order" ],
    "https://schema.org/orderNumber": [ { "@value": "AC-2026-0042" } ],
    "https://schema.org/seller": [
      {
        "@type": [ "https://schema.org/Organization" ],
        "https://schema.org/name": [ { "@value": "ACME GmbH" } ],
        "https://schema.org/address": [
          {
            "@type": [ "https://schema.org/PostalAddress" ],
            "https://schema.org/addressCountry": [
              { "@id": "http://publications.europa.eu/resource/authority/country/DEU" }
            ]
          }
        ]
      }
    ],
    "https://schema.org/customer": [
      {
        "@type": [ "https://schema.org/Person" ],
        "https://schema.org/name": [ { "@value": "Erika Mustermann" } ],
        "https://schema.org/address": [
          {
            "@type": [ "https://schema.org/PostalAddress" ],
            "https://schema.org/addressCountry": [
              { "@id": "http://publications.europa.eu/resource/authority/country/ITA" }
            ]
          }
        ]
      }
    ]
  }
]
```

The seller and customer were typed differently from the same definition, and
the `address` mapping, written once, applied to both, because the annotations
compose through [`$ref`](https://www.learnjsonschema.com/2020-12/core/ref/)
exactly as validation does. One schema. One pass. If the instance is invalid,
no [RDF](https://www.w3.org/RDF/) comes out at all. That output is in standard
[JSON-LD expanded
form](https://www.w3.org/TR/json-ld11/#expanded-document-form), canonical and
context-free.

If you would rather keep the document looking like the JSON your
consumers already parse, compact it against a context of your choosing. For
example, consider this `context.json`:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "orderNumber": "schema:orderNumber",
    "seller": "schema:seller",
    "customer": "schema:customer",
    "name": "schema:name",
    "address": "schema:address",
    "country": {
      "@id": "schema:addressCountry",
      "@type": "@id",
      "@context": { "@base": "http://publications.europa.eu/resource/authority/country/" }
    }
  }
}
```

You can convert to JSON-LD emitting the shape your consumers already know how
to parse, with its semantics embedded, as follows:

```sh
$ jsonschema rdf schema.json instance.json --compact context.json
```

```json
{
  "@type": "schema:Order",
  "orderNumber": "AC-2026-0042",
  "seller": {
    "@type": "schema:Organization",
    "name": "ACME GmbH",
    "address": { "@type": "schema:PostalAddress", "country": "DEU" }
  },
  "customer": {
    "@type": "schema:Person",
    "name": "Erika Mustermann",
    "address": { "@type": "schema:PostalAddress", "country": "ITA" }
  },
  "@context": {
    "schema": "https://schema.org/",
    "orderNumber": "schema:orderNumber",
    "seller": "schema:seller",
    "customer": "schema:customer",
    "name": "schema:name",
    "address": "schema:address",
    "country": {
      "@id": "schema:addressCountry",
      "@type": "@id",
      "@context": { "@base": "http://publications.europa.eu/resource/authority/country/" }
    }
  }
}
```

In other words, the context is your choice of projection. The schema
annotations remain the single source of truth.

## JSON-LD and the knowledge graph economy

Look again at what came out of that command. The expanded form is
[JSON-LD](https://json-ld.org), which is the JSON serialisation of
[RDF](https://www.w3.org/RDF/), the [W3C](https://www.w3.org/RDF/)'s model for
describing anything as a graph of subject-predicate-object (triple) statements.
Build enough of those statements and you have a knowledge graph. The idea is
simple: give every thing (such as a person, a country, a product, etc) one
shared identifier, and record every fact as a link between those identifiers.
Do that, and data scattered across systems, formats, and organisations becomes
a single connected web that anyone, and any machine (including AI), can query
across sources and reason over as a whole. *That is the door our example
quietly opened, and it leads somewhere very large.*

Almost everything you would call authoritative knowledge is already living in
this way. [Wikidata](https://en.wikipedia.org/wiki/Wikidata) holds 1.65 billion
statements. [UniProt](https://sparql.uniprot.org/), the reference database of
protein knowledge, exposes [over 190 billion
triples](https://www.expasy.org/resources/uniprot-sparql-endpoint) through what
is widely cited as the largest public
[SPARQL](https://www.w3.org/TR/sparql11-query/) endpoint on earth, and the US
[National Institutes of Health](https://pubchemdocs.ncbi.nlm.nih.gov/rdf)
publishes its PubChem chemistry database as more than 130 billion triples of
its own. Both are nodes in a life-sciences web that interlinks through the
[Linked Open Data cloud](https://lod-cloud.net/) and its [1,658 connected
datasets](https://dl.acm.org/doi/full/10.1145/3786331). Governments are wired
the same way: [every EU legal act is
RDF](https://op.europa.eu/en/web/eu-vocabularies/cellar) behind a public
endpoint, and [France's statistics office](https://rdf.insee.fr/), its
[national library](https://data.bnf.fr/en/semanticweb), and
[Europeana's](https://www.europeana.eu) 50 million cultural objects all publish
in it. Healthcare does the same through [HL7
FHIR](https://www.hl7.org/fhir/rdf.html), which defines an RDF form for the
records it moves between systems. So does big tech: [Google, Microsoft,
Facebook, eBay, and IBM each run their
own](https://cacm.acm.org/practice/industry-scale-knowledge-graphs/). And it
is how AI now gets its facts, since a model on its own is a [parametric memory
that hallucinates](https://arxiv.org/html/2411.14258v1) and the fix is to
ground it in a graph, the pattern behind
[GraphRAG](https://arxiv.org/abs/2404.16130).

![France's national library publishes its entire catalogue as linked data. Every record, like this one for Victor Hugo, the 19th-century French novelist behind Les Misérables, is a node in a knowledge graph, downloadable as RDF and JSON-LD (highlighted). Source: [Bibliothèque nationale de France](https://data.bnf.fr/en/11907966/victor_hugo/).](victor-hugo.webp)

None of them do this for tidiness. *They do it because the graph is where data
turns into value*. We know that data is a valuable asset, but raw data is worth
only what you can refine it into, and the knowledge graph is the refinery. When
Google launched its [Knowledge Graph in
2012](https://cacm.acm.org/practice/industry-scale-knowledge-graphs/) under the
slogan "things, not strings", search stopped matching text and started
understanding entities. By 2016, [Google reported that it held 70 billion facts
and answered roughly a third of its 100 billion monthly
searches](https://en.wikipedia.org/wiki/Knowledge_Graph_%28Google%29) straight from
it. The mechanism is
[RDF](https://www.w3.org/RDF/)'s shared identifiers. They allow independently
produced data to become joinable, so the graph is worth more than the databases
poured into it, and every entity added compounds the value of the ones already
there. And this compounding now has a price. A [data.world
benchmark](https://arxiv.org/abs/2311.07509) measured a language model at 16%
accuracy over a raw SQL database and 54% over the same data as a knowledge
graph.
[Gartner](https://www.gartner.com/en/newsroom/press-releases/2026-04-16-gartner-says-organizations-with-successful-ai-initiatives-invest-up-to-four-times-more-in-data-and-analytics-foundations)
finds the organisations with the most mature data foundations achieve up to 65%
greater business outcomes. And the [knowledge graph market is projected to grow
from $1.06 billion in 2024 to $6.93 billion by
2030](https://www.globenewswire.com/news-release/2025/01/31/3018718/0/en/Knowledge-Graph-Research-Report-2025-Global-Market-to-Reach-6-93-Billion-by-2030-from-1-06-Billion-in-2024-Growing-at-a-CAGR-of-36-6-Changing-for-Organizations-Deal-with-Large-Data.html).

## Bridging JSON Schema and JSON-LD

Zooming out, structure and meaning are things you constantly need at once, and
today they live in different languages. [JSON Schema](https://json-schema.org)
owns structure, whether the container is [an OpenAPI
specification](https://www.sourcemeta.com/blog/json-schema-dominates-openapi/),
[an AI tool
definition](https://www.sourcemeta.com/blog/ai-only-speaks-json-schema/), or [a
national data
registry](https://www.sourcemeta.com/blog/g7-runs-on-json-schema/). Then,
[JSON-LD](https://json-ld.org) owns meaning, as the last section showed. *The
catch is that a single JSON document routinely needs both at once, and inside
that document the two languages cannot see each other*. A [JSON
Schema](https://json-schema.org) cannot say that `family_name` means
[`schema.org/familyName`](https://schema.org/familyName), and a
[JSON-LD](https://json-ld.org) context cannot say that `family_name` is a
required string conditional on the presence of `first_name`.

![A real Thing Description from the W3C Web of Things standard (Example 2). Most of it is JSON Schema (`properties`, `type`), sprinkled with JSON-LD to add meaning (`@context`, and `@type: saref:LightSwitch` pointing at a semantic vocabulary). The two languages sit in one document but do not integrate: the schema keywords cannot see the semantic ones, or the other way round. Source: [W3C WoT Thing Description 1.1, Example 2](https://www.w3.org/TR/wot-thing-description11/).](wot-thing-description.webp)

Now picture closing that gap. For example, the [EU wallet
schema](https://github.com/EWC-consortium/eudi-wallet-rulebooks-and-schemas)
already validates every credential a wallet API handles. Put the meaning inside
it, and that one file also emits the knowledge graph. No second artefact to
author, review, version, or keep in sync. The meaning is defined exactly once
next to its validation constraints, and every payload pours into the graph for
free. In other words, intermixing JSON Schema and JSON-LD gives the
[RDF](https://www.w3.org/RDF/) world a powerful validation story, and it gives
the [JSON Schema](https://json-schema.org) world a significant upgrade in
semantics and knowledge graph integration.

The reason to state the prize so plainly is that the alternative, two artefacts
kept in sync by hand, is everywhere, and it is a heavy tax. The [Common
Workflow Language](https://www.commonwl.org) project named it in 2015, when it
abandoned existing schema languages because ["none understand linked
data"](https://github.com/common-workflow-language/schema_salad):

> "one must maintain separate JSON schema, JSON-LD context, RDF schema, and
> human documentation, despite significant overlap of content and obvious
> need for these documents to stay synchronized."

A decade later that tax is institutional. [W3C Verifiable Credentials
2.0](https://www.w3.org/TR/vc-data-model-2.0/), the standard beneath the EU
wallet, carries a [JSON-LD](https://json-ld.org) `@context` for meaning and a
separate [`credentialSchema`](https://www.w3.org/TR/vc-json-schema/) for
structure in every single credential. [GS1's
EPCIS](https://github.com/gs1/EPCIS), the global supply-chain standard, ships
`EPCIS-JSON-Schema.json` and `epcis-context.jsonld` side by side in one
repository. [FIWARE's Smart Data
Models](https://smart-data-models.github.io/data-models/) keep a
schema for every entry in the catalogue, paired with a JSON-LD context.
[Gaia-X](https://docs.gaia-x.eu/technical-committee/architecture-document/22.10/self-description/),
Europe's flagship cloud-federation project, pairs a [JSON-LD](https://json-ld.org)
self-description with a separate SHACL shape for every participant.
[Adobe](https://github.com/adobe/xdm/blob/master/docs/introduction.md)
specified its Experience Data Model in both grammars at once, then had to bolt
on a ["Compatibility
Mode"](https://experienceleague.adobe.com/en/docs/experience-platform/xdm/api/appendix)
that flattens the [JSON-LD](https://json-ld.org) namespacing out for its own platform.
And the request to fix this at the source has sat [open on the JSON Schema
issue tracker since April
2017](https://github.com/json-schema-org/json-schema-vocabularies/issues/13).
Everyone pays the tax. Nobody has figured out how to fully remove it.

## The double edge of expressiveness

So now you might wonder, with the prize this clear and the demand this old, why
has this stayed unsolved?

Because the obvious fix, embed the `@context` in the schema, *only works on the
easy case*. That is what [the Italian government's REST API Linked Data
Keywords IETF
draft](https://datatracker.ietf.org/doc/draft-polli-restapi-ld-keywords/) does.
This is often enough for standalone simple schemas. But in practice, schemas
are very often not standalone, and very often not simple. At scale, models of
rich cross-referenced schemas are extremely common for schema reusability and
data governance purposes.

What makes it hard to solve this for complex schemas is the very thing JSON
Schema is best at. JSON Schema is a [remarkably expressive
language](https://dl.acm.org/doi/10.1145/2872427.2883029). The meaning of a
property can be split across files with
[`$ref`](https://www.learnjsonschema.com/2020-12/core/ref/), combined through
logical applicators like
[`anyOf`](https://www.learnjsonschema.com/2020-12/applicator/anyof/), or made
to depend on the data in complex ways through
[`if`](https://www.learnjsonschema.com/2020-12/applicator/if/)/[`then`](https://www.learnjsonschema.com/2020-12/applicator/then/)/[`else`](https://www.learnjsonschema.com/2020-12/applicator/else/),
and other similar keywords. With
[`$dynamicRef`](https://www.learnjsonschema.com/2020-12/core/dynamicref/) a
schema even resolves a reference differently depending on the context it is
evaluated in, so there is no static document to analyse ahead of time and the
meaning is decided during evaluation, against the data. This is why validating
[Modern JSON Schema is PSPACE-complete](https://arxiv.org/abs/2307.10034). In
comparison, a [JSON-LD](https://json-ld.org) context has none of this. It is a
flat table of names, and it cannot follow a schema whose properties change
meaning by position or by data. It could never, for instance, produce the order
from our example, where the very same `party` definition became a
[`Person`](https://schema.org/Person) or an
[`Organization`](https://schema.org/Organization) depending on a property in
the payload.

If you take this as a criticism, that JSON Schema is simply too complicated, you
have it backwards. The complexity is not over-engineering. It is the language
earning its keep. Most people who resent JSON Schema for its constraint-driven
complexity have simply not yet met the problems that demand such complexity.
And when they do, they are thankful that the expressiveness exists.

## A decade of attempts

But all of that expressiveness is what a bridge to
[JSON-LD](https://json-ld.org) has to carry across, and it is why no one had
built one that holds. Everyone who tried faced the same fork: strip the
expressiveness away so the mapping to [RDF](https://www.w3.org/RDF/) turns
easy, or keep it and try to pay the price. A decade of attempts went both ways,
and came up short in both cases.

The strippers made the problem vanish by not having it. The [Common Workflow
Language's Schema Salad](https://www.commonwl.org/draft-3/SchemaSalad.html)
rebuilt the schema language on top of Avro, while
[LinkML](https://linkml.io/linkml/generators/jsonld-context.html) and the
automotive industry's
[Catena-X](https://catenax-ev.github.io/docs/next/standards/CX-0003-SAMMSemanticAspectMetaModel)
generate JSON Schema from a separate RDF model you must author first. This
path has real public-sector uptake: Switzerland's
[eCH](https://www.ech.ch/) e-government standards group authors the data
standards for the Swiss political system in LinkML precisely so that [JSON
Schema and OWL can be regenerated side by side on every
commit](https://github.com/swiss/political-affairs-ech-group), further proof
of how badly the two worlds need each other. A simpler
language projects into RDF more cleanly, but simplicity is the price: you
surrender the conditionals and constraints that are the reason to reach for
JSON Schema at all, and that [no other mainstream schema language
matches](https://www.chiply.dev/post-schema-languages). "Those languages define
structure", as Charlie Holland puts it, while "JSON Schema defines structure
and constraints".

The embracers kept JSON Schema and hit the wall head-on. The [Open Geospatial
Consortium's tooling](https://github.com/opengeospatial/ogc-na-tools) assembles
the context from the schema at build time, and its own source carries a
thirty-line comment about ["binding
bubbling"](https://ogcincubator.github.io/bblocks-docs/create/semantic-uplift),
where a referenced schema's mappings silently overwrite the parent's. Others
went sideways: [MuleSoft](https://github.com/mulesoft-labs/json-ld-schema)
validated existing JSON-LD with JSON Schema before being archived at
"pre-alpha", and [RML](https://rml.io/specs/rml/) and the AI-assisted
[MetaConfigurator](https://arxiv.org/abs/2606.07094) add a third artefact to
drift from the other two. Even
[Adobe](https://github.com/adobe/xdm/blob/master/docs/introduction.md) and
[Autodesk](https://www.research.autodesk.com/app/uploads/2023/03/TranslatingJSONSchemalogicsintoOWLaxioms.pdf_recQnFKTPMiScRn8N.pdf)
took runs at this JSON Schema and JSON-LD interoperability problem.

![How OGC's tooling builds the JSON-LD context: a static second pass walks the compiled schema tree through every `$ref`, `allOf`, `anyOf`, and `oneOf`, collecting mappings into one flat `@context`. In their own words, "the assembly is really schema traversal". It is re-creating evaluation at build time, and that is why it cannot follow a schema whose meaning depends on the data: with no instance to run against, a static walk has no way to know which `if`/`then`/`else` branch or `$dynamicRef` target applies. Source: [OGC Building Blocks, semantic uplift documentation](https://ogcincubator.github.io/bblocks-docs/create/semantic-uplift).](ogc-context-assembly.webp)

## Five ways to fall short

For all their differences, the attempts share the same gaps. None couples
validation and emission in one pass. None reproduces the composition inside the
schema itself, and the closest do it as a lossy build step. None handles
conditional meaning, and none mints identifiers from the data.

The most serious attempt is telling in where it came from. Italy runs both
worlds at national scale: a [network of RDF
ontologies](https://github.com/italia/daf-ontologie-vocabolari-controllati)
that models its public administration as a knowledge graph, and a [national
platform of services](https://www.sourcemeta.com/blog/g7-runs-on-json-schema/)
described in OpenAPI and JSON Schema. It felt the collision before anyone else
and set out to close it.

![Italy's Core Person Vocabulary, one of the government RDF ontologies in its national semantic catalogue. It defines the concept of a Person, the same concept our example mapped, and is authored by the national statistics office (ISTAT) and digital agency (AgID). Running a whole network of these alongside a national JSON Schema API platform is why Italy hit the collision first. Source: [schema.gov.it, Catalogo Nazionale della Semantica dei Dati](https://schema.gov.it/lode/extract?url=https://w3id.org/italia/onto/CPV).](italy-cpv-person-ontology.webp)

Even so, [Roberto Polli's REST API Linked Data Keywords IETF proposal for this
problem](https://datatracker.ietf.org/doc/draft-polli-restapi-ld-keywords/)
(now at its ninth revision) admits the limit:

> "Automatic composability is not an explicit goal of this specification
> because of its complexity. [...] These issues can be tackled in future
> versions of this specifications."

Against what a working solution actually needs, the pattern is stark:

| Attempt | Standard JSON Schema | Single evaluation pass | Composition | Conditional meaning | IRI minting |
|---|:---:|:---:|:---:|:---:|:---:|
| Polli draft (embed context) | yes | no | no | no | no |
| OGC (generate context) | yes | no | partial | no | no |
| Schema Salad (new language) | no | no | no | no | partial |
| LinkML / Catena-X, automotive (separate model) | no | no | no | no | no |
| MuleSoft, Salesforce (validate JSON-LD) | partial | no | [`$ref`](https://www.learnjsonschema.com/2020-12/core/ref/) only | no | no |
| RML / MetaConfigurator (mapping) | no | no | no | no | yes |
| Adobe XDM (maintain both by hand) | partial | no | no | no | no |
| **Sourcemeta** | **yes** | **yes** | **yes** | **yes** | **yes** |

After a decade of attempts, from academic prototypes to Adobe, Salesforce, and
the automotive industry, the wall was still standing. That is where we come in.

## How we cracked it

So how do you carry all of that expressiveness into
[RDF](https://www.w3.org/RDF/)? Every prior attempt treated the schema as a
document to be parsed and mapped. We treat it as a program to be run.
Sourcemeta maintains [Blaze](https://github.com/sourcemeta/blaze), a
high-performance C++ [JSON Schema
validator](https://www.vldb.org/pvldb/vol19/p279-viotti.pdf) that compiles a
schema into a low-level program and executes it against an instance. Around
that execution we built a full custom [JSON-LD](https://json-ld.org) engine
that rides along, producing the [RDF](https://www.w3.org/RDF/) in lockstep with
the validation itself. So the meaning is built during evaluation, as part of
the process, and the dynamism that defeated every static approach is carried by
the run instead of fought.

The result is full support for every construct JSON Schema has, in one file and
one pass, with no second artefact to drift. The order from our initial example,
which no prior tool could produce due to its use of some advanced keywords, is
not a special case. It is simply what the engine does. If a schema can validate
your data, it can now describe what that data means.

## Use it today

The vocabulary is ten keywords under the `x-jsonld-` prefix, and the [CLI
documentation](https://github.com/sourcemeta/jsonschema/blob/main/docs/rdf.markdown)
is for now the full reference (we are aiming for a proper spec around it soon).
You can use it today from the command line by pointing [`jsonschema
rdf`](https://github.com/sourcemeta/jsonschema/blob/main/docs/rdf.markdown) at
a schema and an instance, and get [JSON-LD](https://json-ld.org) back, exactly
as we did above.

![The ten `x-jsonld-*` keywords of the vocabulary, from the JSON Schema CLI documentation. Each annotates a subschema to map it into JSON-LD: `x-jsonld-id` for the predicate IRI a property maps to, `x-jsonld-type` for the node `@type`, `x-jsonld-self` to mint a node `@id` from instance values, and so on. Because they are plain `x-` extension keywords, annotated schemas stay valid for every other JSON Schema tool. Source: [JSON Schema CLI RDF documentation](https://github.com/sourcemeta/jsonschema/blob/main/docs/rdf.markdown)](annotation-vocabulary.webp)

But the command line is the small version of the idea. The same engine ships in
[Sourcemeta One](https://one.sourcemeta.com/api/#rdf), our flagship schema
registry, where it runs over HTTP. Every schema the registry governs can turn
an instance into [JSON-LD](https://json-ld.org) on request, *making meaning an
API call* (available through MCP too).

With this, you can send your data to the registry and know what that data
means, resolved against the schemas your organisation has already agreed on, so
the transformation happens once, at the infrastructure layer, instead of being
rebuilt inside every service.

The idea is for schemas, their governance, and now their meaning to finally
live in one place. So if you have data and you want to know what it means, you
ask Sourcemeta One.
