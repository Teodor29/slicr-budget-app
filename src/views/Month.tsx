import Overview from "./Overview"
import Transactions from "./Transactions"

interface Props {
  mobileView: "overview" | "transactions"
}

function mobileVisibility(isVisible: boolean) {
  if (isVisible) return ""
  return "hidden md:block"
}

export default function Month({ mobileView }: Props) {
  return (
    <div className="md:grid md:grid-cols-[3fr_2fr] md:gap-6 md:items-start">
      <section
        className={`md:sticky md:top-8 md:max-h-[calc(100dvh-4rem)] md:overflow-y-auto no-scrollbar ${mobileVisibility(mobileView === "overview")}`}
      >
        <Overview />
      </section>
      <section className={mobileVisibility(mobileView === "transactions")}>
        <Transactions />
      </section>
    </div>
  )
}
