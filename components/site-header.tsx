import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-end gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-zinc-900 border-zinc-800 pb-2">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 flex items-center ">
        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-white hover:bg-zinc-800 pt-4" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto mt-4"
        />
        <h1 className="text-white text-2xl font-medium pt-4">Dashboard</h1>
      </div>
    </header>
  )
}