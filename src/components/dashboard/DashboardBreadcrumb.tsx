import { useLocation } from "react-router-dom"
import { ChevronRight, Home, MoreHorizontal } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const pathNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Customers",
  employees: "Employees",
  services: "Services",
  appointments: "Appointments",
  inventory: "Inventory",
  reports: "Reports",
  settings: "Settings",
}

const getReadableName = (segment: string): string => {
  if (pathNameMap[segment.toLowerCase()]) {
    return pathNameMap[segment.toLowerCase()]
  }

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

interface DashboardBreadcrumbProps {
  className?: string
  maxItems?: number
}

const DashboardBreadcrumb = ({ className, maxItems = 4 }: DashboardBreadcrumbProps) => {
  const location = useLocation()
  const pathSegments = location.pathname.split("/").filter(Boolean)

  if (pathSegments.length === 0) {
    pathSegments.push("dashboard")
  }

  const needsCollapse = pathSegments.length > maxItems

  const visibleSegments = needsCollapse ? [...pathSegments.slice(0, 1), "...", ...pathSegments.slice(-2)] : pathSegments

  const hiddenSegments = needsCollapse ? pathSegments.slice(1, -2) : []

  return (
    <div className={cn("flex items-center h-12 px-4 bg-white border-b shadow-sm", className)}>
      <div className="container flex items-center max-w-screen-2xl mx-auto">
        <Breadcrumb className="flex items-center">
          <BreadcrumbList className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {visibleSegments.map((segment, index) => {
              const isLast = index === visibleSegments.length - 1
              const isCollapsed = segment === "..."

              const segmentPath = isCollapsed
                ? "#"
                : `/${pathSegments.slice(0, pathSegments.indexOf(segment) + 1).join("/")}`

              return (
                <BreadcrumbItem key={`${segment}-${index}`}>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </BreadcrumbSeparator>

                  {isCollapsed ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {hiddenSegments.map((hiddenSegment, hiddenIndex) => {
                          const hiddenPath = `/${pathSegments.slice(0, pathSegments.indexOf(hiddenSegment) + 1).join("/")}`
                          return (
                            <DropdownMenuItem key={hiddenIndex} asChild>
                              <BreadcrumbLink href={hiddenPath}>{getReadableName(hiddenSegment)}</BreadcrumbLink>
                            </DropdownMenuItem>
                          )
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : isLast ? (
                    <BreadcrumbPage className="font-medium text-foreground">{getReadableName(segment)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={segmentPath}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {getReadableName(segment)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}

export default DashboardBreadcrumb

