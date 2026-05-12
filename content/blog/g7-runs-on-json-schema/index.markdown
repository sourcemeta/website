+++
title = "Every G7 government already runs on JSON Schema"
date = 2026-05-06
author = "jviotti"
+++

> TL;DR: Every G7 government (United States, United Kingdom, France, Germany,
> Italy, Japan, and Canada) runs its digital public infrastructure on JSON
> Schema. So do nine out of ten of the OECD's top digital governments in
> the 2025 ranking. France and Italy already operate national registries that
> support JSON Schema, and the Netherlands is building one. From December 2026,
> every EU country will run mandatory digital identity infrastructure on [JSON
> Schema](https://github.com/EWC-consortium/eudi-wallet-rulebooks-and-schemas/tree/main/data-schemas),
> under eIDAS 2.0.

## The public sector runs on APIs

In 2015, [TechCrunch
declared](https://techcrunch.com/2015/05/06/apis-fuel-the-software-thats-eating-the-world/)
that *APIs fuel the software that's eating the world*. And as you probably
know, the public sector is no exception. For example, the UK's [API
Catalogue](https://github.com/co-cddo/api-catalogue) currently federates [1,791
API
entries](https://raw.githubusercontent.com/co-cddo/api-catalogue/main/data/catalogue.csv)
across UK public-sector publishers. The Netherlands' [national API
registry](https://apis.developer.overheid.nl/) currently lists 302 APIs. The
community-run [bund.dev](https://bund.dev/) portal currently indexes more than
60 German federal APIs. Italy publishes its [API
catalogue](https://api.gov.it/en/catalogue), which currently carries 14,672
e-services across 9,398 adhering public and private entities.

![Top PDND e-services by number of enabled entities, filtered to central
public administrations as providers. PagoPA's SEND digital-notifications
service leads with around 7,000 enabled entities, followed by four ANNCSU
address-registry services from Agenzia delle Entrate (around 5,032, 3,070,
2,509, and lower), then Ministero dell'Interno's residence, family, and
citizenship verification services, and AgID's INAD digital-domicile registry.
Source: [PDND interop dashboard](https://www.interop.pagopa.it/numeri)](pdnd-services.webp)

In terms of scale, Denmark's [Central Data Distribution
Platform](https://datafordeler.dk/) API ["processes more than 70 million calls
daily, and handles a daily data volume of 2.5
terabytes"](https://netcompany.com/netcompany-takes-over-one-of-europes-largest-data-platforms-and-sends-digital-denmark-into-an-ai-ready-future/).
The United States [data API](https://api.data.gov/) is *"used by 25 agencies
for over 450 APIs"*. South Korea's [data
API](https://www.data.go.kr/en/index.do) offers ["87,000 public data sets and
11,000 open
APIs"](https://govinsider.asia/intl-en/article/south-korea-leverages-open-government-data-for-ai-development).
The UK Government Digital Service publishes an [API exposing more than 8.4
million UK legal documents](https://github.com/i-dot-ai/lex). Beyond datasets,
the [GOV.UK Notify](https://www.notifications.service.gov.uk/) API [sent 12
billion messages by February
2026](https://gds.blog.gov.uk/2026/02/05/more-than-a-helpdesk-user-supports-role-in-helping-gov-uk-notify-send-12-billion-messages/)
on behalf of more than 11,000 public-sector services. Estonia's
[X-Road](https://x-road.global/) API exchange links ["more than 1,000
inter-connected databases covering some 1,700 services" and answers "more than
50 million enquiries every
month"](https://ec.europa.eu/regional_policy/en/projects/europe/x-road-cross-border-co-development-of-national-data-exchange-platform).
In the US, the Law Enforcement Information eXchange (LInX) connects ["thousands
of law enforcement agencies" sharing "1.8 billion records amongst each
other"](https://federalnewsnetwork.com/wp-content/uploads/2025/09/Book-of-NIEM-v10-8-4-25.pdf).

The AI wave is only reinforcing the fact that the public sector runs on APIs.
As Kin Lane puts it, ["MCP is an
API"](https://apievangelist.com/blog/2026/05/07/seeing-mcp/), and adoption
within the public sector has already started. For example, consider the [US
GovInfo MCP](https://www.govinfo.gov/features/mcp-public-preview), the [US
Census Bureau
MCP](https://github.com/uscensusbureau/us-census-bureau-data-api-mcp), France's
[data.gouv.fr
MCP](https://www.data.gouv.fr/posts/experimentation-autour-dun-serveur-mcp-pour-datagouv),
Japan's Digital Agency
[jgrants-mcp-server](https://github.com/digital-go-jp/jgrants-mcp-server), and
the UK Government Digital Service's [Parliament
MCP](https://github.com/i-dot-ai/parliament-mcp).

## OpenAPI becomes national policy

Like the rest of the industry, the public sector has also settled on
[OpenAPI](https://www.openapis.org) as the format for describing APIs in a
machine-human readable way.

Many governments have explicitly written "use OpenAPI" into national API
standards documents. For example, [Canada mandates OpenAPI for all federal
RESTful
APIs](https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/government-canada-standards-apis.html).
The United Kingdom's Open Standards Board states that ["Describing RESTful
APIs with OpenAPI 3 is recommended by the government Open Standards
Board"](https://www.gov.uk/government/publications/recommended-open-standards-for-government/describing-restful-apis-with-openapi-3).
Italy goes a step further: every API published on the National Digital Data
Platform (PDND) is validated by ["running the OAS Checker with the Italian
Guidelines Full profile and obtaining 0
errors"](https://github.com/italia/api-oas-checker-rules). Japan's Digital
Agency states that ["Government agencies are expected to adopt OAS [...] to
make development more
efficient"](https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/fe5f0631-c978-42db-8416-6759cfa7e53a/f6ca1b7b/20241001_policies_development_management_outline_04.pdf).

The following table offers a more exhaustive summary:

| Country | Mandate or standard | Source |
|---|---|---|
| 🇨🇦 Canada | Federal RESTful API mandate | [Standards on APIs](https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/government-canada-standards-apis.html) |
| 🇬🇧 United Kingdom | Open Standards Board recommendation, [GDS API technical and data standards](https://www.gov.uk/guidance/gds-api-technical-and-data-standards) guidance | [gov.uk](https://www.gov.uk/government/publications/recommended-open-standards-for-government/describing-restful-apis-with-openapi-3) |
| 🇫🇷 France | OAS required for national API registry submissions | [SEMIC 2024](https://interoperable-europe.ec.europa.eu/collection/semic-support-centre/semantic-enrichment-apis-openapi-case-study) |
| 🇮🇹 Italy | Zero-error PDND validation gate (AgID) | [api-oas-checker-rules](https://github.com/italia/api-oas-checker-rules) |
| 🇯🇵 Japan | Digital Agency DS-464-2 (Sept 2024) | [DS-464-2](https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/fe5f0631-c978-42db-8416-6759cfa7e53a/f6ca1b7b/20241001_policies_development_management_outline_04.pdf) |
| 🇦🇺 Australia | NAPIDS MUST | [api.gov.au](https://api.gov.au/), [source repo](https://github.com/apigovau/national-api-design-standards), [architecture standard](https://architecture.digital.gov.au/standard/application-programming-interfaces-apis-standard) |
| 🇳🇿 New Zealand | Digital.govt.nz RECOMMEND, Te Whatu Ora HISO 10108 MUST, [Draft NZ API Standard v1.0](https://docref.digital.govt.nz/nz/dia/nz-api-standard/draft/en/) (Nov 2025) | [API Guidelines](https://www.digital.govt.nz/standards-and-guidance/technology-and-architecture/application-programming-interfaces-apis/api-guidelines), [HISO 10108](https://apistandards.digital.health.nz/api-publishing/openapi-specifications/) |
| 🇫🇮 Finland | OpenAPI 3 required at Suomi.fi DEL | [Suomi.fi DEL](https://kehittajille.suomi.fi/services/data-exchange-layer/support-articles/data-exchange/x-road-communication-protocol) |
| 🇪🇪 Estonia | RIHA describes machine interfaces in OpenAPI | [RIHA-Index](https://e-gov.github.io/RIHA-Index/), [Tehnoloogiavalikud](https://e-gov.github.io/RIHA-Index/Tehnoloogiavalikud) |
| 🇸🇬 Singapore | APEX Cloud + GovTech OpenAPI Linter as a service, [GovTech recommends modern standards such as OpenAPI](https://www.tech.gov.sg/technews/three-important-considerations-in-api-development/) | [apex.gov.sg](https://www.apex.gov.sg/) |
| 🇪🇸 Spain | 2025 Practical Guide for publishing Open Data with APIs | [datos.gob.es](https://datos.gob.es/sites/default/files/doc/file/guia_publicacion_apis.pdf) |
| 🇨🇭 Switzerland | Federal guidelines MUST | [swiss/api-guidelines](https://github.com/swiss/api-guidelines) |
| 🇧🇪 Belgium | Belgif Federal Interoperability Framework, OpenAPI 3.0 | [Belgif](https://www.belgif.be/specification/rest/api-guide/) |
| 🇳🇱 Netherlands | API Design Rules on Forum Standaardisatie's comply-or-explain mandatory list since 2019 | [logius-standaarden](https://logius-standaarden.github.io/API-Design-Rules/) |

Even beyond mandates, the European Commission found that ["OAS was used by
almost half of all reviewed API
portals"](https://interoperable-europe.ec.europa.eu/collection/semic-support-centre/semantic-enrichment-apis-openapi-case-study)
across the European public-sector portals it surveyed.

The picture extends across borders too.  [X-Road](https://x-road.global/), an
open-source data-exchange platform that uses OpenAPI to describe its REST
services, was jointly founded by Estonia, Finland, and Iceland through the
[Nordic Institute for Interoperability Solutions
(NIIS)](https://www.niis.org/).  Estonia operates it domestically as
[X-tee](https://www.ria.ee/en/state-information-system/data-exchange-platforms/data-exchange-layer-x-tee)
and Finland as the [Suomi.fi data exchange
layer](https://kehittajille.suomi.fi/services/data-exchange-layer/). X-Road has
been adopted as the national data exchange in Cambodia (as
[CamDX](https://x-road.global/xroad-case-studies-library/2024/10/21/camdx-is-cambodias-national-data-exchange-solution-and-its-based-on-x-road)),
Japan ([via PlanetCross at
Nichigas](https://investinestonia.com/japans-major-gas-company-nichigas-started-to-use-a-software-solution-based-on-estonian-x-road/)),
[El Salvador](https://x-road.global/xroad-case-studies-library/2024/10/21/first-steps-towards-interoperability-in-the-public-sector-of-el-salvador),
and Kyrgyzstan (as
[Tunduk](https://x-road.global/xroad-case-studies-library/2026/5/4/the-tunduk-story-how-kyrgyzstan-built-a-digital-nation-on-an-open-source-backbone)).

## Both OpenAPI and MCP are all about JSON Schema

We have established that public-sector API adoption runs through OpenAPI and
MCP. What is easy to miss, but more consequential, is that both share the same
substrate: [JSON Schema](https://json-schema.org).

More precisely, OpenAPI builds on top of JSON Schema. While OpenAPI offers
syntax to declare endpoints and top-level metadata, what you use to actually
describe request bodies, responses, headers, and query parameters is *JSON
Schema embedded within OpenAPI*. In fact, we previously found that *["in 76% of
modern OpenAPI specs, JSON Schema dominates the specification"]({{< ref
"/blog/json-schema-dominates-openapi" >}})*. So when governments work on
OpenAPI at the scale we have just seen, they are, in the large majority,
working on JSON Schema. **A government OpenAPI mandate is, on closer reading, a
JSON Schema mandate.**

![From our study of public OpenAPI specifications across industry, the JSON
Schema content embedded within an OpenAPI document often dominates the file.
For well-known production APIs such as Mailchimp, the embedded JSON Schema can
exceed 90% of the contents of the file. From [*In 76% of modern OpenAPI specs,
JSON Schema dominates the specification*]({{< ref
"/blog/json-schema-dominates-openapi"
>}})](/blog/json-schema-dominates-openapi/providers.webp)

The same principle holds for MCP. The [official
specification](https://modelcontextprotocol.io/specification/2025-11-25) is
built on [JSON Schema 2020-12](https://www.learnjsonschema.com/2020-12/), and
every MCP tool exposes its inputs as a JSON Schema object. The pattern reaches well beyond MCP. As we previously argued, *["the only
schema language AI speaks is JSON Schema"]({{< ref
"/blog/ai-only-speaks-json-schema" >}})*. Every major LLM provider's
tool-calling interface, every AI product, and every agent framework has
converged on the same substrate.
As Charlie Holland puts it, [*JSON Schema has become "the interface definition
language for AI tools"*](https://www.chiply.dev/post-schema-languages).
**A government MCP server is, on closer reading, a JSON Schema deployment.**

Taken together, public-sector use of OpenAPI and MCP rank among the largest
JSON Schema deployments in the world.

## The rise of national schema registries

If OpenAPI and MCP are both about JSON Schema, it is no surprise that
governments are starting to treat schemas as their own layer, separable from
any particular API specification and reusable across OpenAPI, MCP, and
potentially other future consumers. They operate their schemas as standalone
national assets.

France runs [schema.data.gouv.fr](https://schema.data.gouv.fr/) as a national
multi-format schema registry. Among its JSON Schemas, the [public procurement
format](https://github.com/139bercy/format-commande-publique) maintained by the
Ministry of Economy and Finance is used by every French state entity to publish
all public contracts above €40,000. The [data inclusion
schema](https://github.com/gip-inclusion/data-inclusion-schema) backs the
[national platform](https://www.data.inclusion.gouv.fr/) aggregating
social-services data across France Travail, CAF, and local social services. And
the [cycling facilities
format](https://schema.data.gouv.fr/etalab/schema-amenagements-cyclables/)
feeds the Base Nationale des Aménagements Cyclables, France's mandatory
contribution to the EU Regulation 2017/1926 multimodal-travel National Access
Point at [transport.data.gouv.fr](https://transport.data.gouv.fr/).

![The [schema.data.gouv.fr](https://schema.data.gouv.fr/schemas.html?q=&type=jsonschema)
registry filtered to JSON Schema entries. Visible cards include the
cycling-facilities format, the essential data of French public contracts, and
on-street parking footprints](schema-data-gouv-fr.webp)

Italy runs [schema.gov.it](https://schema.gov.it/) providing JSON Schemas
packaged as OpenAPI components, with each schema's properties cross-referenced
to [Italian government RDF ontologies](https://w3id.org/italia).  For example, the
[INPS National Data Catalog](https://github.com/INPS-it/NDC) publishes the JSON
Schemas backing core social-security workflows: [NASPI unemployment-benefit
applications](https://github.com/INPS-it/NDC/tree/main/assets/schemas/prestazione-naspi),
[pension credit purchase
requests](https://github.com/INPS-it/NDC/tree/main/assets/schemas/pratica-riscatto),
and the [A1 certificate for cross-border workers under EU Regulation
883/2004](https://github.com/INPS-it/NDC/tree/main/assets/schemas/pratica-rilascio-modello-a1).
Italy is also pioneering the IETF draft [*REST API Linked Data
Keywords*](https://www.ietf.org/archive/id/draft-polli-restapi-ld-keywords-07.html),
which defines two new JSON Schema keywords for embedding JSON-LD context
directly into OpenAPI and JSON Schema documents.

![The [schema.gov.it](https://schema.gov.it/search?type=SCHEMA&sortBy=TITLE&direction=ASC)
national semantic catalogue, jointly operated by the Dipartimento per la
Trasformazione Digitale and Istat, filtered to entries of type
Schema](schema-gov-it.webp)

The Netherlands [announced in April
2026](https://developer.overheid.nl/blog/2026/04/23/don-update) that they are
building `schemas.overheid.nl`, a central register for reusable JSON Schemas
and OpenAPI components.

## The rise of national schema collections

One tier down, individual agencies and research bodies operate their own
reusable pure JSON Schema collections, often spanning entire scientific or
regulatory domains.

NASA uses JSON Schema across multiple missions and platforms. It publishes
[JSON Schemas](https://github.com/nasa-gcn/gcn-schema) for the [General
Coordinates Network](https://gcn.nasa.gov/) alert format. When LIGO detects a
gravitational wave or Swift detects a gamma-ray burst, alerts in this format go
out within seconds so observatories around the world can slew toward the source
while it is still visible. NASA also maintains the [Common Metadata
Repository](https://github.com/nasa/Common-Metadata-Repository) (CMR), which
defines the Unified Metadata Model in JSON Schema and underpins the entire
[EOSDIS Earth-science catalogue](https://www.earthdata.nasa.gov/). Any
researcher querying NASA Earthdata for satellite imagery, climate datasets, or
atmospheric measurements hits records validated against this model.

![The [NASA General Coordinates Network Schema
Browser](https://gcn.nasa.gov/docs/schema/v7.0.0/gcn/notices) for v7.0.0,
showing mission-specific JSON Schema folders for BOOM, BurstCube, CHIME,
Einstein Probe, Fermi, Glowbug, HEASARC, IceCube, KM3NeT, and
others](nasa-gcn-schema.webp)

NIST publishes [OSCAL](https://github.com/usnistgov/OSCAL/releases/latest),
the Open Security Controls Assessment Language, as the JSON-Schema-backed
control language behind
[NIST 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final), [NIST
800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final), [NIST
800-218](https://csrc.nist.gov/pubs/sp/800/218/final), and [CSF
v2.0](https://www.nist.gov/cyberframework). Cloud providers seeking [FedRAMP
authorization](https://www.fedramp.gov/), defense contractors handling
[Controlled Unclassified Information](https://www.archives.gov/cui), and any
organisation aligning with the US Cybersecurity Framework can now express their
entire compliance posture as JSON validated against OSCAL.

The US [National Cancer Institute](https://www.cancer.gov/) (part of
[NIH](https://www.nih.gov/)) publishes the [GDC Data
Dictionary](https://github.com/NCI-GDC/gdcdictionary), 89 JSON Schemas defining
every entity in the [Genomic Data Commons](https://gdc.cancer.gov/), the
federal cancer-genomics platform pooling harmonised tumour data from across NCI
programmes. Every biospecimen, patient case, sequencing aliquot, mutation call,
and clinical record submitted to the GDC has to validate against one of these
schemas.

![The [GDC pathology-report
schema](https://github.com/NCI-GDC/gdcdictionary/blob/develop/src/gdcdictionary/schemas/pathology_report.yaml),
a JSON Schema defining the structure of pathology-report records
submitted to the Genomic Data Commons](gdc-pathology-report.webp)

The UK Atomic Energy Authority publishes [fusion-research metadata
schemas](https://github.com/ukaea/ukaea-metadata) in [JSON Schema
2020-12](https://www.learnjsonschema.com/2020-12/), covering dataset,
experiment, instrument, sample, and equipment records, plus dedicated schemas
for the
[HIVE](https://www.ukaea.org/service/heating-by-induction-to-verify-extremes-hive/)
and [MRF](https://www.ukaea.org/focus/materials-research-facility/)
facilities. These describe data across UKAEA's fusion programme, including the
[JET tokamak](https://www.ukaea.org/work/jet-decommissioning-and-repurposing/),
[MAST-U](https://www.ukaea.org/work/mast-upgrade/), and the upcoming
[STEP](https://stepfusion.com/) prototype fusion power plant targeting grid
connection in the 2040s.

The UK government uses JSON Schema across multiple departments. The Government
Digital Service describes every content type published on
[GOV.UK](https://www.gov.uk/) as a JSON Schema through the [publishing-api
content
schemas](https://github.com/alphagov/publishing-api/tree/main/content_schemas),
50+ formats covering case studies, consultations, detailed guides, document
collections, fatality notices, and statistics, with every page validated
against a JSON Schema before publishing. The Home Office maintains several JSON
Schema repositories across its operational services, including
[booktravel_schema](https://github.com/UKHomeOffice/booktravel_schema), which
defines the contract between the Home Office's Book Travel service and
third-party escort and travel providers handling immigration removals.

## JSON Schema across jurisdictions

JSON Schema does not stop at national borders. When governments coordinate
across jurisdictions and need to write down the shape of the data they
exchange, the format they reach for is, increasingly, JSON Schema.

The most consequential example is the [European Digital Identity (EUDI)
Wallet](https://github.com/eu-digital-identity-wallet), the flagship
digital-identity initiative under [eIDAS
2.0](https://en.wikipedia.org/wiki/EIDAS), mandatory across all 27 EU Member
States by December 2026. Its reference data model is published by the EU Wallet
Consortium (EWC) as [14 versioned JSON
Schemas](https://github.com/EWC-consortium/eudi-wallet-rulebooks-and-schemas/tree/main/data-schemas)
covering the EU company certificate, IBAN attestation, signatory rights,
legal-person identification, ferry boarding pass, ultimate beneficial owners,
payment wallet, payment-data confirmation, personal contact details, student
ID, vReceipts, person identification data, photo ID, and ID-proofing [ETSI
461](https://www.etsi.org/deliver/etsi_ts/119400_119499/119461/02.01.01_60/ts_119461v020101p.pdf).
The upstream [W3C Verifiable Credentials Data Model
2.0](https://www.w3.org/TR/vc-data-model-2.0/), on which every national EUDI
Wallet implementation depends, defines its `credentialSchema` property with
`JsonSchema` as a type.

![The [EWC consortium's Legal Person Identification Data
schema](https://github.com/EWC-consortium/eudi-wallet-rulebooks-and-schemas/blob/main/data-schemas/ds004-legal-person-identification-data.json),
one of the 14 JSON Schemas (2020-12) underpinning the EUDI Wallet reference
data model](eudi-legal-pid.webp)

In the United States,
[NIEM (the National Information Exchange Model)](https://www.niem.gov/)
plays an analogous role.
[NIEM 6.0 and the NIEMOpen Naming and Design Rules 6.0 were approved as
OASIS Standards on 9 December 2025](https://www.oasis-open.org/2025/12/09/oasis-approves-two-niemopen-standards-to-advance-ai-ready-data-interoperability/).
The model harmonises *"the 20,000+ data elements"* used across
US-government data exchanges (per the
[Book of NIEM 2025](https://federalnewsnetwork.com/wp-content/uploads/2025/09/Book-of-NIEM-v10-8-4-25.pdf)),
with
[JSON Schema as its bindings vocabulary](https://github.com/niemopen/niem-naming-design-rules/blob/main/doc/cmf-to-json-schema-guide.md)
for JSON-encoded payloads.
NIEM is used by the FBI, the Department of Defense, all 50 US states,
and Employment and Social Development Canada (ESDC).

Additionally, several intergovernmental research bodies publish their own JSON
Schema data models, each spanning many member states. The [World Meteorological
Organization](https://wmo.int/), a [United Nations](https://www.un.org/)
agency with 193 member states and territories, publishes
[WCMP2](https://schemas.wmo.int/wcmp/2.1.0/schemas/wcmp2-bundled.json) (Core
Metadata Profile 2 v2.1.0) as the JSON Schema for weather and climate metadata,
with the UK Met Office among its downstream consumers.

![The [WMO schema repository at schemas.wmo.int](https://schemas.wmo.int/),
served as a static directory listing of versioned schema collections including
IWXXM, METCE, WaterML, WCMP, WMDR, and others. Source schemas are developed at
[github.com/wmo-im](https://github.com/wmo-im)](schemas-wmo-int.webp)  The [European
Organization for Nuclear Research (CERN)](https://home.cern/), an
intergovernmental body with 25 member states, runs its [Open Data
portal](https://github.com/cernopendata/cernopendata-portal) on
JSON-Schema-validated records. The [European Bioinformatics Institute
(EMBL-EBI)](https://www.ebi.ac.uk/), the intergovernmental molecular-biology
lab spanning 29 European member states, maintains a [versioned JSON Schema
store](https://github.com/EBIBioSamples/json-schema-store) for biological
samples.

## The audit: every G7, and nine of the OECD top ten

Across the previous sections, we have seen many governments using JSON Schema
in three ways: as standalone schema collections, inside OpenAPI specifications,
and inside MCP servers. Returning to the article's premise, every
[G7](https://en.wikipedia.org/wiki/G7) member has at least one piece of JSON
Schema infrastructure on the public record:

| Country | Evidence |
|---|---|
| 🇺🇸 United States | [api.data.gov](https://api.data.gov/), [Code.gov](https://code.gov) metadata schema (itself a JSON Schema), [NASA General Coordinates Network schemas](https://github.com/nasa-gcn/gcn-schema), [NASA CMR/UMM](https://github.com/nasa/Common-Metadata-Repository), [NIST OSCAL](https://github.com/usnistgov/OSCAL/releases/latest), [NCI GDC Data Dictionary](https://github.com/NCI-GDC/gdcdictionary), [GovInfo MCP](https://www.govinfo.gov/features/mcp-public-preview), [US Census Bureau MCP](https://github.com/uscensusbureau/us-census-bureau-data-api-mcp), NIEM 6.0 [OASIS standard](https://www.oasis-open.org/2025/12/09/oasis-approves-two-niemopen-standards-to-advance-ai-ready-data-interoperability/) with [JSON Schema bindings](https://github.com/niemopen/niem-naming-design-rules/blob/main/doc/cmf-to-json-schema-guide.md) |
| 🇬🇧 United Kingdom | [UK API Catalogue](https://github.com/co-cddo/api-catalogue), [GOV.UK Notify](https://www.notifications.service.gov.uk/), [Open Standards Board OpenAPI 3 recommendation](https://www.gov.uk/government/publications/recommended-open-standards-for-government/describing-restful-apis-with-openapi-3), [GOV.UK content schemas](https://github.com/alphagov/publishing-api/tree/main/content_schemas), [UKAEA fusion-research schemas](https://github.com/ukaea/ukaea-metadata), [UK Home Office booktravel_schema](https://github.com/UKHomeOffice/booktravel_schema), UK GDS i.AI [Parliament MCP](https://github.com/i-dot-ai/parliament-mcp) and [Lex API](https://lex.lab.i.ai.gov.uk/api/openapi.json) |
| 🇫🇷 France | [schema.data.gouv.fr](https://schema.data.gouv.fr/) national multi-format schema registry, [data.gouv.fr MCP](https://www.data.gouv.fr/posts/experimentation-autour-dun-serveur-mcp-pour-datagouv), #1 on the OECD OURdata 2025 index |
| 🇩🇪 Germany | [bundesAPI](https://github.com/bundesapi) and [bund.dev](https://bund.dev/) community-curated catalogue documenting 60+ German federal APIs in OpenAPI. On the official side, [gematik](https://github.com/gematik) (the national health-IT body majority-owned by the Federal Ministry of Health) publishes OpenAPI specs for the [e-prescription](https://github.com/gematik/api-erp), [electronic patient record](https://github.com/gematik/api-ePA), and other national health interfaces |
| 🇮🇹 Italy | [api.gov.it](https://api.gov.it/en/catalogue) PDND catalogue (14,672 e-services across 9,398 entities), [schema.gov.it](https://schema.gov.it/) national semantic catalogue (JSON Schemas packaged as OpenAPI components), [AgID OAS Checker](https://italia.github.io/api-oas-checker/) zero-error validation gate |
| 🇯🇵 Japan | Digital Agency [DS-464-2](https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/fe5f0631-c978-42db-8416-6759cfa7e53a/f6ca1b7b/20241001_policies_development_management_outline_04.pdf) names OAS, [jgrants-mcp-server](https://github.com/digital-go-jp/jgrants-mcp-server), `genai-ai-api` government generative AI app platform, one of the four fastest-rising scorers in OECD DGI 2025 |
| 🇨🇦 Canada | [Government of Canada Standards on APIs](https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/government-canada-standards-apis.html) federal OpenAPI mandate (in production, for example at [api.weather.gc.ca/openapi](https://api.weather.gc.ca/openapi)), Employment and Social Development Canada adoption of NIEM |

The [OECD Digital Government Index
2025](https://www.oecd.org/en/publications/government-at-a-glance-2025_0efd0bcd-en/full-report/digital-government-index_1edec44e.html)
top ten extends the same pattern beyond the UK (4th) and France (9th). Australia (2nd) mandates OpenAPI through
[NAPIDS](https://api.gov.au/) and auto-extracts JSON Schemas from OpenAPI for
the [Consumer Data
Right](https://github.com/ConsumerDataStandardsAustralia/standards). Portugal
(3rd) publishes federal OpenAPI specs through
[amagovpt](https://github.com/amagovpt), for example
[doc-SAFE](https://github.com/amagovpt/doc-SAFE). Norway (5th) ships OpenAPI
through [Altinn
Dialogporten](https://github.com/Altinn/dialogporten/tree/main/docs/schema/V1).
Estonia (6th) describes its
[X-tee](https://www.ria.ee/en/state-information-system/data-exchange-platforms/data-exchange-layer-x-tee)
services in OpenAPI and catalogues them at [RIHA](https://www.riha.ee).
Ireland (7th) ships the [OGCIO MessagingIE OpenAPI
spec](https://github.com/ogcio/govie-messagingie/blob/main/apps/messaging-api/openapi-definition.yml).
Denmark (8th) publishes the [Danish Health Data Authority NCP
API](https://github.com/Sundhedsdatastyrelsen/ehdsi/blob/main/national-connector/epps-api/epps-ncp-api/src/main/openapi/ncp.yaml)
in OpenAPI alongside [Datafordeleren](https://datafordeler.dk/). And Chile
(10th) operates [Mercado Público](https://www.chilecompra.cl/api/) on the
JSON-Schema-based [Open Contracting Data
Standard](https://standard.open-contracting.org/latest/en/schema/).

The single holdout is Korea (1st), where no public OpenAPI or JSON Schema
evidence was found despite the country topping the OECD index.

Beyond the OECD top 10 digital governments, the pattern continues. Sweden
coordinates the [EWC
consortium](https://github.com/EWC-consortium/eudi-wallet-rulebooks-and-schemas/tree/main/data-schemas)
behind the EUDI Wallet's JSON Schemas, and
Statistics Sweden ships its open-source
[Balsam](https://github.com/statisticssweden/Balsam) research platform with the
OpenAPI generator.
Slovakia's [slovak-egov](https://github.com/slovak-egov) organisation
publishes Swagger and OpenAPI specs across its national open-data
catalogue and the EU's Once-Only Technical System pilot, alongside
[national JSON Schemas for the Slovak DCAT-AP
profile](https://github.com/slovak-egov/centralny-model-udajov/tree/main/tbox/national/dcat-ap-sk). Lithuania's
[ivpk](https://github.com/ivpk) maintains national
[API specifications](https://github.com/ivpk/api-specifications) and a
[universal API](https://github.com/ivpk/uapi) in OpenAPI. Israel's
[Ministry of Health](https://github.com/MohGovIL/Swagger) and Colombia's
[Alta Consejería TIC](https://github.com/AltaConsejeriaTIC) publish
OpenAPI specifications across their respective public-sector
portfolios.

![The Slovak [DCAT-AP catalogue JSON
Schema](https://github.com/slovak-egov/centralny-model-udajov/blob/main/tbox/national/dcat-ap-sk/json-sch%C3%A9my-2.0.1/katal%C3%B3g.json),
JSON Schema 2020-12, defining the Slovak national open-data catalogue
profile](slovak-dcat-ap-catalog.webp)

## JSON Schema is now national infrastructure

Across this article, we have seen that the G7, nine out of ten of the OECD's
top digital governments, and many others, *all make use of JSON Schema*.
Sometimes directly, through national schema registries and cross-government
data models. Sometimes indirectly, through OpenAPI specifications and MCP APIs.
And this is no longer always a choice. For example, [eIDAS
2.0](https://github.com/EWC-consortium/eudi-wallet-rulebooks-and-schemas/tree/main/data-schemas)
makes JSON Schema an EU-wide regulatory mandate.

Luke Keller, chief innovation officer at the US Census Bureau, [told
FedScoop](https://fedscoop.com/federal-goverment-mcp-improve-ai-access-public-data/):
*"[MCP is] not the answer. It's one of many answers."* He is right. In 2026,
those answers are OpenAPI and MCP. Tomorrow, they might be something else.
**However, the foundational layer they all sit on is the same: JSON Schema. It
is the stable substrate underneath an ever-evolving stack.**

For this reason, France and Italy already operate national registries that
support JSON Schema, and the Netherlands [joined them as recently as April
2026](https://developer.overheid.nl/blog/2026/04/23/don-update). The US, the
UK, and EU-wide initiatives like the EUDI Wallet continue to bet on JSON Schema
as the format for the standalone data models they share across agencies,
missions, and borders.

The list will only grow.
