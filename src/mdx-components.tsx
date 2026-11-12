import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-12 mb-4 border-b border-grid pb-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-8 mb-3 font-mono text-base font-bold tracking-wider text-telemetry uppercase" {...props} />
  ),
  p: (props) => <p className="my-4 text-base leading-relaxed text-secondary" {...props} />,
  ul: (props) => <ul className="my-4 space-y-2 pl-5 text-base leading-relaxed text-secondary list-disc" {...props} />,
  ol: (props) => (
    <ol className="my-4 space-y-2 pl-5 text-base leading-relaxed text-secondary list-decimal" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-signal bg-surface/60 px-5 py-4 font-serif text-lg italic text-ink"
      {...props}
    />
  ),
  code: (props) => (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-telemetry" {...props} />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto border border-grid-strong bg-surface p-4 font-mono text-xs leading-relaxed text-ink"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
