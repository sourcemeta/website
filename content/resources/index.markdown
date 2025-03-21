+++
title = "Resources"
type = "article"
+++

The core of our software is written in C++ (and may interface with C and
Objective-C), relies on the CMake build system, and targets macOS, Windows, and
GNU/Linux. If you are looking to contribute, you might find the following
resources handy.

### CMake

(Book) [**Professional CMake**](https://crascit.com/professional-cmake/). _The
best book to learn CMake in-depth, including following best practices.  It
directly inspired many of the CMake utilities we ship with
[Noa](https://github.com/sourcemeta/noa)_.

(Website) [**CMake Reference
Documentation**](https://cmake.org/cmake/help/latest/). _The official
authoritative CMake documentation. Pro Tip: If you are a macOS user, you can
download the CMake Reference Documentation for offline consumption through the
Homebrew [`cmake-docs`](https://formulae.brew.sh/formula/cmake-docs) formula
and create a browser bookmark to
`.file:///opt/homebrew/share/doc/cmake/html/genindex.html` for easy searching_

### C++

(Book) [**The C++ Programming Language (4th
Edition)**](https://stroustrup.com/4th.html). _While there is no single book
that covers the entirery of C++ (mainly when it comes to more modern versions),
this one gets close. Its written by the original author of C++ and considered
by many the bible of modern C++_.

(Website) [**C++ Reference**](http://www.cppreference.com). _The most complete
reference documentation for C++. Signing up allows to tweak site settings to
your liking. The site has a very handy page for checking C++ support across
compilers [here](https://en.cppreference.com/w/cpp/compiler_support). Pro Tip:
You can download the documentation for offline consumption
[here](https://en.cppreference.com/w/Cppreference:Archives)._.

(Standard) [**ISO C++**](https://isocpp.org/std/the-standard). _While its
mostly for implementors, it is the source of truth for what is compliant across
compilers and can be handy for areas of C++ that documentation sites fail to
properly describe. Pro Tip: You can access the work-in-progress drafts for free
on [GitHub](https://github.com/cplusplus/draft)_.

(Specification) **[Itanium C++
ABI](https://itanium-cxx-abi.github.io/cxx-abi/abi.html) and its [Exception
Handling](https://itanium-cxx-abi.github.io/cxx-abi/abi-eh.html) companion**.
_Defines foundational guidance for increased C++ interoperability across
compilers. It is what
[`libunwind`](https://clang.llvm.org/docs/Toolchain.html#unwind-library)
(`_Unwind_*` functions), and [`libcxxabi`](https://libcxxabi.llvm.org)
(`__cxa_*` functions) on LLVM implement to support the C++ language (other
major compilers like GCC do as well). You rarely need to worry about this, but
it can be useful to understand what happens under the hood to make more sense
of stack traces and help with reverse engineering of C++ binaries._

(Website) [**Compiler Explorer**](https://godbolt.org). _A convenient web
application to understand the assembly that various compilers would generate on
different configurations. Pro Tip: Hovering over the assembly instructions
shows human-readable explanations_.

(Website) [**C++ Insights**](https://cppinsights.io). _A convenient web
application that reveals how compilers convert higher-level C++ language
abstractions into lower-level constructs during the compilation process. It
helps a lot with understanding how C++ works_.

(Website) [**Quick C++ Benchmark**](https://quick-bench.com). _A convenient web
application to run and plot quick benchmark tests written using the [Google
Benchmark](https://github.com/google/benchmark) library. See Ash Vardanian's
excellent interactive [less
slow](https://github.com/ashvardanian/less_slow.cpp/blob/main/less_slow.cpp)
C++ Google Benchmark essay on high-performance computing in C++_.

(Code) [**LLVM C++ Standard
Library**](https://github.com/llvm/llvm-project/tree/main/libcxx). _The LLVM
implementation of the `std` namespace, which you can use to understand how
built-in containers, algorithms, and utilities are implemented. Pro Tip: you
can compile a program against a custom build of the standard library, allowing
you to better step through and profile non-template-related standard library
usage. Also see [Debugging the C++ standard library on
macOS](https://www.jviotti.com/2022/05/05/debugging-the-cxx-standard-library-on-macos.html),
a post discussing how to do it on macOS_.

### C

(Code) [**XNU C Standard
Library**](https://github.com/apple-oss-distributions/xnu/tree/main/bsd/sys).
_To consult Darwin's C standard library and POSIX implementation (originally
derived from FreeBSD), which powers every Apple platform. However, keep in mind
that Apple only releases snapshots of XNU at certain intervals, so don't expect
the code to match what's on modern devices_.

(Standard) [**IEEE POSIX C
Standard**](https://standards.ieee.org/ieee/1003.1/7101/). _This is the
standard that defines the C interfaces that POSIX systems must adhere too. A
must have if you expect to do any lower-level systems engineering on POSIX
based platforms like macOS and GNU/Linux_.

### Objective-C

(Application) [**RuntimeBrowser**](https://github.com/nst/RuntimeBrowser). _An
unmaintained, but still working, native macOS and iOS application to browser
public and private Objective-C frameworks that ship with macOS and iOS. Can be
useful if you need to understand and potentially use private APIs that Apple
doesn't publicly document. Also see [Exploring macOS private
frameworks](https://www.jviotti.com/2023/11/20/exploring-macos-private-frameworks.html),
a post that teaches techniques for exploring private macOS Objective-C
frameworks using the RuntimeBrowser application and other tools._

### macOS

(Application) [**Xcode
Instruments**](https://help.apple.com/instruments/mac/current/#/dev7b09c84f5).
_The de-facto profiling and performance analysis tool for Apple platforms
(largely a frontend to [DTrace](https://dtrace.org/about/)), which comes as a
standalone desktop application shipped as part of the Xcode package. See [Using
Xcode Instruments for C++ CPU
profiling](https://www.jviotti.com/2024/01/29/using-xcode-instruments-for-cpp-cpu-profiling.html),
[Emitting Signposts to Instruments on macOS using
C++](https://www.jviotti.com/2022/02/21/emitting-signposts-to-instruments-on-macos-using-cpp.html),
and [Studying C++ generated assembly using Xcode
Instruments](https://www.jviotti.com/2025/03/21/studying-cpp-generated-assembly-using-xcode-instruments.html)
for more detailed information on using Instruments for C++ performance
analysis._

(Specification) [**Mach-O File Format
Reference**](https://github.com/aidansteele/osx-abi-macho-file-format-reference/blob/master/Mach-O_File_Format.pdf).
_The original Apple reference documentation for the Mach-O binary format, to
understand how executable binaries and shared libraries work on macOS. You
might be also interested in [A deep dive on macOS universal
binaries](https://www.jviotti.com/2021/07/23/a-deep-dive-on-macos-universal-binaries.html),
a post that discusses Mach-O universal binaries in more depth._

(Application) [**MachOView**](https://sourceforge.net/projects/machoview/). _An
abandoned, but still working, native desktop application to explore Mach-O
files in a more user-friendly manner. Homebrew continues to offer it as a cask
called [`machoview`](https://formulae.brew.sh/cask/machoview)_.

(Website) [**Apple Developer macOS Performance
Tools**](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/PerformanceOverview/PerformanceTools/PerformanceTools.html).
_A guide to the various utilities included in macOS for system and performance
analysis, such as `vm_stat(1)`, `leaks(1)`, `malloc_history(1)`, and `heap(1)`.
While these tools can be useful, for C++ development we recommend learning
[DTrace](https://dtrace.org/about/) and
[Instruments](https://help.apple.com/instruments/mac/10.0/) instead. If you are
looking for general information about the CPU and caches available on your
system, try `sysctl -a hw machdep.cpu` and `lstopo(1)` from
[`hwloc`](https://formulae.brew.sh/formula/hwloc)._

(Book) [**DTrace: Dynamic Tracing in Oracle Solaris, Mac OS X and
FreeBSD**](https://www.amazon.com/gp/product/0132091518). _The best resource to
learn how to use the [DTrace](https://dtrace.org/about/) tool that ships with
macOS for advanced kernel and user dynamic tracing. While its non-trivial to
learn and use, it is considered to be the ultimate tool for performance
analysis on macOS. Pro Tip: macOS ships with
[DTraceToolkit](https://github.com/opendtrace/toolkit), a collection of premade
DTrace scripts for a variety of use cases_.

(Book) [**Advanced Apple Debugging & Reverse Engineering, 3rd
Edition**](https://www.kodeco.com/books/advanced-apple-debugging-reverse-engineering/v3.0).
_An in-depth guide to reverse engineering in Apple platforms with a strong
focus on [LLDB](https://lldb.llvm.org). Even if reverse engineering is not your
focus, this book teaches valuable general-purpose debugging skills and LLDB
tricks that apply to software engineering_.

(Specification) [**Arm Instruction Set Reference Guide Version
1.0**](https://developer.arm.com/documentation/100076/0100). _A
freely-available and searchable reference document for the ARM instruction set
that Apple Silicon adopts. Also see
[HelloSilicon](https://github.com/below/HelloSilicon), an adaptation of the
[Programming with 64-Bit ARM Assembly
Language](https://link.springer.com/book/10.1007/978-1-4842-5881-1) popular
book to Apple Silicon._

(Book) **[MacOS and iOS Internals, Volume I: User
Mode](https://www.amazon.com/MacOS-iOS-Internals-User-Mode/dp/099105556X),
[MacOS and iOS Internals, Volume II: Kernel
Mode](https://www.amazon.com/dp/0991055578), and [MacOS and iOS Internals,
Volume III: Security & Insecurity](https://www.amazon.com/dp/0991055535)**.
_The industry standard book trilogy describing the internals of Apple operating
systems_.

(Standard) [**DWARF Debugging Information Format
v4**](https://dwarfstd.org/doc/DWARF4.pdf). _The underlying format used by
`*.dSYM` debugging symbols on Apple platforms. It can help understanding the
human-readable output of `dwarfdump(1)`_.

### GNU/Linux

(Application) [**Intel VTune
Profiler**](https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html).
_A great commercial profiler for high-performace computing profiler for Intel
and AMD x86-based processors with advanced analysis tools. It is available for
free and supports various popular distributions. However, it can be tricky to
setup. See [Running the Intel VTune Profiler on
Fedora](https://www.jviotti.com/2024/10/08/running-the-intel-vtune-profiler-on-fedora.html)
for Fedora-specific instructions_.

### Reverse Engineering

(Website) [**Decompiler Explorer (Dogbolt)**](https://dogbolt.org). _A
convenient web application that can decompile a C++ binary using multiple
decompilers at the same time. Seeing the same code decompiled in potentially
different ways often makes it much easier to understand what is actually going
on_.

(Application) [**Hopper Disassembler**](https://www.hopperapp.com). _A great
disassembler desktop application for macOS with deep understanding of Apple
frameworks and Mach-O. While Hopper offers a license, the time-boxed free
version is enough for most cases. The paid version unlocks an LLDB frontend
that can be particularly useful for stepping through assembly code_. Also see
[Exploring macOS private
frameworks](https://www.jviotti.com/2023/11/20/exploring-macos-private-frameworks.html),
a post that teaches techniques for exploring private macOS Objective-C
frameworks using the Hopper application and other tools._
