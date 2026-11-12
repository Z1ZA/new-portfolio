import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Accent, SectionHeader } from "@/components/ui/SectionHeader";
import { GEAR } from "@/content/skills";

export function GearCheck() {
  return (
    <section
      id="gear"
      aria-labelledby="gear-heading"
      className="relative border-b border-grid py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <SectionHeader
          id="gear-heading"
          code="CP04"
          km={42}
          kicker="Mandatory Technical Kit Inspection"
          title={
            <>
              Tested <Accent>gear</Accent> for every terrain.
            </>
          }
          intro="Before an ultra-trail start, every runner passes a mandatory gear check. Here is the production stack I carry into AI infrastructure, web engineering, and operations."
        />

        <RevealGroup className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {GEAR.map((group) => (
            <RevealItem key={group.code} className="panel flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="hud flex items-center justify-between text-muted">
                  <span className="text-signal">KIT // {group.code}</span>
                  <span className="text-telemetry">✓ INSPECTED</span>
                </div>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">{group.title}</h3>
                <p className="mt-1 font-mono text-xs text-muted">{group.note}</p>

                <ul className="mt-6 divide-y divide-grid border-t border-grid">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <span className="font-medium text-ink">{item}</span>
                      <span
                        aria-hidden="true"
                        className="grid size-5 shrink-0 place-items-center border border-telemetry/50 bg-telemetry/10 font-mono text-xs text-telemetry"
                      >
                        ✓
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hud mt-6 border-t border-grid pt-4 text-muted">
                STATUS: <span className="text-ink">PRODUCTION READY</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
