import { ChevronRight, type LucideIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
    isActive?: boolean
  }[]
}

const NavMain = ({
  items,
  groupLabel = "Management",
}: {
  items: NavItem[]
  groupLabel?: string
}) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null)

  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {}

    items.forEach((item) => {
      const hasActiveSubItem = item.items?.some((subItem) => subItem.isActive)

      if (hasActiveSubItem || item.isActive) {
        initialOpenState[item.title] = true

        if (item.isActive) {
          setActiveItem(item.title)
        }

        if (hasActiveSubItem) {
          const activeSubItemTitle = item.items?.find((subItem) => subItem.isActive)?.title
          if (activeSubItemTitle) {
            setActiveSubItem(activeSubItemTitle)
          }
        }
      }
    })

    setOpenItems(initialOpenState)
  }, [items])

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
    setActiveItem(title)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">{groupLabel}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              open={openItems[item.title]}
              onOpenChange={(open) => setOpenItems((prev) => ({ ...prev, [item.title]: open }))}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`
                      relative cursor-pointer py-2.5 transition-all duration-200
                      ${
                        activeItem === item.title || item.isActive
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      }
                    `}
                    onClick={() => toggleItem(item.title)}
                  >
                    {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.items?.length ? (
                      <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-70 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    ) : null}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={activeSubItem === subItem.title || subItem.isActive}>
                            <Link
                              to={subItem.url}
                              onClick={() => setActiveSubItem(subItem.title)}
                              className="transition-colors duration-200"
                            >
                              <span className="truncate">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default NavMain

