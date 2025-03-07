import { UserPlus, Calendar, Package, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"

// Sample data with more details
const activities = [
  {
    id: 1,
    type: "customer",
    message: "New customer: John Doe",
    time: "10 minutes ago",
  },
  {
    id: 2,
    type: "appointment",
    message: "New appointment: Poodle grooming service",
    time: "30 minutes ago",
  },
  {
    id: 3,
    type: "inventory",
    message: "New stock added: Pet shampoo",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "appointment",
    message: "Completed service: Bath for British Shorthair cat",
    time: "2 hours ago",
  },
]

const DashboardRecentActivity = () => {
  // Function to get the appropriate icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "customer":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "appointment":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "inventory":
        return <Package className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className="shadow-md h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
            <CardDescription>Latest activities in the system</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No recent activities</p>
          ) : (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="mt-0.5 bg-muted p-1.5 rounded-full">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link to="/admin/activities" className="text-sm text-primary hover:underline">
          View all activities
        </Link>
      </CardFooter>
    </Card>
  )
}

export default DashboardRecentActivity
