+++
title = "Licensing"
type = "article"
+++

{{<lead>}} At Sourcemeta, we are committed to continuously produce world-class
open-source software that challenges the status quo. Realistically, that is not
possible without funding.{{</lead>}}

Our approach to licensing is for our software to be *free for open-source,
non-profit, research, or personal use*. However, to ensure the sustainability
of our projects, exploiting our core technology advancements to power
for-profit proprietary products requires giving back.

That's why the software we produce is typically published under the
[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html) copy-left license.
This is an [OSI-approved](https://opensource.org/license/agpl-v3) modern
variant of the original
[GPL](https://en.wikipedia.org/wiki/GNU_General_Public_License#Version_3)
license introduced by Richard Stallman as part of the Free Software movement.
You already know and use many projects released under this family of licenses,
such as the [Linux
Kernel](https://www.kernel.org/doc/html/latest/process/license-rules.html), the
[GCC Compiler](https://gcc.gnu.org/onlinedocs/libstdc++/manual/license.html),
[Bash](https://www.gnu.org/software/bash/), the [VLC Media
Player](https://www.videolan.org/legal.html), and the popular
[MinIO](https://min.io) S3-compatible object store.

Complying with the AGPL
-----------------------

The most prominent condition of our AGPL projects is that you cannot create
derivatives that are not AGPL as well. However, this condition applies
differently depending on whether you are consuming a library or an application
in binary form (i.e. a CLI or a micro-service). In a nutshell:

- **Integrating with a Sourcemeta AGPL library**: Any program that links to an
  AGPL library (including as bindings to other programming languages)
  constitutes a derivative work of such library and MUST be released under the
  AGPL license, _even if no modifications were made_

- **Integrating with a Sourcemeta AGPL application**: You are free to integrate
  and distribute an AGPL application in binary form into a larger proprietary
  or open-source application WITHOUT releasing your application under the AGPL.
  You are also allowed to make your own modifications to the AGPL application,
  given you release _those modifications_ (and only those modifications) under
  the AGPL too

Commercial Use
--------------

If you need to be able to bypass the aforementioned limitations, we can issue
perpetual and/or subscription-based commercial licenses that removes all
copy-left restrictions.  Think of it as an enforced donation that keeps our
projects healthy while giving you additional perks like premium support.

**Qualifying for free licenses:** Additionally, we typically issue free
commercial licenses to research goverment organisations, non-profit
organisations, organisations dedicated to global sustainability, notable
external contributors to our projects, and organisations that hire Sourcemeta
on general consultancy or custom development deals.

To discuss more, don't hesitate in reaching out to hello@sourcemeta.com. If you
are a potential contributor, also take a look at our [Contribution
Agreement](https://github.com/sourcemeta/.github/blob/main/CONTRIBUTING.md).
