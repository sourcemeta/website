+++
title = "Solving the JSON Schema dialect fragmentation problem with auto-upgrades"
date = 2026-10-30
author = "jviotti"
+++

> TL;DR: JSON Schema has published many dialects with breaking changes, and
> specs like OpenAPI add their own extensions and constraints on top.
> Different tools and schemas sit on different dialects, so using a schema you
> need or plugging it into a tool you need is often hard or impossible. What
> you really want is to keep one schema and let every tool receive it in the
> dialect it understands. Sourcemeta finally makes that possible, upgrading
> any schema on the fly to the dialect a tool expects, through the JSON Schema
> CLI or the Sourcemeta One registry.

## JSON Schema evolves, and evolution brings breaking changes

A 2025 OpenProceedings paper calls JSON Schema *"the de facto standard schema
language to describe JSON data"*, with an adoption that is *"almost
ubiquitous"* ([OpenProceedings,
2025](https://openproceedings.org/2025/conf/edbt/paper-T3.pdf)). Today, it is
[the one schema language every major AI provider (OpenAI, Google, Anthropic,
Mistral, xAI, DeepSeek) has converged on]({{< ref
"/blog/ai-only-speaks-json-schema" >}}), and the format the Model Context
Protocol speaks. It is what [every G7 government runs its digital public
infrastructure on]({{< ref "/blog/g7-runs-on-json-schema" >}}), and from
December 2026 every EU country must run its [eIDAS 2.0 digital
identity](https://github.com/EWC-consortium/eudi-wallet-rulebooks-and-schemas/tree/main/data-schemas)
system on it as well. Whatever you are building, you almost certainly depend
on JSON Schema, directly or [through OpenAPI]({{< ref
"/blog/json-schema-dominates-openapi" >}}), MCP, or a cloud service.

Like any healthy standard, JSON Schema evolves. Each new version revisits
earlier decisions as the community learns more, rather than keeping them
forever. That willingness to break backward compatibility is much of what has
kept it from accumulating legacy it could never remove. The price is simply
that a schema written for one version may no longer be valid, or may quietly
mean something different, under another. Some are easy to spot: in Draft 6 the
identifier keyword [`id`](https://www.learnjsonschema.com/draft4/core/id/) was
renamed to [`$id`](https://www.learnjsonschema.com/draft6/core/id/). Others
are far more subtle, like how the
[`$anchor`](https://www.learnjsonschema.com/2020-12/core/anchor/) keyword
[accepted colons in
2019-09](https://www.learnjsonschema.com/2019-09/core/anchor/) but [no longer
does in 2020-12](https://www.learnjsonschema.com/2020-12/core/anchor/).

The result is a family of dialects, each with its own set of breaking changes:

| Dialect | Year | Breaking changes |
|---|---|---|
| Draft 0 | 2009 | The first published draft. |
| Draft 1 | 2009 | No schema changes (an IETF metadata revision). |
| Draft 2 | 2010 | `maxDecimal` replaced by [`divisibleBy`](https://www.learnjsonschema.com/draft3/core/divisibleby/), redefined from decimal places to divisibility. |
| Draft 3 | 2010 | `optional` replaced by [`required`](https://www.learnjsonschema.com/draft3/core/required/) with inverted meaning. `maximumCanEqual` / `minimumCanEqual` replaced by [`exclusiveMaximum`](https://www.learnjsonschema.com/draft3/core/exclusivemaximum/) / [`exclusiveMinimum`](https://www.learnjsonschema.com/draft3/core/exclusiveminimum/). `requires` renamed to [`dependencies`](https://www.learnjsonschema.com/draft3/core/dependencies/). [`format`](https://www.learnjsonschema.com/draft3/core/format/) dropped the address-oriented values `street-address`, `locality`, `region`, `postal-code` and `country`. |
| Draft 4 | 2013 | [`required`](https://www.learnjsonschema.com/draft4/validation/required/) changed from a per-property boolean flag to an array of names. [`disallow`](https://www.learnjsonschema.com/draft3/core/disallow/) and [`extends`](https://www.learnjsonschema.com/draft3/core/extends/) removed. [`divisibleBy`](https://www.learnjsonschema.com/draft3/core/divisibleby/) renamed to [`multipleOf`](https://www.learnjsonschema.com/draft4/validation/multipleof/). [`type`](https://www.learnjsonschema.com/draft4/validation/type/) dropped the `"any"` value and can no longer hold inline subschemas. [`format`](https://www.learnjsonschema.com/draft4/validation/format/) was pruned to six values (`date`, `time`, `utc-millisec`, `regex`, `color`, `style` and `phone` removed, with `ip-address` and `host-name` renamed to `ipv4` and `hostname`). |
| Draft 5 | 2016 | No schema changes (a cleanup of Draft 4 that kept its meta-schemas). |
| Draft 6 | 2017 | [`id`](https://www.learnjsonschema.com/draft4/core/id/) renamed to [`$id`](https://www.learnjsonschema.com/draft6/core/id/). Boolean [`exclusiveMinimum`](https://www.learnjsonschema.com/draft6/validation/exclusiveminimum/) / [`exclusiveMaximum`](https://www.learnjsonschema.com/draft6/validation/exclusivemaximum/) became numeric. [`type`](https://www.learnjsonschema.com/draft6/validation/type/) `"integer"` now accepts values like `1.0`. |
| Draft 7 | 2018 | None. Backward-compatible with Draft 6. |
| 2019-09 | 2019 | [`definitions`](https://www.learnjsonschema.com/draft7/validation/definitions/) renamed to [`$defs`](https://www.learnjsonschema.com/2019-09/core/defs/). [`dependencies`](https://www.learnjsonschema.com/draft7/validation/dependencies/) split into [`dependentRequired`](https://www.learnjsonschema.com/2019-09/validation/dependentrequired/) and [`dependentSchemas`](https://www.learnjsonschema.com/2019-09/applicator/dependentschemas/). Plain-name anchors moved from an [`$id`](https://www.learnjsonschema.com/2019-09/core/id/) fragment to [`$anchor`](https://www.learnjsonschema.com/2019-09/core/anchor/), and [`$ref`](https://www.learnjsonschema.com/2019-09/core/ref/) may now sit beside other keywords. |
| 2020-12 | 2020 | Array [`items`](https://www.learnjsonschema.com/2019-09/applicator/items/) and [`additionalItems`](https://www.learnjsonschema.com/2019-09/applicator/additionalitems/) became [`prefixItems`](https://www.learnjsonschema.com/2020-12/applicator/prefixitems/) and [`items`](https://www.learnjsonschema.com/2020-12/applicator/items/). [`$recursiveRef`](https://www.learnjsonschema.com/2019-09/core/recursiveref/) / [`$recursiveAnchor`](https://www.learnjsonschema.com/2019-09/core/recursiveanchor/) replaced by [`$dynamicRef`](https://www.learnjsonschema.com/2020-12/core/dynamicref/) / [`$dynamicAnchor`](https://www.learnjsonschema.com/2020-12/core/dynamicanchor/). [`contains`](https://www.learnjsonschema.com/2020-12/applicator/contains/) now marks matched items as evaluated, changing [`unevaluatedItems`](https://www.learnjsonschema.com/2020-12/unevaluated/unevaluateditems/) results. [`$anchor`](https://www.learnjsonschema.com/2020-12/core/anchor/) dropped the colon from its allowed characters. |

## And those breaking changes cascade to JSON Schema's adopters

JSON Schema is also a building block for other specifications, which embed it
to describe their data. So every breaking change in JSON Schema cascades up
into whatever is built on top of it. The clearest example is OpenAPI, which
embeds JSON Schema to describe the data in an API.

What an OpenAPI document embeds is not a plain upstream dialect but its own
variant of JSON Schema, the OpenAPI Schema Object. Each OpenAPI version ties
that object to a particular JSON Schema dialect and then extends or restricts
it in its own way. OpenAPI has also rebased onto a newer dialect more than
once. All of this adds a new dimension to the fragmentation from the previous
section:

| Version | Year | JSON Schema dialect |
|---|---|---|
| Swagger 1.2 | 2014 | Reuses JSON Schema Draft 4's primitive types (`type` plus a `format` modifier), but its Models and Properties are Swagger's own objects that each [*"follows a subset of the JSON-Schema specification"*](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/1.2.md), with non-standard spellings like `defaultValue` (not [`default`](https://www.learnjsonschema.com/draft4/validation/default/)) and `minimum` / `maximum` given as strings. |
| Swagger / OpenAPI 2.0 | 2014 | [*"a subset of JSON Schema Draft 4"*](https://spec.openapis.org/oas/v2.0.html) with OpenAPI-only additions (`discriminator`, `readOnly`, `xml`, `externalDocs`, `example`) and its own `format` values (`int32`, `int64`, `float`, `double`, `byte`, `binary`, `password`). [`type`](https://www.learnjsonschema.com/draft4/validation/type/) must be single-valued, and only [`allOf`](https://www.learnjsonschema.com/draft4/validation/allof/) is supported among the logical applicators. |
| OpenAPI 3.0.x | 2017 | [*"an extended subset of the JSON Schema Specification Wright Draft 00"*](https://spec.openapis.org/oas/v3.0.3.html) (Draft 4 lineage), adding `nullable`, `discriminator`, `readOnly`, `writeOnly`, `xml`, `externalDocs`, `example`, `deprecated` and its own `format` values (`int32`, `int64`, `byte`, `binary`, `password`). [`type`](https://www.learnjsonschema.com/draft4/validation/type/) must be a single string (no `null`, use `nullable`), and any JSON Schema keyword it does not list is *"strictly unsupported"*. |
| OpenAPI 3.1 | 2021 | [*"a superset of the JSON Schema Specification Draft 2020-12"*](https://spec.openapis.org/oas/v3.1.0.html), defining an [OpenAPI Schema Object dialect](https://spec.openapis.org/oas/3.1/dialect/base) whose base vocabulary adds four keywords ([`discriminator`](https://www.learnjsonschema.com/2020-12/openapi-3.1/discriminator/), [`xml`](https://www.learnjsonschema.com/2020-12/openapi-3.1/xml/), [`externalDocs`](https://www.learnjsonschema.com/2020-12/openapi-3.1/externaldocs/), and [`example`](https://www.learnjsonschema.com/2020-12/openapi-3.1/example/)). |
| OpenAPI 3.2 | 2025 | Also [a superset of 2020-12](https://spec.openapis.org/oas/v3.2.0.html), with its [own base vocabulary](https://spec.openapis.org/oas/3.2/dialect/2025-09-17) carrying the same four keywords in revised form. [`example`](https://www.learnjsonschema.com/2020-12/openapi-3.2/example/) is now deprecated, and [`xml`](https://www.learnjsonschema.com/2020-12/openapi-3.2/xml/) gains a `nodeType` while deprecating `attribute` and `wrapped`. |

OpenAPI is not the only one. The [Model Context
Protocol](https://modelcontextprotocol.io), the fast-growing standard that
wires AI models to tools and [also builds on JSON Schema]({{< ref
"/blog/ai-only-speaks-json-schema" >}}) to describe a tool's inputs and
outputs, hit the problem from the opposite direction. Where each OpenAPI
version pins a dialect and reshapes it, MCP left its embedded tool schemas
without a declared dialect at all. Implementations then ended up *"split
between draft-07 and 2020-12"*, until
[SEP-1613](https://modelcontextprotocol.io/seps/1613-establish-json-schema-2020-12-as-default-dialect-f)
(October 2025) *"establishes JSON Schema 2020-12 as the default dialect for
embedded schemas within MCP messages"*.

The flagship API and AI specs are not the only ones to change dialect. For
example, format specifications that ship JSON Schemas straight to their users
have quietly done the same. [glTF](https://www.khronos.org/gltf/), Khronos's
3D asset format, went [from Draft 4 to
2020-12](https://raw.githubusercontent.com/KhronosGroup/glTF/main/specification/2.0/schema/glTF.schema.json)
in 2021. [Docker Compose](https://compose-spec.io/) moved [from 2019-09 to
2020-12](https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json)
in 2026. [SPDX](https://spdx.dev/), the software bill-of-materials standard,
went [from Draft 7 to
2020-12](https://raw.githubusercontent.com/spdx/spdx-spec/develop/schemas/spdx-schema-3-0-1.json)
with its 3.0 line in 2024. And [STAC](https://stacspec.org/), the
SpatioTemporal Asset Catalog for geospatial data, moved [from Draft 6 to Draft
7](https://raw.githubusercontent.com/radiantearth/stac-spec/v0.9.0/catalog-spec/json-schema/catalog.json)
in 2020. Whole products migrate too: [Confluent Schema
Registry](https://docs.confluent.io/platform/current/schema-registry/index.html),
Kafka's schema registry, [added
2020-12](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/serdes-json.html)
in Platform 7.6.0 in 2024, and [OpenMetadata](https://open-metadata.org/), an
open-source metadata platform, moved its entire schema corpus from Draft 7 to
2020-12 in [a single 2026 pull
request](https://github.com/open-metadata/OpenMetadata/pull/33631) touching
1,324 files.

## How fragmented is it, really?

Pinning this down precisely is close to impossible. Most JSON Schema and
OpenAPI use lives inside companies, in private repositories and internal
services no one outside can measure. What is public is only a slice, so the
best we can do is triangulate from a few imperfect proxies. None is exhaustive
or representative on its own, and each looks at a different population, so
treat what follows as a rough picture, not a census. The useful part is that
the proxies disagree on magnitude but agree on the ranking.

### Live traffic to the official website

Start with live traffic. The [json-schema.org](https://json-schema.org)
website hosts the meta-schema for each dialect. Its Cloudflare analytics show
which of those meta-schemas the world requests most over a trailing 30-day
window, and the ranking is telling: [Draft
7](https://json-schema.org/draft-07/schema) leads by a wide margin, [Draft
4](https://json-schema.org/draft-04/schema) is a close second, and
[2020-12](https://json-schema.org/draft/2020-12/schema) only comes third, with
[Draft 6](https://json-schema.org/draft-06/schema) and
[2019-09](https://json-schema.org/draft/2019-09/schema) far behind. That Draft
4, whose specification was published back in 2013, still outdraws the current
dialect is the sharpest sign of how sticky older dialects can be.

![json-schema.org meta-schema request paths over a trailing 30 days ending
2026-09-23 (Cloudflare analytics, site-owner data). Among dialect
meta-schemas Draft 7 leads at 37.99M requests, Draft 4 is second at 25.3M, the
2020-12 dialect meta-schema is at 11.85M, Draft 6 at 7.84M, and 2019-09 at
1.38M.](jsonschema-org-top-paths.webp)

The first surprise is that Draft 7 leads at all. OpenAPI, the single largest
consumer of JSON Schema, never used it. Its 2.0 and 3.0 lines sit on the Draft
4 lineage, and 3.1 and later on 2020-12. Much of Draft 7's traffic comes down
to one library, the Python
[`jsonschema`](https://github.com/python-jsonschema/jsonschema) library's
*[deprecated](https://github.com/python-jsonschema/jsonschema/pull/1049)*
remote-`$ref` fetch path, which sends the User-Agent `python-jsonschema
(deprecated $ref resolution)`. It fetches a schema's meta-schema over the
network on every validation, doing exactly what the specification advises
against: [*"implementations SHOULD NOT assume they should perform a network
operation when they encounter a network-addressable
URI"*](https://json-schema.org/draft/2020-12/json-schema-core.html#section-8.2.3).
That does not make Draft 7's lead fake, though. The library only fetches the
Draft 7 meta-schema because the schemas people feed it are Draft 7, so the
usage is real. The deprecated path just tilts the analytics further in its
favour.

The other surprise is at the modern end. 2020-12 has been out for nearly six
years, and OpenAPI 3.1 adopted it back in February 2021. Yet it is still not
the most-requested dialect, and it has barely moved since [a 2023 article that
inspected the same Cloudflare
analytics](https://json-schema.org/blog/posts/website-analytics-snapshot-2023).
Some of that gap is measurement, since the modern tools that use 2020-12 are
the ones most likely to ship the meta-schemas as built-in copies and validate
against those rather than fetch them over the network, so the figures
understate it. But the persistence is also the point. That same
python-jsonschema traffic was already there in 2023, which means whoever was
validating those Draft 7 schemas then is still doing it now, and still has not
upgraded.

A last quirk we cannot explain is that 2020-12's [core vocabulary
meta-schema](https://json-schema.org/draft/2020-12/meta/core) is requested
nearly twice as often as the [dialect
meta-schema](https://json-schema.org/draft/2020-12/schema) that references it.

### What developers publish on GitHub

What developers actually declare on GitHub tells a compatible story. Every
dialect's meta-schema lives at a distinct URL, and each version of OpenAPI and
AsyncAPI leaves a distinct marker in its documents. So a text search for those
strings is a rough headcount of what people publish.

The table below runs one such query per row against GitHub's code search API
on September 28th, 2026, and links each one so you can re-run it. This is text
matching over the API, not schema parsing. It counts every file containing the
string, including generated and vendored copies, which inflates the newest
dialects most. GitHub also returns the totals as estimates. So treat the
numbers as approximate, good enough as one more proxy, where the ranking
matters more than any exact figure.

| Specification | Version | Files on GitHub | Searched for |
|---|---|---|---|
| JSON Schema | Draft 0 | 398 | [`"json-schema.org/draft-00/schema"`](https://github.com/search?q=%22json-schema.org%2Fdraft-00%2Fschema%22&type=code) |
| JSON Schema | Draft 1 | 487 | [`"json-schema.org/draft-01/schema"`](https://github.com/search?q=%22json-schema.org%2Fdraft-01%2Fschema%22&type=code) |
| JSON Schema | Draft 2 | 489 | [`"json-schema.org/draft-02/schema"`](https://github.com/search?q=%22json-schema.org%2Fdraft-02%2Fschema%22&type=code) |
| JSON Schema | Draft 3 | 28,288 | [`"json-schema.org/draft-03/schema"`](https://github.com/search?q=%22json-schema.org%2Fdraft-03%2Fschema%22&type=code) |
| JSON Schema | Draft 4 | 444,416 | [`"json-schema.org/draft-04/schema"`](https://github.com/search?q=%22json-schema.org%2Fdraft-04%2Fschema%22&type=code) |
| JSON Schema | Draft 6 | 194,560 | [`"json-schema.org/draft-06/schema"`](https://github.com/search?q=%22json-schema.org%2Fdraft-06%2Fschema%22&type=code) |
| JSON Schema | Draft 7 | 839,680 | [`"json-schema.org/draft-07/schema"`](https://github.com/search?q=%22json-schema.org%2Fdraft-07%2Fschema%22&type=code) |
| JSON Schema | 2019-09 | 63,744 | [`"json-schema.org/draft/2019-09/schema"`](https://github.com/search?q=%22json-schema.org%2Fdraft%2F2019-09%2Fschema%22&type=code) |
| JSON Schema | 2020-12 | 829,440 | [`"json-schema.org/draft/2020-12/schema"`](https://github.com/search?q=%22json-schema.org%2Fdraft%2F2020-12%2Fschema%22&type=code) |
| OpenAPI | 2.0 (Draft 4 lineage) | 67,328 | [`"swagger: \"2.0\""`](https://github.com/search?q=%22swagger%3A%20%5C%222.0%5C%22%22&type=code) |
| OpenAPI | 3.0 (Draft 4 subset) | 307,200 | [`"openapi: 3.0"`](https://github.com/search?q=%22openapi%3A%203.0%22&type=code) |
| OpenAPI | 3.1 (2020-12) | 100,352 | [`"openapi: 3.1"`](https://github.com/search?q=%22openapi%3A%203.1%22&type=code) |
| OpenAPI | 3.2 (2020-12) | 1,824 | [`"openapi": "3.2.0"`](https://github.com/search?q=%22openapi%22%3A%20%223.2.0%22&type=code) |
| AsyncAPI | 2.x + 3.0 (Draft 7) | 13,088 | [`"asyncapi: 2"`](https://github.com/search?q=%22asyncapi%3A%202%22&type=code), [`"asyncapi: 3"`](https://github.com/search?q=%22asyncapi%3A%203%22&type=code) |

Draft 7 leads here too, now by published files rather than by requests. The
one real divergence is 2020-12, which ranks higher by file count than by
traffic. Even that reflects the measurement bias pulling each way. File counts
are inflated by generated and vendored copies, while the traffic figures
understate 2020-12 because modern tools ship the meta-schemas as built-in
copies instead of fetching them.

Draft 4 is the other constant. It no longer leads by raw file count, but its
lineage is what most public APIs still run on: OpenAPI 2.0 and 3.0 are both
custom Draft 4 dialects, and together they still outnumber the 2020-12-aligned
OpenAPI 3.1 by a wide margin, years after 2020-12 shipped. The extremes behave
as expected, with the earliest drafts effectively extinct and OpenAPI 3.2,
released only in September 2025, barely registering yet.

A study from 2020 shows how recent Draft 7's rise really is. *[An Empirical
Study on the "Usage of Not" in Real-World JSON Schema
Documents](https://arxiv.org/abs/2107.08677)* crawled GitHub in July 2020,
removed duplicate copies, and found that across 82,094 files Draft 4 was
declared by 78.85% and Draft 7 by only 2.67%, with Draft 6 and Draft 3 in
between. That makes sense for the time. 2020-12 was not out yet, and Draft 7
was only two years old. Draft 4 was still the clear default. Our own numbers,
where Draft 7 now leads, show how far it has come since 2020.

### The SchemaStore catalogue

One curated catalogue is worth a closer look.
[SchemaStore](https://github.com/SchemaStore/schemastore) is a large public
collection of JSON schemas for common configuration files. It is created and
maintained by Mads Kristensen, [a longtime Visual Studio program manager at
Microsoft](https://www.youtube.com/watch?v=-yYTxLZZk58). It is also
overwhelmingly Draft 7. Of the 977 standalone schemas we analysed on September
28th, 2026, 89.3% declare Draft 7, only 7.4% declare 2020-12, just 1.1% Draft
4, and 1.7% declare no dialect at all.

![The SchemaStore landing page and its public catalogue, 1,551 files at the
time of writing. The project is run by volunteers and, by its own account,
serves more than a terabyte a day. Source:
[schemastore.org](https://www.schemastore.org/)](schemastore.webp)

That is the mirror image of the OpenAPI-driven proxies, where Draft 4 and
2020-12 lead and Draft 7 barely featured. The difference is what SchemaStore
is for. Visual Studio and Visual Studio Code draw on it for JSON and YAML
auto-completion. It lives entirely in the configuration-and-editor world,
which has no OpenAPI in it, so Draft 7 dominates. This suggests that much of
Draft 7's lead in the earlier proxies comes from this world rather than from
APIs, and it is not a small one.

## What dialects do real products and specs actually use?

So far we have counted schemas. The following table instead takes real
adopters of JSON Schema, commercial products, open-source projects, and
standards whose published artefact is the schema itself, and groups them by
the dialect each one uses. It is not exhaustive, and it reflects what each
project's own documentation or published schemas state at the time of writing.
Adopters that support several dialects appear in every row they belong to, so
the numbers are row entries, not unique adopters.

| Dialect | Count | Commercial | OSS | Schemas / Standards |
|---|---|---|---|---|
| **Draft 3** | 3 | [Informatica B2B](https://docs.informatica.com/data-integration/b2b-data-transformation/10-4-0/user-guide/wizard-input-and-output-formats/json/sample-json-schema.html), [Sourcemeta One](https://one.sourcemeta.com) | [Jackson jsonSchema module](https://raw.githubusercontent.com/FasterXML/jackson-module-jsonSchema/master/README.md) | — |
| **Draft 4**, and OpenAPI 2.0 and 3.0 | 37 | [AWS API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings-models.html), [AWS EventBridge Schema Registry](https://aws.amazon.com/about-aws/whats-new/2020/09/amazon-eventbridge-schema-registry-announces-support-for-json-schema/), [Azure ARM templates](https://raw.githubusercontent.com/Azure/azure-resource-manager-schemas/main/schemas/2019-04-01/deploymentTemplate.json), [MongoDB `$jsonSchema`](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/), [Google Gemini / Vertex](https://ai.google.dev/gemini-api/docs/structured-output), [Kong](https://developer.konghq.com/plugins/request-validator/), [Gravitee](https://documentation.gravitee.io/apim/policy-reference/json-validation-policy), [Axway API Gateway](https://docs.axway.com/bundle/APIGateway_762_PolicyDevFilterReference_allOS_en_HTML5/page/Content/PolicyDevTopics/content_schema_json.htm), [IBM App Connect](https://www.ibm.com/docs/en/app-connect/13.0.x?topic=schema-json-requirements-message-maps), [Cloudflare](https://raw.githubusercontent.com/cloudflare/api-schemas/main/openapi.yaml) (OpenAPI 3.0), [Heroku Platform API](https://api.heroku.com/schema) (Hyper-Schema), [Microsoft json-schemas](https://raw.githubusercontent.com/microsoft/json-schemas/main/copilot/declarative-agent/v1.8/schema.json), [Zapier](https://raw.githubusercontent.com/zapier/zapier-platform/main/packages/schema/exported-schema.json), [Adobe Experience Manager](https://experienceleague.adobe.com/docs/experience-manager-65/forms/adaptive-forms-advanced-authoring/adaptive-form-json-schema-form-model.html), [Apiary](https://help.apiary.io/api_101/json-schema/), [Assertible](https://assertible.com/json-schema-validation), [SpreadJS](https://developer.mescius.com/spreadjs/docs/features/jsonschema/fullschema), [Lightblue](https://docs.lightblue.io/standards/json_schema.html), [API7](https://api7.ai/enterprise), [Sourcemeta One](https://one.sourcemeta.com), [Confluent Schema Registry](https://github.com/confluentinc/schema-registry), [AWS Glue Schema Registry](https://docs.aws.amazon.com/glue/latest/dg/schema-registry.html) | [Kubernetes CRDs](https://kubernetes.io/blog/2019/06/20/crd-structural-schema/), [MySQL](https://dev.mysql.com/doc/refman/8.0/en/json-validation-functions.html), [Apache APISIX](https://apisix.apache.org/docs/apisix/plugins/request-validation/), [Snowplow / Iglu](https://docs.snowplow.io/docs/api-reference/json-schema-reference/), [Nakadi](https://raw.githubusercontent.com/zalando/nakadi/master/docs/_data/nakadi-event-bus-api.yaml), [postgres-json-schema](https://github.com/gavinwahl/postgres-json-schema), [NCI Genomic Data Commons](https://raw.githubusercontent.com/NCI-GDC/gdcdictionary/develop/src/gdcdictionary/schemas/case.yaml), [Mozilla Data Pipeline](https://raw.githubusercontent.com/mozilla/mozilla-pipeline-schemas/master/schemas/activity-stream/events/events.1.schema.json), [Drupal Patternkit](https://git.drupalcode.org/project/patternkit), [OpenAPI 3.0.x](https://spec.openapis.org/oas/v3.0.3), [RAML 1.0](https://raw.githubusercontent.com/raml-org/raml-spec/master/versions/raml-10/raml-10.md), [KrakenD](https://www.krakend.io/docs/endpoints/json-schema/), [Apicurio Registry](https://github.com/Apicurio/apicurio-registry) | [JSON-LD](https://json-ld.org/schemas/jsonld-schema.json) (document linter), [UK Open Banking Standard](https://github.com/OpenBankingUK/read-write-api-specs) (OpenAPI 3.0) |
| **Draft 6** | 9 | [API7](https://api7.ai/enterprise), [Sourcemeta One](https://one.sourcemeta.com), [Confluent Schema Registry](https://github.com/confluentinc/schema-registry), [AWS Glue Schema Registry](https://docs.aws.amazon.com/glue/latest/dg/schema-registry.html) | [quicktype](https://raw.githubusercontent.com/glideapps/quicktype/master/packages/quicktype-core/src/language/JSONSchema/JSONSchemaRenderer.ts), [Apache APISIX](https://apisix.apache.org/docs/apisix/plugins/request-validation/), [KrakenD](https://www.krakend.io/docs/endpoints/json-schema/), [Apicurio Registry](https://github.com/Apicurio/apicurio-registry) | [FHIR](https://www.hl7.org/fhir/patient.schema.json.html) |
| **Draft 7**, the crowded middle | 30 | [Decisions](https://documentation.decisions.com/docs/creating-types-json-schema), [DocSpring](https://docspring.com/docs/api/get_template_schema.html), [NGINX App Protect](https://docs.nginx.com/waf/policies/xml-json-content/), [API7](https://api7.ai/enterprise), [Sourcemeta One](https://one.sourcemeta.com), [Confluent Schema Registry](https://github.com/confluentinc/schema-registry), [AWS Glue Schema Registry](https://docs.aws.amazon.com/glue/latest/dg/schema-registry.html) | [Backstage](https://raw.githubusercontent.com/backstage/backstage/master/packages/catalog-model/src/schema/Entity.schema.json), [GitHub Actions / Dependabot (SchemaStore)](https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/github-workflow.json), [Helm charts](https://helm.sh/docs/topics/charts/), [WordPress theme.json](https://schemas.wp.org/trunk/theme.json), [Ory Kratos](https://raw.githubusercontent.com/ory/kratos/master/contrib/quickstart/kratos/email-password/identity.schema.json), [Renovate](https://docs.renovatebot.com/renovate-schema.json), [dbt](https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/1.6/dbt_project-1.6.json), [zod-to-json-schema](https://raw.githubusercontent.com/StefanTerdell/zod-to-json-schema/master/README.md), [typescript-json-schema](https://raw.githubusercontent.com/YousefED/typescript-json-schema/master/typescript-json-schema.ts), [CloudEvents](https://raw.githubusercontent.com/cloudevents/spec/main/cloudevents/formats/cloudevents.json), [AsyncAPI 2.x/3.0](https://www.asyncapi.com/docs/reference/specification/v3.0.0), [Apache APISIX](https://apisix.apache.org/docs/apisix/plugins/request-validation/), [KrakenD](https://www.krakend.io/docs/endpoints/json-schema/), [Apicurio Registry](https://github.com/Apicurio/apicurio-registry) | [FDC3](https://raw.githubusercontent.com/finos/FDC3/main/packages/fdc3-context/schemas/context/context.schema.json), [STAC](https://raw.githubusercontent.com/radiantearth/stac-spec/master/item-spec/json-schema/item.json), [GeoJSON](https://geojson.org/schema/GeoJSON.json), [CycloneDX](https://raw.githubusercontent.com/CycloneDX/specification/master/schema/bom-1.6.schema.json), [SPDX](https://raw.githubusercontent.com/spdx/spdx-spec/support/2.3/schemas/spdx-schema.json), [NIST OSCAL](https://github.com/usnistgov/OSCAL/releases/download/v1.2.3/oscal_complete_schema.json), [Human Cell Atlas](https://raw.githubusercontent.com/HumanCellAtlas/metadata-schema/master/json_schema/core/project/project_core.json), [TILT](https://raw.githubusercontent.com/Transparency-Information-Language/schema/master/tilt-schema.json), [SDF (IETF ASDF)](https://github.com/ietf-wg-asdf/SDF) |
| **2019-09** | 5 | [Sourcemeta One](https://one.sourcemeta.com) | [KrakenD](https://www.krakend.io/docs/endpoints/json-schema/) | [Linux kernel Devicetree bindings](https://raw.githubusercontent.com/devicetree-org/dt-schema/main/dtschema/meta-schemas/core.yaml) (dt-schema), [Manfred Awesomic CV](https://github.com/getmanfred/mac), [MovieLabs OMC](https://github.com/MovieLabs/OMC) |
| **2020-12** | 28 | [Anthropic Claude](https://docs.anthropic.com/en/docs/tool-use), [AWS Bedrock](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ToolInputSchema.html), [Oracle 23ai](https://docs.oracle.com/en/database/oracle/oracle-database/23/adjsn/json-schema.html), [Zuplo](https://zuplo.com/docs/policies/request-validation-inbound), [Sourcemeta One](https://one.sourcemeta.com), [Confluent Schema Registry](https://github.com/confluentinc/schema-registry), [dottxt](https://docs.dottxt.ai/supported-features) | [nf-core](https://raw.githubusercontent.com/nf-core/tools/main/nf_core/pipeline-template/nextflow_schema.json), [TypeSpec](https://raw.githubusercontent.com/microsoft/typespec/main/packages/json-schema/src/json-schema-emitter.ts), [pydantic v2](https://pydantic.dev/docs/validation/latest/concepts/json_schema/), [invopop/jsonschema + schemars v1](https://raw.githubusercontent.com/invopop/jsonschema/main/schema.go), [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0), [OpenTelemetry](https://raw.githubusercontent.com/open-telemetry/opentelemetry-configuration/main/opentelemetry_configuration.json), [Docker Compose](https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json), [JSON:API](https://raw.githubusercontent.com/json-api/json-api/gh-pages/_schemas/1.0/schema.json), [Arazzo](https://spec.openapis.org/arazzo/v1.0.0.html), [APIs.json](https://apisjson.org/), [KrakenD](https://www.krakend.io/docs/endpoints/json-schema/), [Apicurio Registry](https://github.com/Apicurio/apicurio-registry) | [ISO 20022 (JSON)](https://www.iso20022.org/sites/default/files/media/file/ISO_20022_Generation_of_JSON_Schema_Draft_2020_12_for_ISO_20022_2013_10June2025.pdf), [glTF (Khronos)](https://raw.githubusercontent.com/KhronosGroup/glTF/main/specification/2.0/schema/glTF.schema.json), [Smart Data Models](https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/WeatherObserved/schema.json), [NinJS (IPTC)](https://www.iptc.org/std/ninjs/ninjs-schema_3.2.json), [RDA DMP Common](https://raw.githubusercontent.com/RDA-DMP-Common/RDA-DMP-Common-Standard/master/examples/JSON/JSON-schema/1.2/maDMP-schema-1.2.json), [MCP](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2025-11-25/schema.json), [A2A](https://github.com/a2aproject/A2A), [OSSF OSV](https://github.com/ossf/osv-schema/blob/main/validation/schema.json), [NASA GCN](https://github.com/nasa-gcn/gcn-schema) |
| **Unclear** | 14 | *LLM APIs, each a different bespoke subset:* [OpenAI](https://developers.openai.com/api/docs/guides/structured-outputs), [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/structured-outputs), [Cohere](https://docs.cohere.com/docs/structured-outputs), [Groq](https://console.groq.com/docs/structured-outputs), [Mistral](https://docs.mistral.ai/capabilities/structured-output/custom_structured_output/), [Together AI](https://docs.together.ai/docs/json-mode). *No dialect declared:* [Retool](https://docs.retool.com/docs/working-with-json-schema-form), [JamF](https://developer.jamf.com/developer-guide/docs/schema), [Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/validate-content-policy), [Walmart](https://developer.walmart.com/us-marketplace/docs/item-setup-schema-key-points) | *No dialect declared:* [Serverless](https://raw.githubusercontent.com/serverless/serverless/main/packages/serverless/lib/config-schema.js), [WSO2 API Manager](https://apim.docs.wso2.com/en/4.4.0/design/api-security/api-request-response-schema-validation/json-schema-validator/) *OSS constrained decoding, bespoke subset:* [vLLM](https://docs.vllm.ai/en/latest/features/structured_outputs.html), [XGrammar](https://github.com/mlc-ai/xgrammar) | — |

The pattern is that no single dialect wins. Real, current adopters span four
eras at once, from Draft 3 to 2020-12, and every one of them is still a
production dependency for someone. Draft 4 and Draft 7 carry the longest
tails, especially on the commercial side, while 2019-09 was skipped almost
entirely and 2020-12 is the one clearly gaining ground, mostly among newer AI
and data products. The split is sharp even inside a single category: among API
gateways alone, Kong, AWS API Gateway, Apache APISIX, Gravitee, and Axway
validate against Draft 4, NGINX App Protect reaches Draft 7, Zuplo is on
2020-12, and KrakenD supports several at once, so even a task as narrow as
validating requests in a gateway has no one-dialect answer. The LLM
structured-output APIs are worse still, each accepting its own incompatible
subset that is not a clean dialect at all.

![The same table, stacked by what kind of adopter each entry is. Draft 4's
lead is mostly commercial, 22 of its 37 entries, while Draft 7 and 2020-12
lean open source and standards. An adopter that supports several dialects is
counted in each one, so the bars are row entries rather than unique adopters.
Source: each project's own documentation or published schemas](adopters.webp)

## Where fragmentation bites

The fragmentation is not a theoretical worry. It surfaces as a steady stream
of GitHub issues, and the same failures show up from one project to the next,
often with similar error strings. Here is what it looks like, one trap at a
time.

### The hard reject

A tool that supports exactly one dialect does not adapt to a schema written in
another. It rejects it outright, before any validation happens, so the
mismatch surfaces as a flat refusal rather than a wrong answer. The clearest
live example is the Model Context Protocol, where servers built with the [MCP
TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) tag
their tool schemas as Draft 7 while Claude's client validates against 2020-12
and nothing else.

The schema is discarded before a single request is made, with an error that
names the exact problem:

> Tool '\<name\>' has an invalid outputSchema: JSON Schema declares an
> unsupported dialect ("$schema": "http://json-schema.org/draft-07/schema#").
> The default validator supports JSON Schema 2020-12 only

That one report drew 54 comments ([claude-code
#86142](https://github.com/anthropics/claude-code/issues/86142)), and the
cause is mundane. The SDK *"falls back to 'draft-7' whenever no explicit
target is passed"* ([typescript-sdk
#2721](https://github.com/modelcontextprotocol/typescript-sdk/issues/2721)).

The same error shows up in other MCP projects too, like the reference file
server ([servers
#4841](https://github.com/modelcontextprotocol/servers/issues/4841)) and the
[mcp-use](https://github.com/mcp-use/mcp-use) client ([mcp-use
#1839](https://github.com/mcp-use/mcp-use/issues/1839)). But this is not an
MCP problem. It is what any single-dialect tool does.
[AJV](https://ajv.js.org) defaults to Draft 7, so feed it a 2020-12 schema and
it fails with `no schema with key or ref` unless you pass `--spec=draft2020`
([ajv-cli #251](https://github.com/ajv-validator/ajv-cli/issues/251)). And
some tools never made the jump at all, like
[react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form),
which still cannot handle 2020-12 ([rjsf
#3750](https://github.com/rjsf-team/react-jsonschema-form/issues/3750), [rjsf
#3751](https://github.com/rjsf-team/react-jsonschema-form/issues/3751)).

The same loud failure happens keyword by keyword, not only for a schema as a
whole.
[`exclusiveMinimum`](https://www.learnjsonschema.com/2020-12/validation/exclusiveminimum/)
flipped from a boolean flag to a numeric bound between Draft 4 and Draft 6, so
a validator built for one form errors on the other ([kogosoftwarellc
#776](https://github.com/kogosoftwarellc/open-api/issues/776)). Array
[`items`](https://www.learnjsonschema.com/draft4/validation/items/) became
[`prefixItems`](https://www.learnjsonschema.com/2020-12/applicator/prefixitems/)
in 2020-12, crashing generators that still expect an `items` key, with
[orval](https://github.com/orval-labs/orval) dying on `All arrays must have an
items key define` ([orval
#890](https://github.com/orval-labs/orval/issues/890)) and
[openapi-generator](https://github.com/OpenAPITools/openapi-generator) hitting
the same wall twice ([openapi-generator
#19704](https://github.com/OpenAPITools/openapi-generator/issues/19704),
[openapi-generator
#17923](https://github.com/OpenAPITools/openapi-generator/issues/17923)). And
keywords like
[`minContains`](https://www.learnjsonschema.com/2020-12/validation/mincontains/)
or [`$anchor`](https://www.learnjsonschema.com/2020-12/core/anchor/) are
flagged "unknown" under the wrong dialect ([AJV
#1872](https://github.com/ajv-validator/ajv/issues/1872), [AJV
#1854](https://github.com/ajv-validator/ajv/issues/1854)).

### The silent trap

Worse than a loud rejection is no error at all. A dialect change can render a
once-valid keyword unknown, sometimes changing a schema's meaning by accident.
As JSON Schema TSC member Ben Hutton puts it, an unknown keyword *["is just
going to be ignored. You won't get an error. It makes no noise.
Silence."](https://words.benhutton.me/2025-01-20-openai-chatgpt-and-structured-output-with-json-schema-pt1)*

The move from OpenAPI 3.0 to 3.1 is full of these. `nullable` was a real
keyword in 3.0 but does not exist in 2020-12, so a 3.1 document that still
emits it simply loses that information:

> nullable: true is emitted as-is. OpenAPI 3.1 uses JSON Schema 2020-12, where
> nullable no longer exists ... Tools reading a 3.1 document ignore it, so the
> nullability is silently lost.

The same silent drop runs through all 579 `nullable` occurrences in
[Svix](https://www.svix.com)'s published spec ([svix
#2551](https://github.com/svix/svix-webhooks/issues/2551), [fastify-swagger
#954](https://github.com/fastify/fastify-swagger/issues/954)). Other changes
are just as quiet. An
[`exclusiveMinimum`](https://www.learnjsonschema.com/2020-12/validation/exclusiveminimum/)
bound can vanish on upgrade, *"left as `undefined`"* with nothing flagged
([scalar #10235](https://github.com/scalar/scalar/issues/10235)). A bare
`type: "null"` can conjure a phantom model in a code generator
([openapi-generator
#24520](https://github.com/OpenAPITools/openapi-generator/issues/24520)). In
[n8n](https://n8n.io), the same Draft 7 versus 2020-12 mismatch from the hard
reject above never surfaces. The MCP server's tool schemas are discarded for
declaring the wrong dialect, and the only sign is *"zero tools appear in chat,
with no visible error"* ([n8n
#36361](https://github.com/n8n-io/n8n/issues/36361)).

### The mixed-dialect trap

[JSON Schema was designed to let a single document mix
dialects](https://json-schema.org/draft/2020-12/json-schema-core.html). So a
2020-12 document that references a Draft 7 GeoJSON schema is spec-valid. The
tools, though, often disagree. For example, reference a Draft 7 schema from a
2020-12 document, and a tool may apply the newer dialect across the reference,
where a keyword like
[`dependencies`](https://www.learnjsonschema.com/draft7/validation/dependencies/)
no longer exists. The [CoverageJSON](https://covjson.org) maintainers hit
exactly this wall:

> OpenAPI 3.1 base their schema on JSON Schema Specification Draft 2020-12 ...
> But https://covjson.org/schema/dev/coveragejson.json is based on
> http://json-schema.org/draft-07/schema, which is an older version of
> JSON-Schema.

The thread ran to 24 comments before it was understood ([CoverageJSON
#205](https://github.com/opengeospatial/CoverageJSON/issues/205)).

The same failure shows up wherever a cross-dialect reference is bundled or
resolved. [Redocly](https://github.com/Redocly/redocly-cli) trips on bundling
a 2020-12 root into an OpenAPI 3.1 spec ([redocly-cli
#1613](https://github.com/Redocly/redocly-cli/issues/1613)),
[json-schema-ref-parser](https://github.com/APIDevTools/json-schema-ref-parser)
on the [`$id`](https://www.learnjsonschema.com/2020-12/core/id/) and
[`$ref`](https://www.learnjsonschema.com/2020-12/core/ref/) changes from
2019-09 ([json-schema-ref-parser
#145](https://github.com/APIDevTools/json-schema-ref-parser/issues/145)),
[python-jsonschema](https://github.com/python-jsonschema/jsonschema) on an
embedded 2020-12 meta-schema ([python-jsonschema
#884](https://github.com/python-jsonschema/jsonschema/issues/884)) and on a
resolver rewrite that broke a working STAC schema ([python-jsonschema
#1064](https://github.com/python-jsonschema/jsonschema/issues/1064)).

### Why multi-dialect tooling is not enough

So the obvious fix suggests itself: make every tool speak every dialect. Many
already try, since general-purpose validators tend to support several dialects
at once. But that alone cannot close the gap. Even a perfectly multi-dialect
validator has no say over what happens next, as your schema flows on into
someone else's gateway, code generator, editor, and LLM endpoint. There will
always be one more consumer, or one more publisher, working in a different
dialect than you expected. Making every tool speak every dialect is the right
idea in principle and impossible to guarantee in practice.

## Auto-upgrade the schema, and why nobody has finished the job

The holy grail is easy to state. You write a schema once, in whatever dialect
was current at the time, and from then on your tooling transforms it on the
fly into whatever dialect each consumer needs, including dialects that have
not been published yet. The endless question of which dialect to write in,
which dialect to support, which dialect a given tool happens to speak, simply
disappears for good.

This is what Sourcemeta's
[auto-upgrade](https://github.com/sourcemeta/jsonschema/blob/main/docs/upgrade.markdown)
does. The idea itself is not new, and people have written dialect upgraders
for years, but none of them gets the whole job right.

| Capability | [json-schema-migrate](https://github.com/ajv-validator/json-schema-migrate) | [json-schema-migrate-x](https://github.com/un-ts/json-schema-migrate-x) | [jsonschema-migrate](https://crates.io/crates/jsonschema-migrate) (Rust) | **[Sourcemeta](https://www.sourcemeta.com)** |
|---|---|---|---|---|
| Repoints [`$ref`](https://www.learnjsonschema.com/2020-12/core/ref/) after a keyword moves | No | No | Partial (only `#/definitions`) | **Yes** |
| Fixes [`$anchor`](https://www.learnjsonschema.com/2020-12/core/anchor/) references | No (emits invalid names) | No (emits invalid names) | No (deletes anchors) | **Yes** |
| Guards new keywords | No | No | No | **Yes** |
| Embedded resources | Yes | Yes | No | **Yes** |
| Mixed-dialect documents | No (force one dialect) | No (force one dialect) | No (inner left unconverted) | **Yes** |
| Handles a stray `$schema` (invalid without `$id`) | No (leaves it) | No (rewrites it to the 2020-12 URI) | No (leaves it) | **Yes** |
| Emits the requested dialect | No (writes 2019-09) | Yes | Yes | **Yes** |
| Source dialects | Draft 4 | Draft 4 | Draft 4 to 2019-09 | **Draft 3 to 2020-12, and OpenAPI 3.0/3.1** |
| Target dialects | Draft 6 to 2020-12 | Draft 6 to 2020-12 | 2020-12 only | **Draft 4 to 2020-12, and OpenAPI 3.1/3.2** |
| OpenAPI 3.0 schemas | No | No | No | **Yes** |
| OpenAPI 3.1 / 3.2 custom vocabularies | No | No | No | **Yes** |
| Maintained | No (2021) | Yes | Yes | **Yes** |

> **Note:** tools that only upgrade schemas inside an OpenAPI document, such
> as [Scalar's
> openapi-upgrader](https://www.npmjs.com/package/@scalar/openapi-upgrader),
> [swagger2openapi](https://github.com/Mermade/oas-kit), and
> [openapi-down-convert](https://github.com/apiture/openapi-down-convert), are
> left out of the table above, since none can take a standalone JSON Schema.

JSON Schema is a [complex language](https://arxiv.org/abs/2307.10034), and
upgrading it correctly across dialects is a massive undertaking. The table
above is a non-exhaustive sample of the aspects that make it hard, and there
are many more, some extremely subtle, like the
[`$anchor`](https://www.learnjsonschema.com/2020-12/core/anchor/) keyword
quietly dropping the colon from its legal characters between 2019-09 and
2020-12. Sourcemeta is committed to getting all of them right, every time.

## Using it today

There are two ways to get a schema in the dialect a given tool expects, and
they suit different workflows. The command line is for local development,
where you upgrade a schema yourself when you need it. The registry is for
publishing at an organisation's scale, where you store one schema and let each
consumer ask for the dialect it wants, so nobody upgrades anything by hand.

### The JSON Schema CLI

The [`jsonschema
upgrade`](https://github.com/sourcemeta/jsonschema/blob/main/docs/upgrade.markdown)
command upgrades a schema on the spot. Point it at a file and name the target
dialect. Take this Draft 3 schema, which embeds a Draft 7 resource of its own:

```json
{
  "$schema": "http://json-schema.org/draft-03/schema#",
  "id": "https://schemas.my-corp.com/order",
  "type": "object",
  "properties": {
    "quantity": { "type": "integer", "divisibleBy": 5, "required": true },
    "express": { "$ref": "#/dependencies/creditCard" },
    "shipTo": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "$id": "https://schemas.my-corp.com/address",
      "type": "object",
      "dependencies": { "number": [ "street" ] }
    }
  },
  "dependencies": {
    "creditCard": { "required": [ "billingAddress" ] }
  }
}
```

Run:

```sh
jsonschema upgrade order.json --to 2020-12
```

and you get:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.my-corp.com/order",
  "type": "object",
  "required": [ "quantity" ],
  "properties": {
    "quantity": { "type": "integer", "multipleOf": 5 },
    "express": { "$ref": "#/dependentSchemas/creditCard" },
    "shipTo": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://schemas.my-corp.com/address",
      "type": "object",
      "dependentRequired": { "number": [ "street" ] }
    }
  },
  "dependentSchemas": {
    "creditCard": { "required": [ "billingAddress" ] }
  }
}
```

In one pass it took the outer schema from Draft 3 to 2020-12. It renamed
[`id`](https://www.learnjsonschema.com/draft3/core/id/) to
[`$id`](https://www.learnjsonschema.com/2020-12/core/id/), moved the
per-property
[`required`](https://www.learnjsonschema.com/2020-12/validation/required/)
flag up into an array, and turned
[`divisibleBy`](https://www.learnjsonschema.com/draft3/core/divisibleby/) into
[`multipleOf`](https://www.learnjsonschema.com/2020-12/validation/multipleof/).
Each use of
[`dependencies`](https://www.learnjsonschema.com/draft3/core/dependencies/)
split by form, the schema-valued one into
[`dependentSchemas`](https://www.learnjsonschema.com/2020-12/applicator/dependentschemas/)
and the property list into
[`dependentRequired`](https://www.learnjsonschema.com/2020-12/validation/dependentrequired/).
The [`$ref`](https://www.learnjsonschema.com/2020-12/core/ref/) in `express`
repointed to match. The embedded `shipTo` resource is on a different dialect,
Draft 7. It was upgraded on its own terms in the same pass.

### Sourcemeta One

The command line is fine for a one-off, or a script that walks a directory.
But an organisation can hold thousands of schemas across many dialects, owned
by different teams and changing all the time. Upgrading each one by hand does
not scale, and neither does keeping a converted copy for every consumer.

Say the `order` schema above lives in a [Sourcemeta
One](https://one.sourcemeta.com) instance at `schemas.my-corp.com`. You choose
the dialect you want with an `as` query parameter on the fetch URL. A team
still on an older validator asks for Draft 7:

```
https://schemas.my-corp.com/order?as=draft7
```

Another team on a modern stack asks the same path for 2020-12:

```
https://schemas.my-corp.com/order?as=2020-12
```

One schema is stored, and each consumer gets the dialect it asks for. Those
URLs are ordinary references too, so they drop into whatever consumes the
schema. An OpenAPI 3.1 description can point a request body straight at the
2020-12 form:

```yaml
openapi: 3.1.0
info:
  title: Orders
  version: 1.0.0
paths:
  /orders:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: "https://schemas.my-corp.com/order?as=2020-12"
```

A conversion always arrives bundled, so every reference inside travels already
converted. A consumer never follows a
[`$ref`](https://www.learnjsonschema.com/2020-12/core/ref/) into a document
left in the old dialect. The full contract is in the [Sourcemeta One HTTP
API](https://one.sourcemeta.com/api/#fetch).

## Next steps

**Custom meta-schemas.** Auto-upgrade covers the official dialects, but not a
meta-schema or a schema that declares a custom one. A meta-schema describes a
dialect by naming that dialect's keywords as ordinary data, often under
[`properties`](https://www.learnjsonschema.com/2020-12/applicator/properties/)
or
[`patternProperties`](https://www.learnjsonschema.com/2020-12/applicator/patternproperties/).
Upgrading renames the keywords in a schema, but it cannot tell which of those
data strings also meant a keyword and should move with them. So a conversion
can succeed and still leave the result out of step with the meta-schema, and
the meta-schema with its vocabularies. We are exploring meta-schema-level
hints to carry the intent that cannot be inferred today.

**Downgrades.** Auto-upgrade only goes one way today. Going the other way is
harder, since a newer dialect can often express things an older one cannot.
Our [preliminary
research](https://github.com/json-schema-org/upgrade-downgrade-rules), from a
[Google Summer of Code
project](https://github.com/json-schema-org/community/issues/599), found that
more cases are possible than expected.

**Swagger 2.0.** Auto-upgrade starts at OpenAPI 3.0, not the older [Swagger
2.0](https://spec.openapis.org/oas/v2.0.html). There has been almost no demand
for it, and the numbers above show it trailing OpenAPI 3.0 several times over.
We will consider adding it if enough people ask.

The specification is also trying to end new fragmentation at the source. Its
next release, JSON Schema v1, makes [backward compatibility a
priority](https://json-schema.org/blog/posts/stable-json-schema) after [one
last breaking change](https://json-schema.org/blog/posts/the-last-breaking-change).
But that is the long game, and the dialects already deployed are not going
anywhere, as the numbers above show. Auto-upgrade is for the fragmentation you
have now.
